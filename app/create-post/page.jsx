"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePost() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [subreddits, setSubreddits] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subreddit, setSubreddit] = useState("general");
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
      fetchSubreddits();
    } catch {
      localStorage.removeItem("currentUser");
      router.push("/login");
    }
  }, [router]);

  const fetchSubreddits = async () => {
    try {
      const response = await fetch("/api/subreddits");
      const data = await response.json();
      setSubreddits(data.subreddits || []);
    } catch (error) {
      console.error("Error fetching subreddits:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: currentUser._id,
          subreddit,
        }),
      });
      if (response.ok) router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            ← FYP рүү буцах
          </button>
        </Link>
        <div
          style={{
            background: "#020617",
            border: "1px solid #1f2937",
            borderRadius: "8px",
            padding: "24px",
          }}
        >
          <h1
            style={{
              color: "#f9fafb",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "24px",
            }}
          >
            Пост үүсгэх
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
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
                Сэдэв сонгох
              </label>
              <select
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#050816",
                  color: "#e5e7eb",
                  border: "1px solid #1f2937",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="general">general</option>
                {subreddits.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
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
                Гарчиг
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Гарчиг оруулна уу"
                style={{
                  width: "100%",
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
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#818384",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Агуулга
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Юу бодож байна?"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#050816",
                  color: "#e5e7eb",
                  border: "1px solid #1f2937",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "300px",
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
                {loading ? "Үүсгэж байна..." : "Пост үүсгэх"}
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


