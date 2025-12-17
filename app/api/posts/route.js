// api/posts/route.js
import connectMongoDB from "@/libs/mongodb";
import { Post } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, content, author, subreddit } = await request.json();
    await connectMongoDB();
    
    const post = await Post.create({
      title,
      content,
      author,
      subreddit: subreddit || "general",
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const subreddit = searchParams.get("subreddit");
    
    let query = {};
    if (subreddit) query.subreddit = subreddit;
    
    const posts = await Post.find(query)
      .populate("author")
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}