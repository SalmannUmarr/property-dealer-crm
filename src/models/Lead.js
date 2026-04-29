import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        propertyInterest: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["New", "Assigned", "Contacted", "In Progress", "Closed", "Lost"],
            default: "New",
        },
        notes: {
            type: String,
            default: "",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        score: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Low",
        },
        followUpDate: {
            type: Date,
            default: null,
        },
        lastActivityAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);