import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import { createActivityLog } from "@/lib/activityLogger";
import { sendEmail } from "@/lib/email";
import { validateLeadData, validateStatus } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimiter";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const limiter = rateLimit({
            key: user.id,
            limit: user.role === "admin" ? 500 : 50,
            windowMs: 60 * 1000,
        });

        if (!limiter.allowed) {
            return Response.json(
                { message: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const { id } = params;

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

        const limiter = rateLimit({
            key: user.id,
            limit: user.role === "admin" ? 500 : 50,
            windowMs: 60 * 1000,
        });

        if (!limiter.allowed) {
            return Response.json(
                { message: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const { id } = params;
        const body = await req.json();

        const existingLead = await Lead.findById(id);

        if (!existingLead) {
            return Response.json({ message: "Lead not found" }, { status: 404 });
        }

        if (user.role === "agent" && String(existingLead.assignedTo) !== user.id) {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        if (body.status && !validateStatus(body.status)) {
            return Response.json(
                { message: "Invalid lead status" },
                { status: 400 }
            );
        }

        if (
            body.budget ||
            body.name ||
            body.phone ||
            body.propertyInterest ||
            body.email
        ) {
            const mergedData = {
                name: body.name || existingLead.name,
                phone: body.phone || existingLead.phone,
                email: body.email || existingLead.email,
                propertyInterest:
                    body.propertyInterest || existingLead.propertyInterest,
                budget: body.budget || existingLead.budget,
            };

            const validationErrors = validateLeadData(mergedData);

            if (validationErrors.length > 0) {
                return Response.json(
                    { message: "Validation failed", errors: validationErrors },
                    { status: 400 }
                );
            }
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

        if (body.assignedTo) {
            const agent = await User.findById(body.assignedTo);

            if (agent) {
                await createActivityLog({
                    lead: id,
                    user: user.id,
                    action: "Lead Assigned",
                    details: `${user.name} assigned this lead to ${agent.name}.`,
                });

                await sendEmail(
                    agent.email,
                    "New Lead Assigned",
                    `Hello ${agent.name},\n\nYou have been assigned a new lead: ${updatedLead.name}.\n\nPhone: ${updatedLead.phone}\nProperty Interest: ${updatedLead.propertyInterest}\nBudget: ${updatedLead.budget}\nPriority: ${updatedLead.score}\n\nPlease follow up with the client.`
                );
            }
        }

        if (body.status) {
            await createActivityLog({
                lead: id,
                user: user.id,
                action: "Status Updated",
                details: `${user.name} changed lead status to ${body.status}.`,
            });
        }

        if (body.followUpDate) {
            await createActivityLog({
                lead: id,
                user: user.id,
                action: "Follow-up Updated",
                details: `${user.name} set follow-up date to ${new Date(
                    body.followUpDate
                ).toLocaleDateString()}.`,
            });
        }

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
            return Response.json(
                { message: "Only admin can delete leads" },
                { status: 403 }
            );
        }

        const limiter = rateLimit({
            key: user.id,
            limit: 500,
            windowMs: 60 * 1000,
        });

        if (!limiter.allowed) {
            return Response.json(
                { message: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const { id } = params;

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