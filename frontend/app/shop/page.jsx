"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/HeaderShop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({}); // Track selected size per product

  const currentUser = useSelector((state) => state.auth.currentUser);

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Add to cart
  const handleAddToCart = async (productId, size) => {
    if (!currentUser?.uid) return toast.error("❌ Please login first");

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          productId,
          size: size || null,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success("✅ Added to Cart!", { autoClose: 1500 });
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-pink-50 via-white to-pink-100">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-12 px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, i) => {
            const hasSizes = product.sizes?.length > 0;
            const selectedSize = hasSizes
              ? selectedSizes[product._id] || product.sizes[0].size
              : null;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
              >
                <div className="relative w-full h-56 mb-4">
                  <Image
                    src={product.imageUrl.startsWith("http") ? product.imageUrl : `/${product.imageUrl}`}
                    alt={product.title}
                    fill
                    className="object-cover rounded-xl"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-center mb-1">{product.title}</h2>
                <p className="text-gray-600 text-sm mb-2 text-center line-clamp-2">{product.description}</p>

                {hasSizes && (
                  <select
                    value={selectedSize}
                    onChange={(e) =>
                      setSelectedSizes((prev) => ({ ...prev, [product._id]: e.target.value }))
                    }
                    className="mb-4 px-2 py-2 border rounded-lg"
                  >
                    {product.sizes.map((s) => (
                      <option key={s.size} value={s.size}>
                        {s.size} – ₹{s.discountedPrice}
                      </option>
                    ))}
                  </select>
                )}

                <p className="text-xl font-bold text-pink-600 mb-4">
                  ₹{hasSizes ? product.sizes.find((s) => s.size === selectedSize)?.discountedPrice : product.discountedPrice || product.price}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  disabled={!product.inStock}
                  onClick={() => product.inStock && handleAddToCart(product._id, selectedSize)}
                  className={`px-5 py-2 rounded-full font-semibold shadow-md ${
                    product.inStock ? "bg-pink-600 text-white hover:bg-pink-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {product.inStock ? "Add to Cart" : "Unavailable"}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
