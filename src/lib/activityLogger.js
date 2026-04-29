import ActivityLog from "@/models/ActivityLog";

export async function createActivityLog({ lead, user = null, action, details = "" }) {
    await ActivityLog.create({
        lead,
        user,
        action,
        details,
    });
}