"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/HeaderShop";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        console.log("Fetched products:", data, Array.isArray(data));
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Products Section */}
      <main className="flex-1 pt-32 px-6 sm:px-12">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          Our <span className="text-pink-700">Best Selling Products</span>
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center"
              >
                {/* Image with stock badge */}
                <div className="relative w-full h-56 mb-4">
                  <Image
                    src={`/${product.imageUrl}`}
                    alt={product.title}
                    fill
                    className="object-cover rounded-xl shadow-sm"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      product.inStock
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-pink-600 mb-4">
                  ₹{product.price}
                </p>
                <motion.button
  whileHover={{ scale: 1.05 }}
  disabled={!product.inStock}
  onClick={() => {
    if (product.inStock) {
      window.location.href = `/cart?productId=${product._id}`;
    }
  }}
  className={`px-5 py-2 rounded-full font-semibold shadow-md transition ${
    product.inStock
      ? "bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
>
  {product.inStock ? "Add to Cart" : "Unavailable"}
</motion.button>

              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
