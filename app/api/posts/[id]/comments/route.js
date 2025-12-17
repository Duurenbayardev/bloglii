import connectMongoDB from "@/libs/mongodb";
import { Post } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { content, author } = await request.json();
    await connectMongoDB();
    
    const post = await Post.findById(id);
    post.comments.push({ content, author });
    await post.save();
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}