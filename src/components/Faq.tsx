import { useState } from "react";

const FAQS = [
  {
    q: "How can I apply for a solar subsidy in Tamil Nadu?",
    a: "You can apply through the central government's PM Surya Ghar Muft Bijli Yojana portal. At Run Hi Tech Solar, we handle the complete subsidy application, document submission, site surveys, and net-metering approvals for you, making the process completely hassle-free."
  },
  {
    q: "What is the benefit of solar for petrol bunks?",
    a: "Petrol bunks consume high volumes of electricity due to 24/7 operations, pumps, lighting, and air conditioners. Solar installations cut power bills by 50% to 70%, offering a rapid return on investment (ROI) within 3 to 4 years. Over 350+ HPCL bunks in Tamil Nadu already trust our solar systems."
  },
  {
    q: "How much subsidy will I get for a residential home solar system?",
    a: "Under the PM Surya Ghar Muft Bijli Yojana, residential subsidies are calculated as follows: ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and a maximum of ₹78,000 for systems 3 kW or larger. Our team helps you determine the ideal size for your household load."
  },
  {
    q: "Do industries get tax or financial benefits for installing solar?",
    a: "Yes. Industries installing solar can claim up to 40% accelerated depreciation in the first year, claim GST input tax credit, and lower their overall carbon footprint. We offer flexible models including Captive ownership, Group Captive options, and PPA (Power Purchase Agreements with zero upfront investment)."
  },
  {
    q: "Why choose Run Hi Tech Solar over other service providers?",
    a: "We have over 5 years of dedicated solar EPC experience (established in 2019) with a portfolio of 550+ successful installations. With local engineering teams across Namakkal, Karur, Salem, Erode, Tirupur, and Coimbatore, we guarantee quick installation, prompt support, and quality components backed by long warranties."
  }
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="bg-slate-50 py-12 sm:py-16 border-t border-slate-200/60 relative z-10">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-neon-cyan">FAQ</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm text-slate">
            Everything you need to know about residential solar subsidies, commercial ROI, and industrial installations in Tamil Nadu.
          </p>
        </div>

        <div className="mt-10 space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 font-display font-semibold text-ink hover:text-neon-cyan transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={`shrink-0 w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-200 ${isOpen ? "rotate-180 bg-neon-cyan border-neon-cyan text-white" : "text-slate"}`}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 1l4 4 4-4" />
                    </svg>
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-5 sm:px-8 sm:py-6 text-sm text-slate leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
