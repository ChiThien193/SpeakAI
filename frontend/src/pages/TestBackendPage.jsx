import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { getHealth, syncMe, getMe } from "../services/api";

export default function TestBackendPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("12345678");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [healthData, setHealthData] = useState(null);
  const [syncData, setSyncData] = useState(null);
  const [meData, setMeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showError = (error) => {
    console.error(error);
    setMessage(error.message || "Có lỗi xảy ra");
  };

  const handleCheckHealth = async () => {
    try {
      setMessage("Đang kiểm tra /health...");
      const data = await getHealth();
      setHealthData(data);
      setMessage("Backend đang chạy tốt");
    } catch (error) {
      showError(error);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setMessage("Đang tạo tài khoản Firebase...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const token = await user.getIdToken();

      setFirebaseUser(user);
      setIdToken(token);
      setMessage("Tạo tài khoản Firebase thành công");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("Đang đăng nhập Firebase...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const token = await user.getIdToken();

      setFirebaseUser(user);
      setIdToken(token);
      setMessage("Đăng nhập Firebase thành công");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncMe = async () => {
    try {
      if (!idToken) {
        throw new Error("Chưa có idToken. Hãy login Firebase trước.");
      }

      setMessage("Đang gọi /api/auth/sync-me...");
      const data = await syncMe(idToken);
      setSyncData(data);
      setMessage("Sync user vào MongoDB thành công");
    } catch (error) {
      showError(error);
    }
  };

  const handleGetMe = async () => {
    try {
      if (!idToken) {
        throw new Error("Chưa có idToken. Hãy login Firebase trước.");
      }

      setMessage("Đang gọi /api/auth/me...");
      const data = await getMe(idToken);
      setMeData(data);
      setMessage("Lấy profile từ backend thành công");
    } catch (error) {
      showError(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setIdToken("");
      setSyncData(null);
      setMeData(null);
      setMessage("Đã logout");
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Test SpeakAI Backend</h1>
        <p style={{ color: "#666" }}>
          Test nhanh các API: /health, /api/auth/sync-me, /api/auth/me
        </p>

        <div style={styles.section}>
          <h2>1. Kiểm tra backend</h2>
          <button onClick={handleCheckHealth} style={styles.button}>
            Check /health
          </button>
          {healthData && (
            <pre style={styles.pre}>{JSON.stringify(healthData, null, 2)}</pre>
          )}
        </div>

        <div style={styles.section}>
          <h2>2. Firebase Auth</h2>

          <input
            style={styles.input}
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Nhập password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.row}>
            <button
              onClick={handleRegister}
              disabled={loading}
              style={styles.button}
            >
              Register Firebase
            </button>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={styles.button}
            >
              Login Firebase
            </button>

            <button onClick={handleLogout} style={styles.buttonDanger}>
              Logout
            </button>
          </div>

          {firebaseUser && (
            <div style={styles.infoBox}>
              <p><strong>UID:</strong> {firebaseUser.uid}</p>
              <p><strong>Email:</strong> {firebaseUser.email}</p>
            </div>
          )}

          {idToken && (
            <details style={styles.details}>
              <summary>Xem ID Token</summary>
              <pre style={styles.pre}>{idToken}</pre>
            </details>
          )}
        </div>

        <div style={styles.section}>
          <h2>3. Test backend auth</h2>

          <div style={styles.row}>
            <button onClick={handleSyncMe} style={styles.button}>
              POST /api/auth/sync-me
            </button>

            <button onClick={handleGetMe} style={styles.button}>
              GET /api/auth/me
            </button>
          </div>

          {syncData && (
            <>
              <h3>Kết quả sync-me</h3>
              <pre style={styles.pre}>{JSON.stringify(syncData, null, 2)}</pre>
            </>
          )}

          {meData && (
            <>
              <h3>Kết quả me</h3>
              <pre style={styles.pre}>{JSON.stringify(meData, null, 2)}</pre>
            </>
          )}
        </div>

        <div style={styles.section}>
          <h2>Trạng thái</h2>
          <div style={styles.infoBox}>{message || "Chưa có thao tác nào"}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  section: {
    marginTop: "24px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  input: {
    display: "block",
    width: "100%",
    maxWidth: "400px",
    padding: "10px 12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  buttonDanger: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },
  pre: {
    background: "#111827",
    color: "#f9fafb",
    padding: "12px",
    borderRadius: "10px",
    overflowX: "auto",
    marginTop: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  infoBox: {
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "12px",
  },
  details: {
    marginTop: "12px",
  },
};