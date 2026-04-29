import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);