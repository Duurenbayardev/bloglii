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
                Loading post...
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
                Post not found
            </div>
        );

    return (
        <div className="app-shell">
            <div className="app-sidebar">
                <Link href="/" style={{ textDecoration: "none" }}>
                    <button
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "#272729",
                            color: "#818384",
                            border: "1px solid #343536",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginBottom: "24px",
                            fontSize: "14px",
                        }}
                    >
                        ← Back to Feed
                    </button>
                </Link>
                <div style={{ color: "#818384", fontSize: "12px" }}>
                    <p style={{ marginBottom: "8px" }}>Logged in as</p>
                    <p
                        style={{
                            color: "#d7dadc",
                            fontWeight: "600",
                            marginBottom: "16px",
                        }}
                    >
                        u/{currentUser.username}
                    </p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("currentUser");
                            router.push("/login");
                        }}
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
                    <div
                        style={{
                            background: "#1a1a1b",
                            border: "1px solid #343536",
                            borderRadius: "4px",
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
                                background: "#272729",
                                borderRadius: "4px 0 0 4px",
                                minWidth: "50px",
                            }}
                        >
                            <button
                                onClick={handleUpvote}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#818384",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    padding: "6px",
                                }}
                            >
                                ▲
                            </button>
                            <span
                                style={{
                                    color: "#818384",
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
                                    color: "#818384",
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
                                    color: "#818384",
                                    marginBottom: "8px",
                                }}
                            >
                                r/{post.subreddit} • Posted by u/
                                {post.author?.username}
                            </div>
                            <h1
                                style={{
                                    color: "#d7dadc",
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    marginBottom: "12px",
                                }}
                            >
                                {post.title}
                            </h1>
                            <p
                                style={{
                                    color: "#d7dadc",
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
                                    color: "#818384",
                                }}
                            >
                                {post.comments?.length || 0} Comments
                            </div>
                            {post.author?._id === currentUser._id && (
                                <button
                                    onClick={handleDeletePost}
                                    style={{
                                        marginTop: "12px",
                                        padding: "6px 12px",
                                        background: "#d32f2f",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
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
                            background: "#1a1a1b",
                            border: "1px solid #343536",
                            borderRadius: "4px",
                            padding: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        <h2
                            style={{
                                color: "#d7dadc",
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "12px",
                            }}
                        >
                            Add a Comment
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
                                placeholder="What are your thoughts?"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#272729",
                                    color: "#d7dadc",
                                    border: "1px solid #343536",
                                    borderRadius: "4px",
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
                                    background: "#818384",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "20px",
                                    cursor: submitting
                                        ? "not-allowed"
                                        : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    alignSelf: "flex-start",
                                }}
                            >
                                {submitting ? "Posting..." : "Post Comment"}
                            </button>
                        </form>
                    </div>
                    <div>
                        <h2
                            style={{
                                color: "#d7dadc",
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "12px",
                            }}
                        >
                            Comments
                        </h2>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "#1a1a1b",
                                        border: "1px solid #343536",
                                        borderRadius: "4px",
                                        padding: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#818384",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        u/{comment.author?.username}
                                    </div>
                                    <p
                                        style={{
                                            color: "#d7dadc",
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
                                    color: "#818384",
                                    fontSize: "14px",
                                }}
                            >
                                No comments yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


