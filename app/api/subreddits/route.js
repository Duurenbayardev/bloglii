// api/subreddits/route.js
import connectMongoDB from "@/libs/mongodb";
import { Subreddit } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, description, createdBy } = await request.json();
    await connectMongoDB();
    
    const subreddit = await Subreddit.create({
      name,
      description,
      createdBy,
      memberCount: 1,
    });
    
    return NextResponse.json({ subreddit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const subreddits = await Subreddit.find()
      .populate("createdBy")
      .sort({ memberCount: -1 });
    return NextResponse.json({ subreddits }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}