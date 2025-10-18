from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize local AI model (no API credits needed!)
MODEL_NAME = "microsoft/DialoGPT-small"  # Much smaller and faster model

try:
    print(f"🤖 Loading local model: {MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    # Create pipeline for easier text generation
    generator = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        device=0 if device == "cuda" else -1,
        pad_token_id=tokenizer.eos_token_id
    )

    print(f"✅ Model loaded successfully on {device}")

except Exception as e:
    print(f"❌ Failed to load model: {e}")
    print("💡 Make sure you have enough RAM/GPU memory for the model")
    generator = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service',
        'model': MODEL_NAME,
        'device': 'cuda' if torch.cuda.is_available() else 'cpu',
        'local_model': True
    }), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_channel():
    """
    Analyze YouTube channel data and generate content strategy recommendations
    using Hugging Face Ling-1 model
    """
    try:
        data = request.get_json()
        
        if not data or 'scrapedData' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing scrapedData in request'
            }), 400
        
        scraped_data = data['scrapedData']
        channel = scraped_data.get('channel', {})
        videos = scraped_data.get('videos', [])
        
        # Construct prompt for AI analysis
        prompt = f"""You are a YouTube content strategy expert. Analyze this channel data and provide 5 specific, actionable content strategy recommendations.

Channel Information:
- Name: {channel.get('name', 'Unknown')}
- Subscribers: {channel.get('subscribers', 'Unknown')}

Recent Videos (with view counts):
"""
        
        # Add video information to prompt
        for idx, video in enumerate(videos[:15], 1):
            prompt += f"{idx}. {video.get('title', 'Unknown')} - {video.get('views', 'Unknown')} views\n"
        
        prompt += """

Based on this data, provide exactly 5 distinct categories with recommendations:

CONTENT THEMES:
• Content theme recommendation 1
• Content theme recommendation 2
• Content theme recommendation 3

TITLE OPTIMIZATION:
• Title optimization recommendation 1
• Title optimization recommendation 2
• Title optimization recommendation 3

UPLOAD STRATEGY:
• Upload strategy recommendation 1
• Upload strategy recommendation 2
• Upload strategy recommendation 3

ENGAGEMENT TACTICS:
• Engagement tactic recommendation 1
• Engagement tactic recommendation 2
• Engagement tactic recommendation 3

GROWTH OPPORTUNITIES:
• Growth opportunity recommendation 1
• Growth opportunity recommendation 2
• Growth opportunity recommendation 3

Provide 2-3 specific, actionable recommendations for each category using bullet points (•)."""

        # Call local AI model using transformers pipeline
        try:
            if generator is None:
                raise Exception("Local model not loaded")

            # Generate response using local model
            response = generator(
                prompt,
                max_length=len(prompt) + 500,  # Limit response length
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                num_return_sequences=1
            )

            # Extract the generated text (remove the input prompt)
            suggestions = response[0]['generated_text'][len(prompt):].strip()

            return jsonify({
                'success': True,
                'suggestions': suggestions
            }), 200
            
        except Exception as local_error:
            print(f"Local model error: {str(local_error)}")
            return jsonify({
                'success': False,
                'error': f'Local AI model error: {str(local_error)}'
            }), 500
    
    except Exception as e:
        print(f"Error in analyze_channel: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5002))
    print(f"🤖 AI Service starting on port {port}")
    print(f"📊 Using local model: {MODEL_NAME}")
    print(f"🔑 No API key needed - running locally!")
    app.run(host='0.0.0.0', port=port, debug=True)
