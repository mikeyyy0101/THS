"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/HeaderShop";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import DebugUser from "@/debugger/debug";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({}); // Track size per product
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    if (filter === "All") return true;
    return product.category.toLowerCase() === filter.toLowerCase();
  });

  // Add to cart handler
// Add to cart handler
const handleAddToCart = async (productId, size) => {
  if (!currentUser) {
    return toast.error("❌ Please login to add items to cart");
  }

  try {
    const token = await currentUser.getIdToken(); // Firebase token

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ send token
      },
      body: JSON.stringify({ productId, size, quantity: 1 }), // ❌ do NOT send userId
    });

    if (!res.ok) throw new Error("Failed to add to cart");

    toast.success("✅ Added to Cart!", { autoClose: 1500 });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    toast.error("Failed to add to cart");
  }
};




  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-100 min-h-screen flex flex-col font-sans">
      <Header />

      {/* Category Filters */}
      <div className="flex gap-4 justify-center py-10">
        {["All", "Tote Bag", "Hoodie"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === cat
                ? "bg-pink-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Section */}
      <main className="flex-1 pt-12 px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 text-lg col-span-full">
              No products found in this category.
            </p>
          ) : (
            filteredProducts.map((product, i) => {
              const hasSizes = product.sizes && product.sizes.length > 0;
              const selectedSize =
                hasSizes && (selectedSizes[product._id] || product.sizes[0].size);
              const sizeObj = hasSizes
                ? product.sizes.find((s) => s.size === selectedSize)
                : null;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-56 mb-4">
                    <Image
                      src={
                        product.imageUrl.startsWith("http")
                          ? product.imageUrl
                          : `/${product.imageUrl}`
                      }
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

                  {/* Title + Description */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
                    {product.description}
                  </p>

                  {/* Size Selector (only for products with sizes) */}
                  {hasSizes && (
                    <select
                      value={selectedSize}
                      onChange={(e) =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [product._id]: e.target.value,
                        }))
                      }
                      className="mb-4 px-2 py-2 border border-black/50 text-black rounded-lg"
                    >
                      {product.sizes.map((s) => (
                        <option key={s.size} value={s.size}>
                          {s.size}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Price Section */}
                  <div className="mb-4 text-center">
                    {hasSizes && sizeObj ? (
                      <>
                        {sizeObj.discountedPrice < sizeObj.originalPrice && (
                          <span className="text-gray-500 line-through mr-2">
                            ₹{sizeObj.originalPrice}
                          </span>
                        )}
                        <span className="text-xl font-bold text-pink-600">
                          ₹{sizeObj.discountedPrice}
                        </span>
                      </>
                    ) : (
                      <>
                        {product.discountedPrice < product.originalPrice && (
                          <span className="text-gray-500 line-through mr-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        <span className="text-xl font-bold text-pink-600">
                          ₹{product.discountedPrice || product.originalPrice}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    disabled={!product.inStock}
                    onClick={() =>
                      product.inStock &&
                      handleAddToCart(product._id, hasSizes ? selectedSize : null)
                    }
                    className={`px-5 py-2 rounded-full font-semibold shadow-md transition ${
                      product.inStock
                        ? "bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {product.inStock ? "Add to Cart" : "Unavailable"}
                  </motion.button>

                  {/* View Product Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => router.push(`/viewProduct/${product._id}`)}
                    className="mt-3 px-5 py-2 rounded-full font-semibold shadow-md bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 transition"
                  >
                    View Product
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
      <DebugUser />
    </div>
  );
}
