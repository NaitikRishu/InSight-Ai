import os
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load environment variables
load_dotenv()

# Helper function to parse view counts like "1.2M", "300K"
def parseViews(viewStr):
    if not viewStr or not isinstance(viewStr, str):
        return 0
    
    # Remove commas and convert to lowercase for consistency
    viewStr = viewStr.replace(',', '').strip()
    
    # Extract the number part (everything except the last character if it's K, M, B)
    if viewStr.endswith(('K', 'M', 'B')):
        num_str = viewStr[:-1]
        suffix = viewStr[-1]
    else:
        num_str = viewStr
        suffix = None
    
    try:
        num = float(num_str)
    except ValueError:
        return 0
    
    if suffix == 'K':
        return int(num * 1000)
    elif suffix == 'M':
        return int(num * 1000000)
    elif suffix == 'B':
        return int(num * 1000000000)
    else:
        return int(num)

# --- Model Loading ---
# Load the SmolLM2 model - much faster and smaller
print("Loading SmolLM2-135M-Instruct model...")
MODEL_NAME = "HuggingFaceTB/SmolLM2-135M-Instruct"
try:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(device)
    model.eval() # Set model to evaluation mode
    print(f"SmolLM2 model loaded successfully on {device}.")
except Exception as e:
    print(f"Error loading model: {e}")
    # Exit if model can't be loaded
    exit(1)
# ---------------------

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify service is running."""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service',
        'model': MODEL_NAME
    }), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_channel():
    """
    Analyzes scraped YouTube data using the local FLAN-T5 model.
    """
    try:
        data = request.json
        if not data or 'scrapedData' not in data:
            return jsonify({'success': False, 'error': 'Invalid data provided'}), 400

        scraped_data = data['scrapedData']
        channel = scraped_data.get('channel', {})
        videos = scraped_data.get('videos', [])

        # Calculate average views for the prompt
        total_views = sum([parseViews(v.get('views', '0')) for v in videos[:5]]) if videos else 0
        avg_views = total_views // len(videos[:5]) if videos and len(videos) > 0 else 0
        video_list_str = ""
        if not videos:
            video_list_str = "No recent videos found."
        else:
            for i, video in enumerate(videos[:15], 1):
                video_list_str += f"- \"{video.get('title', 'N/A')}\" (Views: {video.get('views', 'N/A')})\n"

        # Create video titles string
        video_titles = ', '.join([f'"{v.get("title", "N/A")}"' for v in videos[:3]]) if videos else 'comedy content'

        # Determine channel type based on content
        channel_name = channel.get('name', 'Unknown').lower()
        channel_type = 'general'
        
        if any(word in channel_name for word in ['comedy', 'funny', 'bassi', 'joke', 'humor']):
            channel_type = 'comedy'
        elif any(word in channel_name for word in ['tech', 'review', 'gadget', 'phone', 'computer']):
            channel_type = 'tech'
        elif any(word in channel_name for word in ['music', 'song', 'artist', 'band', 'singer']):
            channel_type = 'music'
        elif any(word in channel_name for word in ['gaming', 'game', 'play', 'stream']):
            channel_type = 'gaming'
        elif any(word in channel_name for word in ['fitness', 'workout', 'gym', 'health']):
            channel_type = 'fitness'
        elif any(word in channel_name for word in ['cooking', 'food', 'recipe', 'chef']):
            channel_type = 'cooking'
        
        # Create dynamic prompt based on channel type
        if channel_type == 'comedy':
            prompt = f"""Analyze this comedy YouTube channel: {channel.get('name', 'Unknown')} with {channel.get('subscribers', 'Unknown')}. 

Top videos: {video_list_str}

Provide 3 comedy-specific recommendations for content themes, titles, and upload strategy."""
        
        elif channel_type == 'tech':
            prompt = f"""Analyze this tech YouTube channel: {channel.get('name', 'Unknown')} with {channel.get('subscribers', 'Unknown')}. 

Top videos: {video_list_str}

Provide 3 tech-specific recommendations for content themes, titles, and upload strategy."""
        
        elif channel_type == 'music':
            prompt = f"""Analyze this music YouTube channel: {channel.get('name', 'Unknown')} with {channel.get('subscribers', 'Unknown')}. 

Top videos: {video_list_str}

Provide 3 music-specific recommendations for content themes, titles, and upload strategy."""
        
        else:
            prompt = f"""Analyze this YouTube channel: {channel.get('name', 'Unknown')} with {channel.get('subscribers', 'Unknown')}. 

Top videos: {video_list_str}

Provide 3 general recommendations for content themes, titles, and upload strategy."""
        
        # --- Generate Response ---
        print(f"Generating insights for channel: {channel.get('name', 'N/A')}")
        
        # Use chat template for SmolLM2
        messages = [{"role": "user", "content": prompt}]
        input_text = tokenizer.apply_chat_template(messages, tokenize=False)
        
        # Tokenize the input
        inputs = tokenizer.encode(input_text, return_tensors="pt").to(device)
        
        # Generate output
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_new_tokens=150,  # Shorter responses for faster generation
                temperature=0.8,
                top_p=0.9,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode the generated text
        full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract only the assistant's response (remove the input prompt)
        suggestions = full_response.split("assistant\n")[-1].strip() if "assistant\n" in full_response else full_response
        
        # Clean up and format the response
        suggestions = suggestions.replace('1.', '•').replace('2.', '•').replace('3.', '•')
        suggestions = suggestions.replace('**', '')
        
        # Ensure minimum response quality
        if len(suggestions.strip()) < 100:
            # Fallback if AI doesn't generate enough content
            suggestions = """CONTENT THEMES:
• Smartphone reviews and comparisons (your highest performers)
• Budget technology recommendations
• Emerging tech trends

TITLE OPTIMIZATION:
• Include specific model numbers
• Use comparison language ("vs", "better than")
• Add numbers and questions

UPLOAD STRATEGY:
• Post consistently 3-4 times per week
• Schedule during peak hours
• Mix content formats

ENGAGEMENT TACTICS:
• Ask questions in descriptions
• Respond to comments
• Use community polls

GROWTH OPPORTUNITIES:
• Collaborate with other creators
• Create Shorts content
• Expand to other platforms"""
        
        print("Successfully generated insights.")
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error during AI analysis'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('AI_SERVICE_PORT', 5002))
    # Use 0.0.0.0 to be accessible within Docker
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')