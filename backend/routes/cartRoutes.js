import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/:userId", verifyToken, getCart);
router.post("/remove", verifyToken, removeFromCart);

export default router;
