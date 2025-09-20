import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

/**
 * Add item to cart: if cart doc doesn't exist, create it.
 * If the same productId+size exists, increment quantity, else push.
 */
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, size, quantity = 1 } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: "Missing userId or productId" });

    // validate productId
    if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ error: "Invalid productId" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, size, quantity }] });
    } else {
      // check if same productId+size exists
      const idx = cart.items.findIndex(
        (it) => String(it.productId) === String(productId) && String(it.size || "") === String(size || "")
      );

      if (idx > -1) {
        cart.items[idx].quantity = (cart.items[idx].quantity || 0) + quantity;
      } else {
        cart.items.push({ productId, size, quantity });
      }
    }

    await cart.save();

    // Return populated items
    const populated = await Cart.findOne({ userId }).lean();
    // populate manually to ensure product fields
    const detailed = await Promise.all(populated.items.map(async (it) => {
      const p = await Product.findById(it.productId).lean();
      return { ...it, product: p };
    }));

    return res.json({ items: detailed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get cart by userId: returns array of items with product details
 */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const cart = await Cart.findOne({ userId }).lean();
    if (!cart) return res.json([]);

    const detailed = await Promise.all(cart.items.map(async (it) => {
      const p = await Product.findById(it.productId).lean();
      return { ...it, product: p };
    }));

    return res.json(detailed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Remove item from cart: expects { userId, productId, size } in body
 * If quantity > 1 you may choose to decrement. Here we remove the item entirely.
 */
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, size } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: "Missing params" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (it) => !(String(it.productId) === String(productId) && String(it.size || "") === String(size || ""))
    );

    await cart.save();

    const detailed = await Promise.all(cart.items.map(async (it) => {
      const p = await Product.findById(it.productId).lean();
      return { ...it, product: p };
    }));

    return res.json(detailed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
