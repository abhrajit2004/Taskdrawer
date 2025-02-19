import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }


    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in the database
    const newUser = await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Generate JWT token
     const token = generateToken(newUser[0].id.toString());

    return NextResponse.json({ message: "User registered successfully", token, id:newUser[0].id.toString(), username:newUser[0].name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}