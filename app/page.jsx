"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Feed() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.body.classList.toggle("light-mode", initial === "light");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
      fetchSubreddits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selectedSubreddit]);

  const fetchPosts = async () => {
    try {
      const query = selectedSubreddit ? `?subreddit=${selectedSubreddit}` : "";
      const response = await fetch(`/api/posts${query}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubreddits = async () => {
    try {
      const response = await fetch("/api/subreddits");
      const data = await response.json();
      setSubreddits(data.subreddits || []);
    } catch (error) {
      console.error("Error fetching subreddits:", error);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await fetch(`/api/posts/${postId}/upvotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await fetch(`/api/posts/${postId}/downvotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error downvoting:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  if (!currentUser) return null;

  return (
    <div className="app-shell">
      <div className="app-sidebar">
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={() => setSubMenuOpen((open) => !open)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#050816",
              color: "#f3f4f6",
              border: "1px solid #272443",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Сэдвүүд
            </span>
            <span style={{ fontSize: "16px" }}>{subMenuOpen ? "▴" : "▾"}</span>
          </button>
        </div>
        {subMenuOpen && (
          <div style={{ marginBottom: "24px" }}>
            <button
              onClick={() => setSelectedSubreddit(null)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: !selectedSubreddit ? "#111827" : "transparent",
                color: "#e5e7eb",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                marginBottom: "8px",
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              Бүх пост
            </button>
            {subreddits.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setSelectedSubreddit(sub.name)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background:
                    selectedSubreddit === sub.name ? "#111827" : "transparent",
                  color: "#e5e7eb",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginBottom: "8px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                r/{sub.name}
              </button>
            ))}
          </div>
        )}
        <div
          style={{
            marginBottom: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #343536",
          }}
        >
          <Link href="/create-subreddit" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "#818384",
                color: "white",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Сэдэв үүсгэх
            </button>
          </Link>
        </div>
        <div
          style={{
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid #343536",
          }}
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            Нэвтэрсэн хэрэглэгч
          </p>
          <p
            style={{
              color: "#f3f4f6",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            u/{currentUser.username}
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Гарах
          </button>
        </div>
      </div>
      <div className="app-main">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/create-post" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#0b1020",
                border: "1px solid #312e81",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                cursor: "pointer",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                transition: "border-color 0.2s, background-color 0.2s",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#4f46e5",
                  borderRadius: "999px",
                }}
              />
              <div
                type="text"
                placeholder="Create a post"
                disabled
                style={{
                  flex: 1,
                  background: "#020617",
                  border: "1px solid #272443",
                  color: "#9ca3af",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                Пост бичих
              </div>
            </div>
          </Link>
          {loading ? (
            <div
              style={{
                color: "#818384",
                textAlign: "center",
                padding: "40px",
              }}
            >
              Постууд ачааллаж байна...
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                color: "#818384",
                textAlign: "center",
                padding: "40px",
              }}
            >
              Пост одоогоор алга
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#020617",
                    border: "1px solid #1f2937",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    display: "flex",
                    transition: "background-color 0.2s, border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#050816",
                      borderRadius: "8px 0 0 8px",
                      minWidth: "40px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpvote(post._id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#a855f7",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px",
                      }}
                    >
                      ▲
                    </button>
                    <span
                      style={{
                        color: "#e5e7eb",
                        fontSize: "12px",
                        margin: "4px 0",
                      }}
                    >
                      {post.upvotes - post.downvotes}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownvote(post._id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4b5563",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px",
                      }}
                    >
                      ▼
                    </button>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginBottom: "4px",
                      }}
                    >
                      r/{post.subreddit} • Нийтэлсэн: u/
                      {post.author?.username}
                    </div>
                    <h3
                      style={{
                        color: "#f9fafb",
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        color: "#e5e7eb",
                        fontSize: "14px",
                        marginBottom: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      {post.content.substring(0, 200)}...
                    </p>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      {post.comments?.length || 0} сэтгэгдэл
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

