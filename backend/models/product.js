import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // "Tote Bag" or "Hoodie"
  imageUrl: { type: String },
  price: { type: Number, required: true }, // default price for products without sizes
  sizes: [sizeSchema], // for hoodies with multiple sizes
  inStock: { type: Boolean, default: true },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
