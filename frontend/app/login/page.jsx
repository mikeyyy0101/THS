"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/slices/authSlice.js";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";

export default function Login() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const simplifiedUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      dispatch(setCurrentUser(simplifiedUser));
      localStorage.setItem("user", JSON.stringify(simplifiedUser));

      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const continueAsGuest = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-pink-100">
        {/* Illustration */}
        <div className="bg-gradient-to-br from-pink-100 to-rose-50 w-full md:w-1/2 flex items-center justify-center p-6">
          <img
            src="hopestore.jpg"
            alt="Hopestore"
            className="w-2/3 md:w-1/2 h-auto object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-pink-700 font-sans">
            Welcome to HOPESTORE
          </h2>
          <p className="text-pink-500 mt-3 mb-6 max-w-[320px] md:max-w-md">
            Sign in to save your cart, wishlist, and access exclusive deals.
          </p>

          {/* Google Login */}
          <button
            onClick={loginWithGoogle}
            className="flex items-center text-black justify-center gap-3 w-full py-3 cursor-pointer px-6 border border-pink-200 rounded-2xl text-sm font-semibold hover:bg-pink-50 transition duration-200"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6 w-full max-w-[280px] md:max-w-md">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-200" />
            </div>
            <div className="relative bg-white px-3 text-pink-300 text-sm font-light">
              or
            </div>
          </div>

          {/* Guest Login */}
          <button
            onClick={continueAsGuest}
            className="w-full max-w-[280px] md:max-w-md flex items-center justify-center gap-2 px-6 py-3 mt-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue as Guest <FaArrowRight />
          </button>

          <p className="text-xs text-pink-300 mt-6">
            Need help?{" "}
            <a href="mailto:support@hopestore.com" className="underline">
              support@hopestore.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
