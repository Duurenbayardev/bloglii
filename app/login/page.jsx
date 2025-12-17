"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const allowedUsers = ["emi", "duuree", "marala", "celmoon"];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const rawName = username.trim();
    const normalized = rawName.toLowerCase();

    if (!rawName) {
      setError("Enter a username");
      return;
    }

    if (!allowedUsers.includes(normalized)) {
      setError("Unknown user. Please try again.");
      return;
    }

    if (normalized === "duuree" && password !== "ceo123") {
      setError("Incorrect password for duuree.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });

      const data = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ justifyContent: "center" }}>
      <div
        style={{
          background: "#111827",
          borderRadius: "12px",
          padding: "40px 32px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
          border: "1px solid #1f2937",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: "#e5e7eb",
          }}
        >
          Surii Discussions
        </h1>
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          Нэрээ бич. <strong>Заваан амьтан минь.</strong>.
        </p>

        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#555",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Нэрээ оруулна уу"
              style={{
                width: "100%",
                padding: "10px 12px",
                color: "#e5e7eb",
                borderRadius: "8px",
                border: "1px solid #374151",
                fontSize: "14px",
                textTransform: "lowercase",
                boxSizing: "border-box",
                backgroundColor: "#020617",
              }}
            />
          </div>

          {username === "duuree" && (
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Password ()
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Та захирал биш бол Код шаардлагагүй."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  color: "#e5e7eb",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  backgroundColor: "#020617",
                }}
              />
            </div>
          )}

          {error && (
            <p
              style={{
                color: "#fca5a5",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#4b5563" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s ease",
              marginTop: "8px",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}


