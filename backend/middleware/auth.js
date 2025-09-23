import admin from "../firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Login first" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid }; // use uid as user id
    next();
  } catch (err) {
    console.error("Firebase token error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
