"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const allowedUsers = ["emi", "duuree", "marala", "celmoon"];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const rawName = username.trim();
    const normalized = rawName.toLowerCase();

    if (!rawName) {
      setError("Нэрээ оруулна уу");
      return;
    }

    if (!allowedUsers.includes(normalized)) {
      setError("Ийм хэрэглэгч алга. Дахин оролдоорой.");
      return;
    }

    if (normalized === "duuree" && password !== "ceo123") {
      setError("Duuree-н нууц үг буруу байна.");
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
      setError("Системийн алдаа. Дахин оролдоорой.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        top: "-100px",
        left: "-100px",
        animation: "float 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        bottom: "-50px",
        right: "-50px",
        animation: "float 8s ease-in-out infinite reverse",
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .login-container {
          animation: slideUp 0.6s ease-out;
        }

        .error-shake {
          animation: shake 0.3s ease-in-out;
        }

        input:focus {
          outline: none;
        }

        input::placeholder {
          opacity: 0.6;
        }
      `}</style>

      {/* Main login card */}
      <div className="login-container" style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
      }}>
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(51, 65, 85, 0.5)",
          borderRadius: "16px",
          padding: "48px 32px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#f1f5f9",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}>
              Suriildaa gsh
            </h1>
            <p style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: 0,
              letterSpacing: "0.3px",
            }}>
              Нэрээ бичээд нэвтэр.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Username field */}
            <div style={{ position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Хэрэглэгчийн нэр
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
                placeholder="zuger nree bich"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  color: "#e2e8f0",
                  borderRadius: "10px",
                  border: focused === "username"
                    ? "2px solid #3b82f6"
                    : "2px solid #334155",
                  fontSize: "14px",
                  textTransform: "lowercase",
                  boxSizing: "border-box",
                  backgroundColor: "#020617",
                  transition: "all 0.2s ease",
                  boxShadow: focused === "username"
                    ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    : "none",
                }}
              />
            </div>

            {/* Password field - only for duuree */}
            {username.toLowerCase() === "duuree" && (
              <div style={{
                animation: "slideUp 0.3s ease-out",
                position: "relative",
              }}>
                <label style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  Нууц үг
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  placeholder="Нууц үг оруулна уу"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    color: "#e2e8f0",
                    borderRadius: "10px",
                    border: focused === "password"
                      ? "2px solid #3b82f6"
                      : "2px solid #334155",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "#020617",
                    transition: "all 0.2s ease",
                    boxShadow: focused === "password"
                      ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                      : "none",
                  }}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className={error ? "error-shake" : ""} style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "13px",
                color: "#fca5a5",
                animation: "slideUp 0.3s ease-out",
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                marginTop: "8px",
                background: loading
                  ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading
                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                  : "0 10px 15px rgba(59, 130, 246, 0.2)",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.boxShadow = "0 15px 25px rgba(59, 130, 246, 0.3)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.boxShadow = "0 10px 15px rgba(59, 130, 246, 0.2)";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTopColor: "#ffffff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Нэвтэрч байна...
                </span>
              ) : (
                "Нэвтрэх"
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p style={{
            fontSize: "11px",
            color: "#64748b",
            textAlign: "center",
            marginTop: "20px",
            margin: "20px 0 0 0",
          }}>
            Идэвхтэй хэрэглэгчид: emi, duuree, marala, celmoon
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}