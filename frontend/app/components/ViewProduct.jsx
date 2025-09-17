"use client";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewProduct = ({ product }) => {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push(`/product/${product._id}`)}
      className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-md 
        bg-white border border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50 transition"
    >
      <Eye size={18} />
      View Product
    </motion.button>
  );
};

export default ViewProduct;
