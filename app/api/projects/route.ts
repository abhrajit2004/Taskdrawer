import { NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { tasksTable } from '@/db/schema';

export async function GET(request: Request) {
  try {

    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const projects = await db.select({ projectName: tasksTable.projectName }).from(tasksTable).where(eq(tasksTable.userId, parseInt(userId)));

    return NextResponse.json({ success: true, projects: projects });

  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}