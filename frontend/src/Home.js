/* global webkitSpeechRecognition */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [inputLang, setInputLang] = useState("en-US");
  const [outputLang, setOutputLang] = useState("es");

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = inputLang;

      recognitionRef.current.onresult = async (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(currentTranscript.trim());

        if (event.results[event.results.length - 1].isFinal) {
          console.log("Sending translation request:", currentTranscript, outputLang);
          const response = await axios.post("https://health-care-translator.onrender.com/translate", {
            text: currentTranscript,
            targetLang: outputLang,
          });

          console.log("Received translation response:", response.data);
          setTranslation(response.data.translation);
          setAudioURL(null);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };
    } else {
      alert("Your browser does not support speech recognition.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [inputLang, outputLang]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setRecording(false);
      recognitionRef.current.stop();
    }
  };

  const handleSpeakClick = async () => {
    if (!translation) return;

    try {
      console.log("Sending text-to-speech request:", translation, outputLang);
      const response = await axios.post(
        "https://health-care-translator.onrender.com/text-to-speech",
        { text: translation, lang: outputLang },
        { responseType: "blob" } // Expect (audio file)
      );

      console.log("Received text-to-speech response:", response);
      const audioBlob = new Blob([response.data], { type: "audio/mp3" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  return (
    <div className="container">
      <h1>Real-Time Healthcare Translator</h1>

      <div>
        <label>Input Language:</label>
        <select value={inputLang} onChange={(e) => setInputLang(e.target.value)}>
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="ar-SA">Arabic</option>
          <option value="hi-IN">Hindi</option>
          <option value="ru-RU">Russian</option>
          <option value="it-IT">Italian</option>
          <option value="ja-JP">Japanese</option>
        </select>
      </div>

      <div>
        <label>Output Language:</label>
        <select value={outputLang} onChange={(e) => setOutputLang(e.target.value)}>
          <option value="es">Spanish</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ar">Arabic</option>
          <option value="hi">Hindi</option>
          <option value="ru">Russian</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={recording ? stopRecording : startRecording}
          className={recording ? "stop-btn" : "start-btn"}
        >
          {recording ? "Stop Listening" : "Start Listening"}
        </button>
      </div>

      <div className="transcript-box">
        <p><strong>Original:</strong></p>
        <p>{transcript || "No speech detected yet..."}</p>
      </div>

      <div className="translation-box">
        <p><strong>Translated:</strong></p>
        <p>{translation || "No translation available yet..."}</p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={handleSpeakClick} disabled={!translation} className="speak-btn">
          Speak
        </button>
      </div>

      {audioURL && (
        <div>
          <audio controls>
            <source src={audioURL} type="audio/mp3" />
          </audio>
        </div>
      )}
    </div>
  );
}
