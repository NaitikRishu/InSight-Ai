import os
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Load environment variables
load_dotenv()

# --- Model Loading ---
# Load the model and tokenizer ONCE when the app starts
# This can take a few minutes the first time it downloads the model
print("Loading local model (google/flan-t5-base)...")
MODEL_NAME = "google/flan-t5-base"
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    # Check if GPU is available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval() # Set model to evaluation mode
    print(f"Model loaded successfully on {device}.")
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
def analyze_data():
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

        # --- Create the Prompt ---
        video_list_str = ""
        if not videos:
            video_list_str = "No recent videos found."
        else:
            for i, video in enumerate(videos[:15], 1):
                video_list_str += f"- \"{video.get('title', 'N/A')}\" (Views: {video.get('views', 'N/A')})\n"

        prompt = f"""
You are an expert YouTube content strategist.
Analyze the following channel data and provide 5 actionable, specific recommendations to help them grow.
Focus on content strategy, title optimization, and audience engagement.

Channel Name: {channel.get('name', 'N/A')}
Subscribers: {channel.get('subscribers', 'N/A')}

Recent Videos:
{video_list_str}

Your 5 actionable recommendations:
1.
"""
        
        # --- Generate Response ---
        print(f"Generating insights for channel: {channel.get('name', 'N/A')}")
        
        # Tokenize the prompt
        inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True).to(device)
        
        # Generate output
        with torch.no_grad(): # Disable gradient calculation for inference
            outputs = model.generate(
                **inputs,
                max_length=512,      # Max length of the *output*
                num_beams=5,         # Use beam search for better quality
                early_stopping=True,
                no_repeat_ngram_size=2,
                temperature=0.8
            )
        
        # Decode the generated text
        suggestions = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
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