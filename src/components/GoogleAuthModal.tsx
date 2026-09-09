import { useEffect, useState } from "react";
import { X, ShieldCheck, AlertCircle } from "lucide-react";
import { handleGoogleLogin, GOOGLE_CLIENT_ID } from "../services/authService";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock body scroll & hide all floating widgets when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("auth-modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("auth-modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("auth-modal-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      return;
    }

    /* global google */
    const initGoogleBtn = () => {
      if ((window as unknown as { google?: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google) {
        const googleApi = (window as unknown as { google: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google;
        
        googleApi.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            try {
              const res = await handleGoogleLogin(response.credential);
              if (res.success && res.user) {
                // Immediately close modal and unblock scroll (stay on current page / dashboard)
                onClose();
                document.body.classList.remove("auth-modal-open");
                document.body.style.overflow = "";
                
                if (onSuccess) onSuccess();
              } else {
                setErrorMessage(res.error || "Sign in failed. Please try again.");
              }
            } catch (e: any) {
              console.error("Sign-in error:", e);
              setErrorMessage("Could not complete sign in. Please try again.");
            }
          }
        });

        const btnContainer = document.getElementById("googleModalBtn");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          googleApi.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 280
          });
        }
      }
    };

    if (typeof window !== "undefined") {
      if ((window as unknown as { google?: unknown }).google) {
        initGoogleBtn();
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogleBtn;
        document.body.appendChild(script);
      }
    }
  }, [isOpen, onClose, onSuccess]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-3xl rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-white/90 relative overflow-hidden animate-in zoom-in-95 duration-200 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 30px 90px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.9) inset" }}
      >
        {/* iOS Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Brand Logo */}
        <div className="flex justify-center pb-1">
          <img
            src="/logo.png"
            alt="Run Hi Tech Solar"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Please sign in to chat directly with our solar engineers, get priority support, and track your PM Surya Ghar subsidy.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Official Button */}
        <div className="pt-2 flex justify-center min-h-[46px]">
          <div id="googleModalBtn" />
        </div>

        {/* Subtle Security Badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Google OAuth • Run Hi Tech Solar</span>
        </div>

      </div>
    </div>
  );
}
