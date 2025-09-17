"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams(); // Get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${id}`);
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative w-full h-96">
          <Image
            src={
              product.imageUrl.startsWith("http")
                ? product.imageUrl
                : `/${product.imageUrl}`
            }
            alt={product.title}
            fill
            className="object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {product.title}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Price */}
          <p className="text-2xl font-bold text-pink-600 mb-4">
            ₹
            {product.sizes?.length > 0
              ? product.sizes[0].discountedPrice || product.sizes[0].originalPrice
              : product.price}
          </p>

          {/* Stock */}
          <span
            className={`inline-block mb-4 px-3 py-1 text-sm font-semibold rounded-full ${
              product.inStock
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>

          {/* Sizes (if hoodie or variant) */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Available Sizes:</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700"
                  >
                    {size.size} - ₹
                    {size.discountedPrice || size.originalPrice}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: product.inStock ? 1.05 : 1 }}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition 
              ${
                product.inStock
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={20} />
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
