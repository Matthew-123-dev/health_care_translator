# Real-Time Healthcare Translator

## Project Overview
This project is a real-time speech-to-text and translation web application. It enables users to speak in one language, transcribe it into text, translate it into another language, and then convert the translated text back into speech.

## **Project Structure**
## 1. Backend (Flask)

The **backend** is built using Flask and is responsible for handling speech-to-text conversion, translation, and text-to-speech synthesis. It includes the following components:

- **`app.py`**  
  The core Flask application that defines API endpoints for translation, text-to-speech conversion, and speech recognition.

- **`requirements.txt`**  
  A list of dependencies required for the Flask backend, including libraries such as Flask, gTTS (Google Text-to-Speech), and googletrans (for translation).


### **Flask API Endpoints**
| Method | Endpoint             | Description |
|--------|----------------------|-------------|
| POST   | `/translate`         | Translates text from one language to another. |
| POST   | `/text-to-speech`    | Converts translated text into speech. |

---

## 2. Frontend (React)

The **frontend** is built using React and provides an intuitive user interface for interacting with the application. It includes:

- **`/src/` (Source Files)**
  - **`Home.js`**  
    The main React component responsible for managing user input, calling API endpoints, and handling speech recognition.

  - **`index.js`**  
    The entry point of the React application.

  - **`App.css`**  
    A CSS file that styles the user interface.

- **React Features:**
  - Uses `webkitSpeechRecognition` for real-time speech-to-text conversion.
  - Uses `axios` to send requests to the Flask backend.
  - Allows users to start and stop speech recognition.
  - Displays translated text and provides an audio player for listening to the translated speech.

---

## 3. General Project Files

- **`README.md`**  
  Contains documentation explaining how to set up, run, and use the project.

- **`.gitignore`**  
  Specifies files and folders to be ignored in version control (e.g., virtual environments, `node_modules`, and temporary audio files).



---

## **Technologies Used**
### **Transcription (Speech-to-Text)**
- `webkitSpeechRecognition` (browser-based)

### **Translation**
- Google Translate API (or `googletrans` in Python)

### **Text-to-Speech**
- `gTTS` (Google Text-to-Speech)

---

## **Security Considerations**
- **Input validation & sanitization** to prevent injection attacks.
- **Rate limiting** to avoid excessive API requests.
- **Implementation of logging** to detect unusual activity.

---

## **Setup Instructions**
### **Backend Setup**
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
### **Frontend Setup**
```sh
cd frontend
npm install
npm start
```






