"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";  
import Header from "./components/Header";
import Footer from "./components/Footer";
import FirebaseAuthSync from "@/firebaseAuthSync/firebaseAuthSync";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-100 min-h-screen flex flex-col items-center justify-between font-sans">
      
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse sm:flex-row items-center justify-center px-8 gap-12">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center sm:text-left"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900">
            Shop with <span className="text-pink-600">Hope</span>,  
            Wear with <span className="text-pink-700">Love</span>.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Discover our handpicked, affordable, and aesthetic collection.  
            At HOPESTORE, every piece tells a story of creativity and love.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/shop" 
                className="px-6 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-md hover:bg-pink-700 transition"
              >
                Shop Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/about" 
                className="px-6 py-3 rounded-full border border-pink-600 text-pink-600 font-semibold hover:bg-pink-50 transition"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]"
        >
          <Image
            src="/hopestore.jpg"
            alt="Hopestore Hero"
            fill
            className="object-cover rounded-2xl shadow-xl"
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">Why Choose HOPESTORE?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[ 
            { title: "Affordable", desc: "Premium quality without breaking the bank." },
            { title: "Aesthetic", desc: "Beautiful, unique designs for every mood." },
            { title: "Sustainable", desc: "Made with love and care for our planet." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white cursor-default p-8 rounded-2xl shadow-md border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-pink-700">{feature.title}</h3>
              <p className="text-gray-600 mt-3">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
      <FirebaseAuthSync />
    </div>
  );
}
