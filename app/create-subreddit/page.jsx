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
        background: "#030303",
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
            ← Back to Feed
          </button>
        </Link>
        <div
          style={{
            background: "#1a1a1b",
            border: "1px solid #343536",
            borderRadius: "4px",
            padding: "32px",
          }}
        >
          <h1
            style={{
              color: "#d7dadc",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Create a Community
          </h1>
          <p
            style={{
              color: "#818384",
              fontSize: "14px",
              marginBottom: "32px",
            }}
          >
            Start a new community to discuss topics with your team
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
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
                Community Name
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "#818384",
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
                  placeholder="mycommunity"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#272729",
                    color: "#d7dadc",
                    border: "1px solid #343536",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <p
                style={{
                  color: "#818384",
                  fontSize: "12px",
                  marginTop: "8px",
                }}
              >
                Community names are lowercase and cannot contain spaces
              </p>
            </div>
            <div style={{ marginBottom: "24px" }}>
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
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is your community about?"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#272729",
                  color: "#d7dadc",
                  border: "1px solid #343536",
                  borderRadius: "4px",
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
                  background: "#818384",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {loading ? "Creating..." : "Create Community"}
              </button>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#272729",
                    color: "#d7dadc",
                    border: "1px solid #343536",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


