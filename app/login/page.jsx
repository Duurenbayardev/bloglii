"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const users = ["EMI", "DUUREE", "MARALA", "CELMOON"];

  const handleLogin = async (username) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "60px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Team Reddit
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "40px",
            fontSize: "14px",
          }}
        >
          Select your account to continue
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          {users.map((user) => (
            <button
              key={user}
              onClick={() => setSelectedUser(user)}
              style={{
                padding: "15px",
                borderRadius: "8px",
                border:
                  selectedUser === user
                    ? "3px solid #667eea"
                    : "2px solid #ddd",
                background:
                  selectedUser === user ? "#f0f4ff" : "white",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                transition: "all 0.3s ease",
              }}
            >
              @{user}
            </button>
          ))}
        </div>

        <button
          onClick={() => selectedUser && handleLogin(selectedUser)}
          disabled={!selectedUser || loading}
          style={{
            width: "100%",
            padding: "12px",
            background:
              selectedUser && !loading ? "#667eea" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor:
              selectedUser && !loading
                ? "pointer"
                : "not-allowed",
            transition: "background 0.3s ease",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}


