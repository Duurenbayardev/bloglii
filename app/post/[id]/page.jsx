"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function PostDetail() {
    const router = useRouter();
    const params = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
        if (currentUser && params?.id) {
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, params?.id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/posts/${params.id}`);
            const data = await response.json();
            setPost(data.post);
        } catch (error) {
            console.error("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        try {
            await fetch(`/api/posts/${params.id}/upvotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            fetchPost();
        } catch (error) {
            console.error("Error upvoting:", error);
        }
    };

    const handleDownvote = async () => {
        try {
            await fetch(`/api/posts/${params.id}/downvotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            fetchPost();
        } catch (error) {
            console.error("Error downvoting:", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) {
            alert("Please write a comment");
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch(
                `/api/posts/${params.id}/comments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: commentContent,
                        author: currentUser._id,
                    }),
                }
            );
            if (response.ok) {
                setCommentContent("");
                fetchPost();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await fetch(`/api/posts/${params.id}`, {
                method: "DELETE",
            });
            router.push("/");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    };

    if (!currentUser) return null;
    if (loading)
        return (
            <div
                style={{
                    color: "#818384",
                    textAlign: "center",
                    padding: "40px",
                }}
            >
                Пост ачааллаж байна...
            </div>
        );
    if (!post)
        return (
            <div
                style={{
                    color: "#818384",
                    textAlign: "center",
                    padding: "40px",
                }}
            >
                Пост олдсонгүй
            </div>
        );

    return (
        <div className="app-shell">
            <div className="app-sidebar">
                <div style={{ color: "#818384", fontSize: "12px" }}>
                    <p style={{ marginBottom: "8px" }}>Нэвтэрсэн хэрэглэгч</p>
                    <p
                        style={{
                            color: "#d7dadc",
                            fontWeight: "600",
                            marginBottom: "16px",
                        }}
                    >
                        u/{currentUser.username}
                    </p>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <button
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                background: "#050816",
                                color: "#e5e7eb",
                                border: "1px solid #312e81",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginBottom: "24px",
                                fontSize: "14px",
                            }}
                        >
                            ← Лент рүү буцах
                        </button>
                    </Link>

                </div>
                <button
                    onClick={() =>
                        setTheme((t) => (t === "dark" ? "light" : "dark"))
                    }
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        marginTop: "10px",
                        background: theme === "light" ? "#4b5563" : "#111827",
                        color: "#f9fafb",
                        border: "1px solid #4b5563",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "13px",
                    }}
                >
                    {theme === "light" ? "Харанхуй горим" : "Гэрэлтэй горим"}
                </button>
            </div>
            <div className="app-main">
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div
                        style={{
                            background: "#020617",
                            border: "1px solid #1f2937",
                            borderRadius: "8px",
                            marginBottom: "24px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "12px",
                                background: "#050816",
                                borderRadius: "8px 0 0 8px",
                                minWidth: "50px",
                            }}
                        >
                            <button
                                onClick={handleUpvote}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#a855f7",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    padding: "6px",
                                }}
                            >
                                ▲
                            </button>
                            <span
                                style={{
                                    color: "#e5e7eb",
                                    fontSize: "12px",
                                    margin: "6px 0",
                                }}
                            >
                                {post.upvotes - post.downvotes}
                            </span>
                            <button
                                onClick={handleDownvote}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#4b5563",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    padding: "6px",
                                }}
                            >
                                ▼
                            </button>
                        </div>
                        <div style={{ flex: 1, padding: "16px" }}>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "8px",
                                }}
                            >
                                r/{post.subreddit} • Нийтэлсэн: u/
                                {post.author?.username}
                            </div>
                            <h1
                                style={{
                                    color: "#f9fafb",
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    marginBottom: "12px",
                                }}
                            >
                                {post.title}
                            </h1>
                            <p
                                style={{
                                    color: "#e5e7eb",
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    marginBottom: "16px",
                                }}
                            >
                                {post.content}
                            </p>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                }}
                            >
                                {post.comments?.length || 0} Comments
                            </div>
                            {(post.author?._id === currentUser._id ||
                                currentUser.username === "duuree") && (
                                    <button
                                        onClick={handleDeletePost}
                                        style={{
                                            marginTop: "12px",
                                            padding: "6px 12px",
                                            background: "#b91c1c",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Delete Post
                                    </button>
                                )}
                        </div>
                    </div>
                    <div
                        style={{
                            background: "#020617",
                            border: "1px solid #1f2937",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        <h2
                            style={{
                                color: "#f9fafb",
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "12px",
                            }}
                        >
                            Сэтгэгдэл нэмэх
                        </h2>
                        <form
                            onSubmit={handleAddComment}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <textarea
                                value={commentContent}
                                onChange={(e) =>
                                    setCommentContent(e.target.value)
                                }
                                placeholder="Юу гэж бодож байна?"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#050816",
                                    color: "#e5e7eb",
                                    border: "1px solid #1f2937",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    minHeight: "80px",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: "8px 16px",
                                    background: "#7c3aed",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "999px",
                                    cursor: submitting
                                        ? "not-allowed"
                                        : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    alignSelf: "flex-start",
                                }}
                            >
                                {submitting
                                    ? "Илгээж байна..."
                                    : "Сэтгэгдэл илгээх"}
                            </button>
                        </form>
                    </div>
                    <div>
                        <h2
                            style={{
                                color: "#f9fafb",
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "12px",
                            }}
                        >
                            Сэтгэгдлүүд
                        </h2>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "#020617",
                                        border: "1px solid #1f2937",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#9ca3af",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        u/{comment.author?.username}
                                    </div>
                                    <p
                                        style={{
                                            color: "#e5e7eb",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    color: "#9ca3af",
                                    fontSize: "14px",
                                }}
                            >
                                Сэтгэгдэл алга
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


