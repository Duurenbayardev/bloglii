"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateSubreddit() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (!parsed || !parsed._id || !parsed.username) {
        throw new Error("Invalid user shape");
      }
      setCurrentUser(parsed);
    } catch {
      localStorage.removeItem("currentUser");
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a subreddit name");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/subreddits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.toLowerCase().replace(/\s+/g, ""),
          description,
          createdBy: currentUser._id,
        }),
      });
      if (response.ok) router.push("/");
    } catch (error) {
      console.error("Error creating subreddit:", error);
      alert("Failed to create subreddit");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              marginBottom: "24px",
              background: "#272729",
              color: "#d7dadc",
              border: "1px solid #343536",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Лент рүү буцах
          </button>
        </Link>
        <div
          style={{
            background: "#020617",
            border: "1px solid #1f2937",
            borderRadius: "8px",
            padding: "32px",
          }}
        >
          <h1
            style={{
              color: "#f9fafb",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Сэдэв үүсгэх
          </h1>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              marginBottom: "32px",
            }}
          >
            Багаараа ярилцах шинэ сэдэв үүсгэх.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Сэдвийн нэр
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "16px",
                    marginRight: "8px",
                  }}
                >
                  r/
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ж: surii"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#050816",
                    color: "#e5e7eb",
                    border: "1px solid #1f2937",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginTop: "8px",
                }}
              >
                Нэр нь жижиг үсэгтэй, хоосон зайгүй байна.
              </p>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Тайлбар (заавал биш)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Энэ сабреддит юуг тухай байгааг бич."
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#050816",
                  color: "#e5e7eb",
                  border: "1px solid #1f2937",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "120px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {loading ? "Үүсгэж байна..." : "Сабреддит үүсгэх"}
              </button>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "transparent",
                    color: "#e5e7eb",
                    border: "1px solid #4b5563",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Болих
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


