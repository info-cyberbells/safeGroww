"use client"

import { motion, Variants } from "framer-motion";

const brokers = [
  {
    id: "fyers",
    name: "Fyers",
    logo: (
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#E8400C" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="19" fontWeight="800" fontFamily="Inter, sans-serif">F</text>
      </svg>
    ),
  },
  {
    id: "5paisa",
    name: "5paisa",
    logo: (
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#0052CC" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif">5P</text>
      </svg>
    ),
  },
  // {
  //   id: "zerodha",
  //   name: "Zerodha",
  //   logo: (
  //     <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
  //       <rect width="40" height="40" rx="8" fill="#387ED1" />
  //       <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="19" fontWeight="800" fontFamily="Inter, sans-serif">Z</text>
  //     </svg>
  //   ),
  // },
  {
    id: "google",
    name: "Google",
    logo: (
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path d="M43.611 20.083H42V20H24v8h11.303C33.653 32.773 29.28 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
        <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
        <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
        <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.902 37.49 44 31.134 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
      </svg>
    ),
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-surface-container-low)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Subtle top glow using primary color */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-outline-variant)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* Brand header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="flex flex-col items-center mb-8"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: "var(--color-primary)",
                boxShadow:
                  "0 3px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M9 5L12.5 7V11L9 13L5.5 11V7L9 5Z"
                  fill="white"
                  fillOpacity="0.55"
                />
              </svg>
            </div>

            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-on-surface)" }}
            >
              SafeGrow
            </h1>
            <p
              className="text-sm mt-1 text-center"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Sign in to your trading dashboard
            </p>
          </motion.div>

          {/* Divider label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="flex items-center gap-3 mb-4"
          >
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-outline-variant)" }}
            />
            <span
              className="text-xs font-medium tracking-widest uppercase whitespace-nowrap"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Continue with
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-outline-variant)" }}
            />
          </motion.div>

          {/* Login buttons */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2.5"
          >
            {brokers.map((broker) => (
              <motion.button
                key={broker.id}
                variants={fadeUp}
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.988 }}
                onClick={() => console.log(`Login with ${broker.name}`)}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left group"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  border: "1px solid var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  transition: "background-color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.backgroundColor = "var(--color-primary-container)";
                  el.style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.backgroundColor = "var(--color-surface-container)";
                  el.style.borderColor = "var(--color-outline-variant)";
                }}
              >
                {/* Logo container */}
                <div
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  {broker.logo}
                </div>

                <span className="flex-1 text-sm font-medium">
                  Continue with {broker.name}
                </span>

                {/* Arrow */}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    color: "var(--color-on-surface-variant)",
                    opacity: 0.35,
                    transition: "opacity 0.15s, transform 0.15s",
                  }}
                  className="group-hover:opacity-70 group-hover:translate-x-0.5"
                >
                  <path
                    d="M5 3l6 5-6 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            ))}
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-xs text-center mt-6 leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            By continuing, you agree to our{" "}
            <button
              className="font-medium"
              style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}
            >
              Terms
            </button>{" "}
            &{" "}
            <button
              className="font-medium"
              style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}
            >
              Privacy Policy
            </button>
          </motion.p>
        </div>

        {/* Sign up footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-center text-sm mt-5"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          New to SafeGrow?{" "}
          <button
            className="font-semibold"
            style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}
          >
            Create account
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}