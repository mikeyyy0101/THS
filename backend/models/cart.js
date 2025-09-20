import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, default: null },
  quantity: { type: Number, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // store auth uid or string
  items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
