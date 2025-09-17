"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { currentUser, setCurrentUser } = useAuth();

  const toggleDropdown = () => setUserDropdown(!userDropdown);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem("user");
      setUserDropdown(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getInitial = (user) => {
    if (!user) return "";
    if (user.name) return user.name.charAt(0).toUpperCase();
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full flex justify-between items-center px-8 py-6 relative bg-white shadow-sm z-50">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <Link href="/">
          <Image
            className="rounded-full"
            src="/hopestore.jpg"
            alt="HOPESTORE Logo"
            width={50}
            height={50}
          />
        </Link>
        <span className="text-2xl font-extrabold text-pink-700">HOPESTORE</span>
      </motion.div>

      {/* Desktop Nav */}
      <nav className="hidden sm:flex gap-6 text-gray-700 font-medium items-center">
        <Link href="/#features" className="hover:text-pink-600 transition">
          Features
        </Link>
        <Link href="/products" className="hover:text-pink-600 transition">
          Products
        </Link>
        <Link href="/about" className="hover:text-pink-600 transition">
          About
        </Link>
        <Link href="/cart" className="hover:text-pink-600 transition flex items-center gap-1">
          <ShoppingCart size={20} /> Cart
        </Link>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/50 text-white font-bold cursor-pointer hover:bg-red-600 transition"
            >
              {getInitial(currentUser)}
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-rose-900/50 text-white rounded cursor-pointer"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="sm:hidden text-gray-700 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-6 gap-4 text-gray-700 font-medium sm:hidden z-50"
        >
          <Link
            href="/#features"
            className="hover:text-pink-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/products"
            className="hover:text-pink-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/about"
            className="hover:text-pink-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/cart"
            className="hover:text-pink-600 transition flex items-center gap-1"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingCart size={20} /> Cart
          </Link>

          {currentUser ? (
            <div className="flex flex-col items-center mt-4 gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-500/50 text-white flex items-center justify-center font-bold text-lg hover:bg-red-600 transition">
                {getInitial(currentUser)}
              </div>
              <span>{currentUser.name || currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-rose-900/50 text-white rounded cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </motion.nav>
      )}
    </header>
  );
}
