import { useState } from "react";
import { theme } from "../theme";
import { InputField } from "../common/InputField";
import { useTranslation } from "react-i18next";

export default function Login({ onLogin }: { onLogin: (user: any) => void;}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleLogin = async () => {
    if(username.trim() === "") {
      setError("Please fill in all fields");
      return;
    }

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
    } else {
        let msg = "Неверный логин или пароль";
        try {
        const err = await res.json();
            if (err?.error) msg = err.error;
        } catch {}

        setError(msg);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        color: theme.colors.text,
            background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
      }}
    >
        {error && (<div style={theme.styles.error}>⚠ {error} </div>)}
      <div style={{ display: "flex", flex: 1 }}>

        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              padding: "32px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              width: "320px",
            }}
          >
            <h2 style={{ margin: 0, textAlign: "center" }}>{t("login")}</h2>

            <InputField
              label={t("username")}
              value={username}
              onChange={(val) => {
                setUsername(val);
                setError(null);
              }}
              onEnter={handleLogin}
            />

            <InputField
              label={t("password")}
              secure={true}
              value={password}
              onChange={(val) => {
                setPassword(val);
                setError(null);
              }}
              onEnter={handleLogin}
            />

            <button
              onClick={handleLogin}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: theme.colors.buttonBg,
                color: "#fff",
                fontWeight: "bold",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {t("login")}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              marginBottom: "10px",
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          >
            {t("ServiceName")}
          </h1>

          <p style={{ fontSize: "16px", opacity: 0.9, maxWidth: "400px" }}>
            {t("ServiceBelongsTo")}
          </p>
        </div>
      </div>
    </div>
  );
}