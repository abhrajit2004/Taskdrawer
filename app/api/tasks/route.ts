import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';


export async function GET(request: Request) {

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");

        if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

        const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, parseInt(userId)));
        return NextResponse.json({ success: true, tasks: tasks });
    }
    catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 500 });
    }
}

export async function POST(request: Request) {

    try {

        const body = await request.json();
        const { title, description, dueDate, priority, userId, projectName } = body;

        if (!title || !description || !dueDate || !priority || !projectName) return NextResponse.json({ error: "Task credentials is required" }, { status: 400 });

        const newTask = await db.insert(tasksTable).values({ title, description, dueDate, priority, userId, projectName }).returning();

        return NextResponse.json(newTask, { status: 201 });
    }
    catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {

        // const user = await authMiddleware(request);
        // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();

        const { id, title, description, dueDate, priority, projectName } = body;

        if (!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

        const updatedTask = await db.update(tasksTable).set({ title, description, dueDate, priority, projectName }).where(eq(tasksTable.id, id)).returning();
        return NextResponse.json(updatedTask);
    }
    catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        //    const user = await authMiddleware(request);

        //    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await request.json();
        if (!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

        const [deletedTask] = await db.delete(tasksTable).where(eq(tasksTable.id, id)).returning();

        if (!deletedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: deletedTask });
    }
    catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}