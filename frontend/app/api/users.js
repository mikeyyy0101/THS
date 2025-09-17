import connectDB from "../../backend/db.js"; // your MongoDB connection
import User from "../../backend/models/User.js"; // your users schema
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { uid, name, email, photoURL } = req.body;

    // Check if user exists
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, name, email, photoURL });
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ uid: user.uid, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store JWT in user's document
    user.token = token;
    await user.save();

    return res.status(200).json({ token });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
