import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:     { type: String, required: true, unique: true },
    email:        { type: String },
    companyName:  { type: String },
    password:     { type: String, required: true },
    // tokenVersion enables server-side token revocation.
    // Increment this value to invalidate all previously issued JWTs for this user.
    tokenVersion: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
