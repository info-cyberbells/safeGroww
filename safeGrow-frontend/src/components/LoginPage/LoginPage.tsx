"use client"

import React, { useState, ChangeEvent, FormEvent  } from "react";
import { motion } from "framer-motion";

export default function Login() {
  // Explicitly typing state variables
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    console.log("Login Attempt:", {
      email: email,
      password: password
    });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
      {/* Background geometric accents using standard Tailwind colors for reliability */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full border border-blue-100" />
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full border border-blue-50" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full border border-blue-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center items-center gap-2.5 mb-10"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M9 5L12.5 7V11L9 13L5.5 11V7L9 5Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight">SafeGrow</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl text-center font-bold text-gray-900 tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-gray-500 text-center text-sm">
              Sign in to your trading dashboard
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Email
              </label>
              <div className="relative flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <div className="pl-3.5 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1.5 5.5L8 9L14.5 5.5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium focus:outline-none">
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <div className="pl-3.5 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg transition-all duration-200 text-sm uppercase tracking-widest shadow-md shadow-blue-200 mt-2 focus:ring-4 focus:ring-blue-100"
            >
              Login
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Don't have an account?{" "}
          <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors focus:outline-none">
            Sign up free
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}