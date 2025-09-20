"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/HeaderShop";
import { useSelector } from "react-redux";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state) => state.auth.currentUser);
  // if not logged in, you can show guest cart or ask to login
  const userId = currentUser?.uid || null;

  useEffect(() => {
    if (!userId) {
      setCart([]);
      setLoading(false);
      return;
    }

    async function fetchCart() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/cart/${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json(); // array of { productId, size, quantity, product }
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Cannot fetch cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [userId]);

  const handleRemove = async (productId, size) => {
    if (!userId) return toast.error("Please login to manage cart");
    try {
      const res = await fetch(`${API_BASE}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, size }),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      const updatedItems = await res.json();
      setCart(updatedItems);
      toast.success("Item removed from cart", { autoClose: 1500 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-pink-100">
        <Header />
        <div className="flex flex-1 justify-center items-center">
          <p className="text-lg text-gray-600 animate-pulse">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-pink-100">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          🛒 Your Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item, i) => {
              const product = item.product;
              if (!product) return null;

              // Price logic same as before
              const priceToShow =
                product.category?.toLowerCase() === "hoodie"
                  ? (product.sizes?.find((s) => s.size === item.size)?.discountedPrice ?? product.discountedPrice ?? product.originalPrice)
                  : (product.discountedPrice ?? product.originalPrice ?? product.price);

              return (
                <li
                  key={i}
                  className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={product.imageUrl?.startsWith("http") ? product.imageUrl : `/${product.imageUrl}`}
                        alt={product.title || "Product"}
                        fill
                        className="object-cover rounded-md border"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">{product.title}</p>
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      )}
                      <p className="text-pink-600 font-bold">₹{priceToShow}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(String(item.productId), item.size)}
                    className="px-4 py-2 rounded-lg font-semibold shadow-md bg-red-500 text-white cursor-pointer hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <ToastContainer />
    </div>
  );
}
