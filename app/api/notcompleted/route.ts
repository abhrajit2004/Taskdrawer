import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {

        const { id } = await request.json();

        if(!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

        const notCompleted = await db.update(tasksTable).set({ completed: false }).where(eq(tasksTable.id, id)).returning();

        

        return NextResponse.json({ success: true, completed: notCompleted });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}