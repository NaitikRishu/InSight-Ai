from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Hugging Face client
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
if not HUGGINGFACE_API_KEY:
    print("WARNING: HUGGINGFACE_API_KEY not found in environment variables")

# Initialize client with Novita provider (faster than featherless-ai)
client = InferenceClient(
    provider="novita",
    api_key=HUGGINGFACE_API_KEY
)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service',
        'model': 'meta-llama/Llama-3.1-8B-Instruct',
        'provider': 'novita'
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

        # Call Hugging Face API using DeepSeek-V3 (faster with Novita provider)
        try:
            completion = client.chat.completions.create(
                model="meta-llama/Llama-3.1-8B-Instruct",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Extract the generated text
            suggestions = completion.choices[0].message.content
            
            return jsonify({
                'success': True,
                'suggestions': suggestions
            }), 200
            
        except Exception as hf_error:
            print(f"Hugging Face API Error: {str(hf_error)}")
            return jsonify({
                'success': False,
                'error': f'AI model error: {str(hf_error)}'
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
    print(f"📊 Using model: meta-llama/Llama-3.1-8B-Instruct")
    print(f"🔑 API Key configured: {'Yes' if HUGGINGFACE_API_KEY else 'No'}")
    app.run(host='0.0.0.0', port=port, debug=True)
