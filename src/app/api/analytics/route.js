import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Lead from "@/models/Lead";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return Response.json(
                { message: "Only admin can view analytics" },
                { status: 403 }
            );
        }

        const leads = await Lead.find().populate("assignedTo", "name email role");
        const agents = await User.find({ role: "agent" }).select("-password");

        const totalLeads = leads.length;

        const priorityCounts = {
            High: leads.filter((lead) => lead.score === "High").length,
            Medium: leads.filter((lead) => lead.score === "Medium").length,
            Low: leads.filter((lead) => lead.score === "Low").length,
        };

        const statusCounts = {
            New: leads.filter((lead) => lead.status === "New").length,
            Assigned: leads.filter((lead) => lead.status === "Assigned").length,
            Contacted: leads.filter((lead) => lead.status === "Contacted").length,
            "In Progress": leads.filter((lead) => lead.status === "In Progress").length,
            Closed: leads.filter((lead) => lead.status === "Closed").length,
            Lost: leads.filter((lead) => lead.status === "Lost").length,
        };

        const agentPerformance = agents.map((agent) => {
            const assignedLeads = leads.filter(
                (lead) => String(lead.assignedTo?._id) === String(agent._id)
            );

            return {
                id: agent._id,
                name: agent.name,
                email: agent.email,
                totalAssigned: assignedLeads.length,
                closed: assignedLeads.filter((lead) => lead.status === "Closed").length,
                inProgress: assignedLeads.filter(
                    (lead) => lead.status === "In Progress"
                ).length,
            };
        });

        return Response.json({
            totalLeads,
            priorityCounts,
            statusCounts,
            agentPerformance,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to load analytics", error: error.message },
            { status: 500 }
        );
    }
}