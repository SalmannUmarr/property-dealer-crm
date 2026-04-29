import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();

        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return Response.json(
                { message: "Name, email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "agent",
        });

        return Response.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { message: "Signup failed", error: error.message },
            { status: 500 }
        );
    }
}