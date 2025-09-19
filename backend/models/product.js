import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  imageUrl: { type: String },
  originalPrice: { type: Number },     // for products without sizes
  discountedPrice: { type: Number },   // for products without sizes
  sizes: [sizeSchema],                 // for hoodies
  inStock: { type: Boolean, default: true },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
