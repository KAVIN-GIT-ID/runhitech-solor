import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { handleGoogleLogin, getCurrentUser, GOOGLE_CLIENT_ID } from "../services/authService";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (activeUser) {
      if (activeUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  useEffect(() => {
    /* global google */
    const initBtn = () => {
      if ((window as unknown as { google?: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google) {
        const googleApi = (window as unknown as { google: { accounts: { id: { initialize: (cfg: unknown) => void; renderButton: (el: HTMLElement | null, opt: unknown) => void } } } }).google;
        
        googleApi.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            const res = await handleGoogleLogin(response.credential);
            if (res.success && res.user) {
              if (res.user.role === "admin") {
                navigate("/admin");
              } else {
                navigate("/dashboard");
              }
            } else {
              setErrorMessage(res.error || "Sign in failed. Please try again.");
            }
          }
        });

        const btnContainer = document.getElementById("googlePageBtn");
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
        initBtn();
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initBtn;
        document.body.appendChild(script);
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft Apple iOS background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-[120px] pointer-events-none" />

      {/* iOS White Frosted Glass Card */}
      <div 
        className="max-w-sm w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 relative z-10 text-center space-y-5"
        style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8) inset" }}
      >
        
        {/* Brand Product Logo */}
        <div className="flex justify-center pb-1">
          <img
            src="/logo.png"
            alt="Run Hi Tech Solar"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h1>
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

        {/* Single Clean Google Sign-In Button */}
        <div className="pt-2 flex justify-center min-h-[46px]">
          <div id="googlePageBtn" />
        </div>

        {/* Subtle Security Badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Google OAuth • Run Hi Tech Solar</span>
        </div>

        {/* Return to Home */}
        <div className="pt-1">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
