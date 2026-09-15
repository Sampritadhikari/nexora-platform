"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  text?: string;
  onError?: (err: string) => void;
  className?: string;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "339236844287-0u7qfmi6q1j0psr1f866d7bnrek49js2.apps.googleusercontent.com";

export function GoogleSignInButton({
  text = "Continue with Google",
  onError,
  className = "",
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hiddenBtnRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      if (onError) onError("Google authentication failed. No credential returned.");
      return;
    }

    try {
      setLoading(true);
      await loginWithGoogle(response.credential);
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Failed to log in with Google. Please try again.";
      if (onError) onError(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const initGsi = () => {
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render hidden official button so we can programmatically click or fall back safely
          if (hiddenBtnRef.current) {
            hiddenBtnRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(hiddenBtnRef.current, {
              theme: "outline",
              size: "large",
              width: 380,
              type: "standard",
            });
          }
        } catch (e) {
          console.warn("Failed to initialize Google Identity Services:", e);
        }
      }
    };

    // Check if script already loaded, otherwise poll briefly
    if (typeof window !== "undefined") {
      if (window.google?.accounts?.id) {
        initGsi();
      } else {
        checkInterval = setInterval(() => {
          if (window.google?.accounts?.id) {
            initGsi();
            clearInterval(checkInterval);
          }
        }, 300);
      }
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  const handleClick = () => {
    if (loading) return;

    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      // If hidden native button was rendered, clicking it opens the standard Google popup
      const nativeButton = hiddenBtnRef.current?.querySelector('div[role="button"]') as HTMLElement;
      if (nativeButton) {
        nativeButton.click();
      } else {
        window.google.accounts.id.prompt();
      }
    } else {
      if (onError) onError("Google services are loading. Please try again in a moment.");
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Hidden container for official GIS element to ensure standard popup mechanics */}
      <div
        ref={hiddenBtnRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-0 pointer-events-none overflow-hidden"
      />

      {/* Luxury Styled Nexora Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.99] transition-all duration-200 backdrop-blur-md disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
        ) : (
          <svg className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110 duration-200" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{loading ? "Authenticating with Google..." : text}</span>
      </button>
    </div>
  );
}
