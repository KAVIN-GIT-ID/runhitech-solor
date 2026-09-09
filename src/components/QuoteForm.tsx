import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { triggerLeadNotification } from "../services/notificationService";

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    type: "Residential Rooftop (PM Surya Ghar Subsidy)",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [phoneError, setPhoneError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let val = e.target.value;
    if (k === "name") {
      val = val.replace(/[^a-zA-Z\s.-]/g, "");
    } else if (k === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
      if (val.length > 0 && val.length < 10) {
        setPhoneError("Mobile number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = form.name.trim();
    const cleanPhone = form.phone.replace(/\D/g, "");

    if (!cleanName) {
      return;
    }

    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!form.location) {
      return;
    }

    setPhoneError("");
    setStatus("loading");
    try {
      // Trigger instant push notification to Admin device / app with audio & vibration
      await triggerLeadNotification({
        name: cleanName,
        phone: cleanPhone,
        category: form.type.includes("Commercial") ? "commercial" : form.type.includes("Industrial") ? "bulk" : "residential",
        location: form.location,
        roofOrLandType: form.type
      });

      await new Promise((r) => setTimeout(r, 400));
      setStatus("success");
      setShowPopup(true);
      setForm({
        name: "",
        phone: "",
        location: "",
        type: "Residential Rooftop (PM Surya Ghar Subsidy)",
      });
      setTimeout(() => setStatus("idle"), 8000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Request a Free Site Survey
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Zero obligation shadow analysis and direct PM Surya Ghar subsidy estimate
        </p>
      </div>

      <div className="space-y-3.5 pt-1">
        {/* Full Name */}
        <div>
          <input
            required
            type="text"
            inputMode="text"
            pattern="[a-zA-Z\s.-]+"
            title="Please enter only letters (no numbers allowed)"
            value={form.name}
            onChange={update("name")}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors duration-150"
            placeholder="Full Name *"
            aria-label="Full Name"
          />
        </div>

        {/* Phone & Location */}
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div>
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              title="Please enter a 10-digit mobile number (no letters allowed)"
              value={form.phone}
              onChange={update("phone")}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors duration-150"
              placeholder="10-Digit Mobile Number *"
              aria-label="Phone Number"
            />
            {phoneError && (
              <p className="text-[11px] text-red-500 font-semibold mt-1">
                ⚠ {phoneError}
              </p>
            )}
          </div>
          <div>
            <select
              required
              value={form.location}
              onChange={update("location")}
              aria-label="City or District"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors duration-150 cursor-pointer"
            >
              <option value="" disabled>Select City / District *</option>
              <option value="Namakkal">Namakkal</option>
              <option value="Karur">Karur</option>
              <option value="Salem">Salem</option>
              <option value="Erode">Erode</option>
              <option value="Tirupur">Tirupur</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
              <option value="Dindigul">Dindigul</option>
              <option value="Madurai">Madurai</option>
              <option value="Dharmapuri">Dharmapuri</option>
              <option value="Krishnagiri">Krishnagiri</option>
              <option value="Other District">Other District (Tamil Nadu)</option>
            </select>
          </div>
        </div>

        {/* System Requirement */}
        <div>
          <select
            value={form.type}
            onChange={update("type")}
            aria-label="System Requirement"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
          >
            <option value="" disabled>Select System Requirement</option>
            <option>Residential Rooftop (PM Surya Ghar Subsidy)</option>
            <option>Commercial Petrol Bunk (HPCL / Retail Solar)</option>
            <option>Industrial Solar (MW Plants & Factories)</option>
            <option>Hybrid Solar & LiFePO4 Battery Backup</option>
          </select>
        </div>
      </div>



      {/* Status Messages */}
      {status === "success" && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you! Your site survey request has been received. Our engineer will call you shortly.</span>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 p-4 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <span>Failed to submit request. Please call us directly at +91 90805 57472.</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 text-sm tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
      >
        {status === "loading"
          ? "Submitting Request…"
          : status === "success"
          ? "Requested ✓"
          : "Request Free Site Survey →"}
      </button>

      <p className="text-center text-xs text-slate-400">
        Prefer calling directly?{" "}
        <a href="tel:+919080557472" className="text-blue-600 font-bold hover:underline font-mono">
          +91 90805 57472
        </a>
      </p>

      {/* ── Interactive Pop-Up Message for Confirmation ── */}
      {showPopup && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-emerald-100 text-center relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Success! Request Logged
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Our engineering liaison will call you shortly to plan the survey.
            </p>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                OK, Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </form>
  );
}
