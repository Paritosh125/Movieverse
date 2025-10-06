import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Constraint: valid email
    passwordHash: { type: String, required: true }, // Encrypted password
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],// Relationship
    role: { type: String, enum: ["user", "admin"], default: "user" }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
