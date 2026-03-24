import { useRef, useState } from "react";
import {
  sendTextChat,
  sendVoiceChat,
  getRagCollections,
  searchRag,
  addRagDoc,
} from "./api";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am SpeakAI. Test backend here.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [useRag, setUseRag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);
  const [collection, setCollection] = useState("restaurant");
  const [ragDoc, setRagDoc] = useState("");
  const [collections, setCollections] = useState([]);
  const [ragResults, setRagResults] = useState([]);
  const [error, setError] = useState("");
  const [speakingEvaluation, setSpeakingEvaluation] = useState(null);
  const [learningFeedback, setLearningFeedback] = useState(null);

  // Ghi âm
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSendText = async () => {
    if (!message.trim()) return;

    const currentMessage = message;
    addMessage("user", currentMessage);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await sendTextChat(currentMessage, useRag);
      addMessage("assistant", data.text || data.message || "No response");
    } catch (err) {
      setError(err.message);
      addMessage("assistant", `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVoice = async () => {
    if (!audioFile) return;

    setError("");
    setLoading(true);

    try {
      const data = await sendVoiceChat(audioFile, useRag);
      setVoiceResult(data);
      setSpeakingEvaluation(data.speaking_evaluation || null);
      setLearningFeedback(data.learning_feedback || null);

      if (data.transcribed_text) {
        addMessage("user", `[Voice File] ${data.transcribed_text}`);
      }

      if (data.text || data.response_text) {
        addMessage("assistant", data.text || data.response_text);
      }

      if (data.speaking_evaluation?.short_feedback) {
        addMessage(
          "assistant",
          `Speaking Feedback: ${data.speaking_evaluation.short_feedback}`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      setError("");
      setVoiceResult(null);
      setSpeakingEvaluation(null);
      audioChunksRef.current = [];

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
        setRecordedAudioUrl("");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const audioTracks = stream.getAudioTracks();
      console.log("Audio tracks:", audioTracks);
      console.log("Mic enabled:", audioTracks[0]?.enabled);
      console.log("Mic label:", audioTracks[0]?.label);

      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus" };
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/webm" };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      console.log("Recorder mimeType:", mediaRecorder.mimeType);

      mediaRecorder.ondataavailable = (event) => {
        console.log("Chunk size:", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        console.log("Total chunks:", audioChunksRef.current.length);
        console.log("Audio blob size:", audioBlob.size);

        const file = new File([audioBlob], "recording.webm", {
          type: mimeType,
        });

        console.log("Recorded file:", file);

        setRecordedAudio(file);
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Không thể truy cập microphone. Hãy cho phép quyền dùng mic.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSendRecordedVoice = async () => {
    if (!recordedAudio) return;

    setError("");
    setLoading(true);

    try {
      const data = await sendVoiceChat(recordedAudio, useRag);
      setVoiceResult(data);
      setSpeakingEvaluation(data.speaking_evaluation || null);
      setLearningFeedback(data.learning_feedback || null);

      if (data.transcribed_text) {
        addMessage("user", `[Voice] ${data.transcribed_text}`);
      }

      if (data.text || data.response_text) {
        addMessage("assistant", data.text || data.response_text);
      }

      if (data.speaking_evaluation?.short_feedback) {
        addMessage(
          "assistant",
          `Speaking Feedback: ${data.speaking_evaluation.short_feedback}`
        );
      }
    } catch (err) {
      setError(err.message || "Gửi audio ghi âm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCollections = async () => {
    try {
      const data = await getRagCollections();
      setCollections(data.collections || data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchRag = async () => {
    if (!message.trim()) return;

    try {
      const data = await searchRag(message, collection);
      setRagResults(data.results || data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddRag = async () => {
    if (!ragDoc.trim()) return;

    try {
      await addRagDoc(collection, ragDoc);
      setRagDoc("");
      handleLoadCollections();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <h1>SpeakAI ReactJS Test UI</h1>

      <div className="top-bar">
        <label>
          <input
            type="checkbox"
            checked={useRag}
            onChange={(e) => setUseRag(e.target.checked)}
          />
          Use RAG
        </label>
      </div>

      <div className="layout">
        <div className="chat-box">
          <h2>Text Chat</h2>

          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))}
          </div>

          <div className="input-row">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendText} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <div className="side-panel">
          <div className="card">
            <h2>Voice Test</h2>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
            <button onClick={handleSendVoice} disabled={loading || !audioFile}>
              Send Voice File
            </button>

            <hr style={{ margin: "16px 0" }} />

            <h3>Ghi âm bằng microphone</h3>
            <div className="button-group">
              <button onClick={startRecording} disabled={isRecording || loading}>
                {isRecording ? "Đang ghi..." : "Start Recording"}
              </button>

              <button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
              </button>

              <button
                onClick={handleSendRecordedVoice}
                disabled={!recordedAudio || loading}
              >
                {loading ? "Sending..." : "Send Recording"}
              </button>
            </div>

            {recordedAudioUrl && (
              <div className="result-box">
                <p><strong>Recorded Audio:</strong></p>
                <audio controls src={recordedAudioUrl}></audio>
              </div>
            )}

            {voiceResult && (
              <div className="result-box">
                <p>
                  <strong>Transcript:</strong>{" "}
                  {voiceResult.transcribed_text || "N/A"}
                </p>
                <p>
                  <strong>Response:</strong>{" "}
                  {voiceResult.text || voiceResult.response_text || "N/A"}
                </p>
                <p>
                  <strong>STT Provider:</strong>{" "}
                  {voiceResult.stt_provider || "N/A"}
                </p>
                {voiceResult.tts_error && (
                  <p>
                    <strong>TTS Error:</strong> {voiceResult.tts_error}
                  </p>
                )}
              </div>
            )}

            {speakingEvaluation && (
              <div className="result-box">
                <p><strong>Clarity Score:</strong> {speakingEvaluation.clarity_score ?? "N/A"}</p>
                <p><strong>Grammar Score:</strong> {speakingEvaluation.grammar_score ?? "N/A"}</p>
                <p><strong>Naturalness Score:</strong> {speakingEvaluation.naturalness_score ?? "N/A"}</p>
                <p><strong>Overall Score:</strong> {speakingEvaluation.overall_score ?? "N/A"}</p>
                <p><strong>Level:</strong> {speakingEvaluation.detected_level || "N/A"}</p>
                <p><strong>Short Feedback:</strong> {speakingEvaluation.short_feedback || "N/A"}</p>
                <p><strong>Improved Sentence:</strong> {speakingEvaluation.improved_sentence || "N/A"}</p>

                <p><strong>Strengths:</strong></p>
                <ul>
                  {(speakingEvaluation.strengths || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p><strong>Issues:</strong></p>
                <ul>
                  {(speakingEvaluation.issues || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p><strong>Advice:</strong></p>
                <ul>
                  {(speakingEvaluation.advice || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {learningFeedback?.learning_feedback && (
              <div className="feedback-card">
                <div className="feedback-header">
                  <h3>Learning Feedback</h3>
                  <span className="score-badge">
                    Pronunciation: {learningFeedback.learning_feedback.pronunciation_score}%
                  </span>
                </div>

                <div className="feedback-grid">
                  <div className="feedback-section">
                    <h4>Grammar</h4>
                    <p>
                      <strong>Original:</strong>{" "}
                        {learningFeedback.learning_feedback.grammar?.original || "N/A"}
                    </p>
                    <p>
                      <strong>Issue:</strong>{" "}
                        {learningFeedback.learning_feedback.grammar?.issue || "N/A"}
                    </p>
                    <p>
                      <strong>Suggested:</strong>{" "}
                        {learningFeedback.learning_feedback.grammar?.suggested || "N/A"}
                    </p>
                </div>

              <div className="feedback-section">
                <h4>Expression</h4>
                <p>
                  <strong>Original:</strong>{" "}
                    {learningFeedback.learning_feedback.expression?.original || "N/A"}
                </p>
                <p>
                  <strong>Better:</strong>{" "}
                    {learningFeedback.learning_feedback.expression?.better || "N/A"}
                </p>
              </div>

              <div className="feedback-section">
                <h4>Pronunciation</h4>
                <p>
                  <strong>Issue Word:</strong>{" "}
                    {learningFeedback.learning_feedback.pronunciation?.issue_word || "N/A"}
                </p>
                <p>
                  {learningFeedback.learning_feedback.pronunciation?.feedback || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

          </div>

          <div className="card">
            <h2>RAG Test</h2>
            <input
              type="text"
              placeholder="Collection"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            />

            <textarea
              placeholder="Nhập document để thêm vào RAG"
              value={ragDoc}
              onChange={(e) => setRagDoc(e.target.value)}
            />

            <div className="button-group">
              <button onClick={handleAddRag}>Add Doc</button>
              <button onClick={handleSearchRag}>Search by Input</button>
              <button onClick={handleLoadCollections}>Load Collections</button>
            </div>

            <div className="result-box">
              <p><strong>Collections:</strong></p>
              <pre>{JSON.stringify(collections, null, 2)}</pre>
            </div>

            <div className="result-box">
              <p><strong>Search Results:</strong></p>
              <pre>{JSON.stringify(ragResults, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}
    </div>
  );
}

export default App;