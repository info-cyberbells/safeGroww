import mongoose, { Document, Schema } from "mongoose";

/**
 * SystemBroker — stores the backend's own market data token.
 * This is NOT a user account. It's the server's shared broker connection
 * used to serve live & historical market data to ALL users.
 *
 * Token is refreshed daily by the cron job in marketData.service.ts
 */
export interface ISystemBroker extends Document {
    broker: string;          // "fyers" | "fivepaisa"
    accessToken: string;     // current valid token
    userID: string;          // broker's internal userID
    tokenExpiry: Date;       // when token expires (24h)
    updatedAt: Date;
}

const SystemBrokerSchema = new Schema<ISystemBroker>(
    {
        broker: { type: String, required: true, unique: true },
        accessToken: { type: String, required: true },
        userID: { type: String, default: "" },
        tokenExpiry: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISystemBroker>("SystemBroker", SystemBrokerSchema);
