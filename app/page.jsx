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
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              color: "#818384",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Subreddits
          </h2>
          <button
            onClick={() => setSelectedSubreddit(null)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: !selectedSubreddit ? "#272729" : "transparent",
              color: "#818384",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              marginBottom: "8px",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            All Posts
          </button>
          {subreddits.map((sub) => (
            <button
              key={sub._id}
              onClick={() => setSelectedSubreddit(sub.name)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background:
                  selectedSubreddit === sub.name ? "#272729" : "transparent",
                color: "#818384",
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
              Create Subreddit
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
              color: "#818384",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            Logged in as
          </p>
          <p
            style={{
              color: "#d7dadc",
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
              background: "#818384",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="app-main">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/create-post" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#1a1a1b",
                border: "1px solid #343536",
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "16px",
                cursor: "pointer",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#818384",
                  borderRadius: "50%",
                }}
              />
              <input
                type="text"
                placeholder="Create a post"
                disabled
                style={{
                  flex: 1,
                  background: "#272729",
                  border: "none",
                  color: "#818384",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              />
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
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                color: "#818384",
                textAlign: "center",
                padding: "40px",
              }}
            >
              No posts yet
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
                    background: "#1a1a1b",
                    border: "1px solid #343536",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    display: "flex",
                    transition: "background-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#272729",
                      borderRadius: "4px 0 0 4px",
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
                        color: "#818384",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px",
                      }}
                    >
                      ▲
                    </button>
                    <span
                      style={{
                        color: "#818384",
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
                        color: "#818384",
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
                        color: "#818384",
                        marginBottom: "4px",
                      }}
                    >
                      r/{post.subreddit} • Posted by u/
                      {post.author?.username}
                    </div>
                    <h3
                      style={{
                        color: "#d7dadc",
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        color: "#818384",
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
                        color: "#818384",
                      }}
                    >
                      {post.comments?.length || 0} Comments
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

