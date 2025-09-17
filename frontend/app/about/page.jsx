"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-100 min-h-screen flex flex-col items-center justify-between font-sans">
      
      {/* Header */}
      <Header />

      {/* About Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16 gap-12 max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
            About <span className="text-pink-600">HOPESTORE</span>
          </h1>
          <p className="text-lg text-gray-600">
            HOPESTORE was born from a simple idea: fashion should be{" "}
            <span className="text-pink-700 font-semibold">affordable</span>,{" "}
            <span className="text-pink-700 font-semibold">aesthetic</span>, and{" "}
            <span className="text-pink-700 font-semibold">sustainable</span>.  
            Every product we create is infused with creativity, care, and a touch of love.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="flex flex-col sm:flex-row items-center gap-12">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="sm:w-1/2 text-gray-700 leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-4">Our Story</h2>
            <p className="mb-4">
              What started as a small passion project soon turned into a community-driven
              brand. HOPESTORE is more than just clothing — it’s about expressing
              yourself, embracing creativity, and choosing designs that reflect your unique personality.
            </p>
            <p>
              We’re committed to delivering quality without compromise, ensuring that
              each piece you wear is not just stylish, but also meaningful. Your support
              fuels our journey to bring hope, love, and creativity into everyday fashion.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
          >
            <Image
              src="/hopestore.jpg"
              alt="Our Story"
              fill
              className="object-cover rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <section className="py-12 text-center w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { title: "Creativity", desc: "Designs that inspire and tell a story." },
              { title: "Community", desc: "A brand built on love, trust, and togetherness." },
              { title: "Sustainability", desc: "We care for our planet as much as our people." },
            ].map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-pink-700">{value.title}</h3>
                <p className="text-gray-600 mt-3">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
