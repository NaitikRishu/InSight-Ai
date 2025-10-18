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

# Initialize client (exactly like your Colab)
client = InferenceClient(
    provider="featherless-ai",
    api_key=HUGGINGFACE_API_KEY
)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service',
        'model': 'inclusionAI/Ling-1T'
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

Based on this data, provide exactly 10 numbered recommendations covering:
1. Content themes and topics that are working
2. Title optimization strategies
3. Upload frequency and timing suggestions
4. Engagement tactics based on successful videos
5. Growth opportunities and content gaps

Format your response as a numbered list (1-5) with clear, actionable advice for each point."""

        # Call Hugging Face API using Ling-1 model (exactly like your Colab)
        try:
            completion = client.chat.completions.create(
                model="inclusionAI/Ling-1T",
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
    print(f"📊 Using model: inclusionAI/Ling-1T")
    print(f"🔑 API Key configured: {'Yes' if HUGGINGFACE_API_KEY else 'No'}")
    app.run(host='0.0.0.0', port=port, debug=True)
