// api/posts/[id]/route.js
import connectMongoDB from "@/libs/mongodb";
import { Post } from "@/models/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const post = await Post.findById(id)
      .populate("author")
      .populate("comments.author");
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}