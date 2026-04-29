import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import { createActivityLog } from "@/lib/activityLogger";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const lead = await Lead.findById(id).populate("assignedTo", "name email role");

        if (!lead) {
            return Response.json({ message: "Lead not found" }, { status: 404 });
        }

        if (user.role === "agent" && String(lead.assignedTo?._id) !== user.id) {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const activities = await ActivityLog.find({ lead: id })
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        return Response.json({ lead, activities });
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch lead", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const existingLead = await Lead.findById(id);

        if (!existingLead) {
            return Response.json({ message: "Lead not found" }, { status: 404 });
        }

        if (user.role === "agent" && String(existingLead.assignedTo) !== user.id) {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        if (body.budget) {
            body.score = calculateLeadScore(body.budget);
        }

        body.lastActivityAt = new Date();

        const updatedLead = await Lead.findByIdAndUpdate(id, body, {
            new: true,
        }).populate("assignedTo", "name email role");

        await createActivityLog({
            lead: id,
            user: user.id,
            action: "Lead Updated",
            details: `${user.name} updated lead details.`,
        });

        return Response.json({
            message: "Lead updated successfully",
            lead: updatedLead,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to update lead", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return Response.json({ message: "Only admin can delete leads" }, { status: 403 });
        }

        const { id } = await params;

        const deletedLead = await Lead.findByIdAndDelete(id);

        if (!deletedLead) {
            return Response.json({ message: "Lead not found" }, { status: 404 });
        }

        await ActivityLog.deleteMany({ lead: id });

        return Response.json({ message: "Lead deleted successfully" });
    } catch (error) {
        return Response.json(
            { message: "Failed to delete lead", error: error.message },
            { status: 500 }
        );
    }
}