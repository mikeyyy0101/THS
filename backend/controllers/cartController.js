import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

/**
 * Add item to cart: if cart doc doesn't exist, create it.
 * If the same productId+size exists, increment quantity, else push.
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get from verified token
    const { productId, size, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ error: "Missing productId" });

    if (!mongoose.isValidObjectId(productId))
      return res.status(400).json({ error: "Invalid productId" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, size, quantity }] });
    } else {
      const idx = cart.items.findIndex(
        (it) =>
          String(it.productId) === String(productId) &&
          String(it.size || "") === String(size || "")
      );

      if (idx > -1) {
        cart.items[idx].quantity = (cart.items[idx].quantity || 0) + quantity;
      } else {
        cart.items.push({ productId, size, quantity });
      }
    }

    await cart.save();

    const populated = await Cart.findOne({ userId }).lean();
    const detailed = await Promise.all(
      populated.items.map(async (it) => {
        const p = await Product.findById(it.productId).lean();
        return { ...it, product: p };
      })
    );

    return res.json({ items: detailed });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get cart by userId
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from token

    const cart = await Cart.findOne({ userId }).lean();
    if (!cart) return res.json([]);

    const detailed = await Promise.all(
      cart.items.map(async (it) => {
        const p = await Product.findById(it.productId).lean();
        return { ...it, product: p };
      })
    );

    return res.json(detailed);
  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from token
    const { productId, size } = req.body;

    if (!productId) return res.status(400).json({ error: "Missing productId" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (it) =>
        !(String(it.productId) === String(productId) && String(it.size || "") === String(size || ""))
    );

    await cart.save();

    const detailed = await Promise.all(
      cart.items.map(async (it) => {
        const p = await Product.findById(it.productId).lean();
        return { ...it, product: p };
      })
    );

    return res.json(detailed);
  } catch (err) {
    console.error("Remove from cart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
