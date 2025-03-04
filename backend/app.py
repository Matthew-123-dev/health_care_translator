from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from googletrans import Translator
from gtts import gTTS
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import logging

def is_valid_language(lang):
    """Check if language code is valid (e.g., en, es, fr, de)."""
    return re.match(r"^[a-z]{2}(-[A-Z]{2})?$", lang) is not None

app = Flask(__name__)
CORS(app, resources = {r"/*":{"origins":"https://frontend-eight-olive-37.vercel.app/"}})
limiter = Limiter(get_remote_address, app=app, default_limits=["5 per second"])

translator = Translator()

logging.basicConfig(level=logging.INFO)

@app.route("/")
def home():
    return "Flask API is running successfully!"


@app.route("/translate", methods=["POST"])
@limiter.limit("10 per minute")
def translate_text():
    try:
        data = request.get_json()
        logging.info(f"Received data: {data}")

        # Validate input
        if not data or "text" not in data or "targetLang" not in data:
            return jsonify({"error": "Invalid request data"}), 400
        
        text = data["text"].strip()
        target_lang = data["targetLang"].strip().lower()

        if not text:
            return jsonify({"error": "Empty text provided"}), 400

        if not is_valid_language(target_lang):
            return jsonify({"error": "Invalid language code"}), 400

        # Translate
        translation = translator.translate(text, dest=target_lang).text
        return jsonify({"translation": translation})

    except Exception as e:
        logging.error(f"Translation failed: {e}")
        return jsonify({"error": "Translation failed", "details": str(e)}), 500
    

@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    data = request.json
    logging.info(f"Received data: {data}")
    text = data.get("text", "")
    lang = data.get("lang", "en")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    tts = gTTS(text=text, lang=lang)
    audio_path = "translation.mp3"
    tts.save(audio_path)

    return send_file(audio_path, mimetype="audio/mp3")

    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
