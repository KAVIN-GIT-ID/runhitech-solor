import { useState } from "react";

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    type: "Residential Rooftop (PM Surya Ghar Subsidy)",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-12 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Thank You, {form.name.split(" ")[0] || "there"}!
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
          We have received your site survey request. Our senior engineer will call you at{" "}
          <span className="font-bold text-slate-900">{form.phone}</span> within 24 hours to schedule the free roof inspection.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              phone: "",
              location: "",
              type: "Residential Rooftop (PM Surya Ghar Subsidy)",
            });
          }}
          className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Request a Free Site Survey
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Zero obligation • Full shadow analysis • Direct PM Surya Ghar subsidy estimate
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            placeholder="e.g. Karthikeyan R"
          />
        </div>

        {/* Phone & Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
              placeholder="98765 43210"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City / District <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.location}
              onChange={update("location")}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              placeholder="e.g. Namakkal, Salem, Karur"
            />
          </div>
        </div>

        {/* System Requirement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            System Requirement
          </label>
          <select
            value={form.type}
            onChange={update("type")}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
          >
            <option>Residential Rooftop (PM Surya Ghar Subsidy)</option>
            <option>Commercial Petrol Bunk (HPCL / Retail Solar)</option>
            <option>Industrial Solar (MW Plants & Factories)</option>
            <option>Hybrid Solar & LiFePO4 Battery Backup</option>
          </select>
        </div>
      </div>

      {/* Trust Guarantees */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>Up to ₹78,000 Govt Subsidy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>30-Year Linear Warranty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>TNEB Net-Metering Handled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>24h Engineer Response</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 text-sm tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
      >
        {status === "loading" ? "Submitting Request…" : "Request Free Site Survey →"}
      </button>

      <p className="text-center text-xs text-slate-400">
        Prefer calling directly?{" "}
        <a href="tel:+919080557472" className="text-blue-600 font-bold hover:underline font-mono">
          +91 90805 57472
        </a>
      </p>
    </form>
  );
}
