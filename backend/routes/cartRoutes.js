import express from "express";
import Cart from "../models/cart.js";

const router = express.Router();

// ✅ Get user's cart
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) cart = await Cart.create({ userId, items: [] });
    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, size, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId, size, quantity: quantity || 1 });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove item from cart
router.post("/remove", async (req, res) => {
  const { userId, productId, size } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && (!size || item.size === size))
    );

    cart.updatedAt = Date.now();
    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
