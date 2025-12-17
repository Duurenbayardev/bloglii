// api/users/route.js
import connectMongoDB from "@/libs/mongodb";
import { User } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username } = await request.json();
    await connectMongoDB();
    
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}