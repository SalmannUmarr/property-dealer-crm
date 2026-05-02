import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateLeadScore } from "@/lib/leadScoring";
import { createActivityLog } from "@/lib/activityLogger";
import { sendEmail } from "@/lib/email";
import { validateLeadData } from "@/lib/validators";
import Lead from "@/models/Lead";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        let leads;

        if (user.role === "admin") {
            leads = await Lead.find()
                .populate("assignedTo", "name email role")
                .sort({ createdAt: -1 });
        } else {
            leads = await Lead.find({ assignedTo: user.id })
                .populate("assignedTo", "name email role")
                .sort({ createdAt: -1 });
        }

        return Response.json({ leads });
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch leads", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const validationErrors = validateLeadData(body);

        if (validationErrors.length > 0) {
            return Response.json(
                {
                    message: "Validation failed",
                    errors: validationErrors,
                },
                { status: 400 }
            );
        }

        const {
            name,
            email,
            phone,
            propertyInterest,
            budget,
            status,
            notes,
            assignedTo,
            followUpDate,
        } = body;

        const score = calculateLeadScore(budget);

        const lead = await Lead.create({
            name,
            email,
            phone,
            propertyInterest,
            budget,
            status: status || "New",
            notes,
            assignedTo: assignedTo || null,
            score,
            followUpDate: followUpDate || null,
            lastActivityAt: new Date(),
        });

        await createActivityLog({
            lead: lead._id,
            user: user.id,
            action: "Lead Created",
            details: `${user.name} created a new lead with ${score} priority.`,
        });

        await sendEmail(
            user.email,
            "New Lead Created",
            `A new lead (${lead.name}) has been created with ${score} priority.`
        );

        return Response.json(
            { message: "Lead created successfully", lead },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { message: "Failed to create lead", error: error.message },
            { status: 500 }
        );
    }
}