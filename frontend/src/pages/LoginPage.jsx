import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "تعذر تسجيل الدخول");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.decorLayer} aria-hidden="true">
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
          <pattern id="sweet-pattern" width="90" height="90" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="6" fill="var(--cocoa-900)" />
            <path d="M55 15 Q62 5 69 15 Q76 25 69 30 Q62 35 55 30 Q48 25 55 15 Z" fill="var(--cocoa-900)" />
            <circle cx="15" cy="65" r="4" fill="var(--cocoa-900)" />
            <circle cx="70" cy="70" r="5" fill="var(--cocoa-900)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#sweet-pattern)" />
        </svg>
      </div>

      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>🍮</div>
          <div>
            <h1 style={styles.brandTitle}>حلواني السفير</h1>
            <p style={styles.brandSubtitle}>ELSAFEER PASTRY — لوحة تحكم المالك</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            البريد الإلكتروني
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="owner@example.com"
              dir="ltr"
            />
          </label>

          <label style={styles.label}>
            كلمة المرور
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
              dir="ltr"
            />
          </label>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" disabled={submitting} style={styles.submitBtn}>
            {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(160deg, var(--ivory-50) 0%, var(--ivory-100) 100%)",
    padding: 24,
  },
  decorLayer: { position: "absolute", inset: 0 },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 400,
    background: "var(--white)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-soft)",
    border: "1px solid var(--border)",
    padding: "36px 32px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: "var(--radius-md)",
    background: "linear-gradient(135deg, var(--caramel-500), var(--honey-400))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    flexShrink: 0,
  },
  brandTitle: { margin: 0, fontSize: 20, fontWeight: 800, color: "var(--cocoa-900)" },
  brandSubtitle: { margin: "2px 0 0", fontSize: 13.5, color: "var(--cocoa-500)" },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  label: { display: "flex", flexDirection: "column", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--cocoa-700)" },
  input: {
    padding: "12px 14px",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--border)",
    fontSize: 15,
    background: "var(--ivory-50)",
    color: "var(--cocoa-900)",
  },
  errorBox: {
    background: "#FBEAE8",
    color: "var(--brick-600)",
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    fontSize: 13.5,
    fontWeight: 600,
  },
  submitBtn: {
    marginTop: 6,
    padding: "13px 18px",
    borderRadius: "var(--radius-md)",
    background: "var(--cocoa-900)",
    color: "var(--ivory-50)",
    fontSize: 15.5,
    fontWeight: 700,
    transition: "opacity 0.15s ease",
  },
};
