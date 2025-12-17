// api/posts/[id]/downvote/route.js
import connectMongoDB from "@/libs/mongodb";
import { Post } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { userId } = await request.json();
    await connectMongoDB();
    
    const post = await Post.findById(id);
    
    if (post.userDownvoted.includes(userId)) {
      post.downvotes -= 1;
      post.userDownvoted = post.userDownvoted.filter(u => u.toString() !== userId);
    } else {
      post.downvotes += 1;
      post.userDownvoted.push(userId);
      post.userUpvoted = post.userUpvoted.filter(u => u.toString() !== userId);
    }
    
    await post.save();
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}