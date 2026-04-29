import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return Response.json({ message: "Only admin can view agents" }, { status: 403 });
        }

        const agents = await User.find({ role: "agent" }).select("-password");

        return Response.json({ agents });
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch agents", error: error.message },
            { status: 500 }
        );
    }
}