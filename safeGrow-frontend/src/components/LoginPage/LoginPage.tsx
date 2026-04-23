"use client"
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useLazyGetBrokerLoginUrlQuery } from "@/src/features/auth/authApi";
import { setBroker, setRedirecting, setAuthError, resetAuth } from "@/src/features/auth/authSlice";
import type { BrokerType } from "@/src/features/auth/authTypes";

const brokers = [
  {
    id: "fyers" as BrokerType,
    name: "Fyers",
    logo: (
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#E8400C" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="19" fontWeight="800" fontFamily="Inter, sans-serif">F</text>
      </svg>
    ),
  },
  {
    id: "5paisa" as BrokerType,
    name: "5paisa",
    logo: (
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#0052CC" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif">5P</text>
      </svg>
    ),
  },
  {
    id: "google" as BrokerType,
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

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const popupRef = useRef<Window | null>(null);

  const { selectedBroker, isRedirecting, error } = useAppSelector(
    (state) => state.auth
  );

  const [trigger] = useLazyGetBrokerLoginUrlQuery();

  // Reset Redux state on mount so page is always fresh
  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  // Opens a centered popup for broker login
  // Listens for AUTH_SUCCESS message from /auth/callback
  // If user closes popup manually → resets loading state
  const openBrokerPopup = (url: string) => {
    const w = 600, h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const popup = window.open(
      url,
      "broker_login",
      `width=${w},height=${h},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      dispatch(setAuthError("Popup blocked! Please allow popups for this site."));
      dispatch(resetAuth());
      return;
    }

    popupRef.current = popup;

    // Listen for success signal from /auth/callback page
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "AUTH_SUCCESS") {
        cleanup();
        router.push("/dashboard");
      }
    };

    // Detect if user manually closes popup → reset state
    const pollClosed = setInterval(() => {
      if (popup.closed) {
        cleanup();
        dispatch(resetAuth());
      }
    }, 500);

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(pollClosed);
      popupRef.current = null;
    };

    window.addEventListener("message", handleMessage);
  };

  const handleBrokerLogin = async (broker: BrokerType) => {
    try {
      dispatch(setBroker(broker));
      dispatch(setRedirecting(true));

      const result = await trigger(broker).unwrap();

      if (result.success && result.url) {
        openBrokerPopup(result.url);
      } else {
        dispatch(setAuthError("Login URL not returned from server."));
      }
    } catch (err) {
      dispatch(setAuthError("Failed to connect. Please try again."));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-surface-container-low)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Background glow */}
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
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-outline-variant)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* Brand */}
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
                <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M9 5L12.5 7V11L9 13L5.5 11V7L9 5Z" fill="white" fillOpacity="0.55" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--color-on-surface)" }}>
              SafeGrow
            </h1>
            <p className="text-sm mt-1 text-center" style={{ color: "var(--color-on-surface-variant)" }}>
              Sign in to your trading dashboard
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
            <span className="text-xs font-medium tracking-widest uppercase whitespace-nowrap"
              style={{ color: "var(--color-on-surface-variant)" }}>
              Continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-outline-variant)" }} />
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2.5 rounded-lg text-sm"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-error-dim) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-error-dim) 30%, transparent)",
                color: "var(--color-error-dim)",
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Broker buttons */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-2.5">
            {brokers.map((broker) => {
              const isThisLoading = isRedirecting && selectedBroker === broker.id;

              return (
                <motion.button
                  key={broker.id}
                  variants={fadeUp}
                  whileHover={!isRedirecting ? { scale: 1.012 } : {}}
                  whileTap={!isRedirecting ? { scale: 0.988 } : {}}
                  onClick={() => !isRedirecting && handleBrokerLogin(broker.id)}
                  disabled={isRedirecting}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left group"
                  style={{
                    backgroundColor: isThisLoading
                      ? "var(--color-primary-container)"
                      : "var(--color-surface-container)",
                    border: `1px solid ${isThisLoading ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                    color: "var(--color-on-surface)",
                    fontFamily: "var(--font-sans)",
                    cursor: isRedirecting ? "not-allowed" : "pointer",
                    opacity: isRedirecting && !isThisLoading ? 0.5 : 1,
                    transition: "background-color 0.15s, border-color 0.15s, opacity 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (isRedirecting) return;
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = "var(--color-primary-container)";
                    el.style.borderColor = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (isThisLoading) return;
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = "var(--color-surface-container)";
                    el.style.borderColor = "var(--color-outline-variant)";
                  }}
                >
                  {/* Logo */}
                  <div
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    {broker.logo}
                  </div>

                  <span className="flex-1 text-sm font-medium">
                    Continue with {broker.name}
                  </span>

                  {/* Spinner or arrow */}
                  {isThisLoading ? (
                    <svg
                      className="animate-spin"
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg
                      width="13" height="13" viewBox="0 0 16 16" fill="none"
                      style={{ color: "var(--color-on-surface-variant)", opacity: 0.35 }}
                      className="group-hover:opacity-70 group-hover:translate-x-0.5 transition-all duration-150"
                    >
                      <path d="M5 3l6 5-6 5" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.button>
              );
            })}
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
            <button className="font-medium" style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
              Terms
            </button>{" "}
            &{" "}
            <button className="font-medium" style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
              Privacy Policy
            </button>
          </motion.p>
        </div>

        {/* Sign up */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-center text-sm mt-5"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          New to SafeGrow?{" "}
          <button className="font-semibold" style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
            Create account
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}