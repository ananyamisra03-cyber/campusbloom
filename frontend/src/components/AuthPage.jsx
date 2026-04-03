import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const IS = (t) => ({
  width: "100%", padding: "12px 15px", borderRadius: 12, fontSize: 14,
  background: t.input, border: `1.5px solid ${t.inputBorder}`, color: t.text,
  fontFamily: "Nunito,sans-serif",
});

export function AuthPage({ t, dark, setDark }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "", college: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const isLogin = mode === "login";

  const attempt = async () => {
    setErr(""); setLoading(true);
    try {
      if (isLogin) {
        if (!f.email || !f.password) throw new Error("Email and password are required.");
        await login(f.email, f.password);
      } else {
        if (!f.name || !f.email || !f.password) throw new Error("Name, email and password are required.");
        if (f.password.length < 6) throw new Error("Password must be at least 6 characters.");
        await signup(f.name, f.email, f.password, f.college);
      }
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const fields = isLogin
    ? [["👤 Full Name","name","text","Your name"],["📧 Email","email","email","you@college.edu"],["🔒 Password","password","password","••••••••"]]
    : [["👤 Full Name","name","text","Your full name"],["🏫 College","college","text","Your college (optional)"],["📧 Email","email","email","you@college.edu"],["🔒 Password","password","password","Min 6 characters"]];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "popIn 0.45s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "clamp(44px,10vw,56px)", animation: "pulse 2s infinite" }}>🎓</div>
          <h1 style={{ fontFamily: "Pacifico,cursive", fontSize: "clamp(26px,6vw,34px)", background: t.btnGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "8px 0 4px" }}>CampusBloom</h1>
          <p style={{ color: t.textSub, fontWeight: 600, fontSize: 13 }}>
            {isLogin ? "Welcome back! ✨" : "Start your organized college journey 🌸"}
          </p>
        </div>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 22, padding: "clamp(20px,5vw,32px)", backdropFilter: "blur(20px)", boxShadow: t.shadow }}>
          {err && (
            <div style={{ background: "#ef444422", border: "1px solid #ef444444", borderRadius: 10, padding: "10px 14px", color: "#ef4444", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
              ⚠️ {err}
            </div>
          )}
          {fields.map(([lbl, key, type, ph]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSub, marginBottom: 5, display: "block" }}>{lbl}</label>
              <input style={IS(t)} type={type} placeholder={ph} value={f[key]}
                onChange={e => setF({ ...f, [key]: e.target.value })}
                onKeyDown={e => e.key === "Enter" && attempt()} />
            </div>
          ))}
          <button onClick={attempt} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 13, fontSize: 15, fontWeight: 800, background: t.btnGrad, color: "white", boxShadow: "0 4px 18px rgba(168,85,247,0.38)", marginBottom: 10, opacity: loading ? 0.7 : 1, fontFamily: "Nunito,sans-serif", cursor: loading ? "wait" : "pointer" }}>
            {loading ? "⏳ Please wait…" : isLogin ? "Login 🚀" : "Create Account 🎉"}
          </button>
          <p style={{ textAlign: "center", color: t.textSub, fontSize: 13, fontWeight: 600 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(isLogin ? "signup" : "login"); setErr(""); }} style={{ color: t.accent, cursor: "pointer", fontWeight: 800 }}>
              {isLogin ? "Sign up ✨" : "Login →"}
            </span>
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => setDark(!dark)} style={{ background: "none", color: t.textSub, fontSize: 22, padding: 8 }}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </div>
    </div>
  );
}
