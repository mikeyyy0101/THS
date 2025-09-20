import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// POST /api/cart/add
router.post("/add", addToCart);

// GET /api/cart/:userId
router.get("/:userId", getCart);

// POST /api/cart/remove
router.post("/remove", removeFromCart);

export default router;
