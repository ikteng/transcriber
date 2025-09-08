import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const BACKEND_URL = "https://ikteng-transcriber.hf.space";

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setStatus("Uploading file...");
    setTranscribedText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const text = data.text || "No transcription returned";

      setStatus("Done");
      setTranscribedText(text);
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setTranscribedText(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="app-container">
      <div className="transcriber-card">
        <h1 className="title">🎤 Audio/Video Transcriber</h1>

        <div
          className={`drop-zone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          {loading ? "Processing..." : "Drag & Drop a file here or click to upload"}
        </div>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileUpload}
          ref={inputRef}
          className="file-input"
        />

        {status && (
          <div className={`status ${loading ? "loading" : ""}`}>
            {status}
          </div>
        )}

        <div className="transcription-output">
          <h3>Transcription:</h3>
          <pre>{transcribedText}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
