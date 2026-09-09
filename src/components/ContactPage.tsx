import QuoteForm from "./QuoteForm";
import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-100/70 text-slate-900 min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      
      <div className="max-w-6xl mx-auto w-full space-y-10 sm:space-y-12">
        
        {/* Unified Modern Dual-Panel Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-12 min-h-[640px]">
          
          {/* ── Top on Mobile / Right on Desktop: Free Survey Request Form ── */}
          <div className="order-1 lg:order-2 lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
            <QuoteForm />
          </div>

          {/* ── Bottom on Mobile / Left on Desktop: Brand & Contact Info (Deep Blue Gradient) ── */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            
            {/* Ambient solar decorative blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                  Let's Power Your Property with Solar
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                  Run Hi Tech Solar has commissioned 550+ rooftop solar systems in Namakkal, Salem, Karur, and Coimbatore since 2019.
                </p>
              </div>

              {/* Contact Channels List */}
              <div className="space-y-4 pt-2">
                
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Direct Helpline</span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm font-bold text-white font-mono whitespace-nowrap">
                      <a href="tel:+919080557472" className="hover:text-amber-400 transition-colors">
                        +919080557472
                      </a>
                      <span className="text-slate-500">/</span>
                      <a href="tel:+919688830274" className="hover:text-amber-400 transition-colors">
                        +919688830274
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Official Email</span>
                    <a href="mailto:info@runhitechsolar.com" className="text-sm font-bold text-white hover:text-amber-400 transition-colors block mt-0.5">
                      info@runhitechsolar.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Regional Office</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      RS Block 1st Floor, Jedarpalayam Main Road, P. Velur, Namakkal (DT) - 638181
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Working Hours</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Mon – Sat: 9:00 AM – 6:30 PM
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ── Interactive Google Map Section ── */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                OFFICE LOCATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Visit Run Hi Tech Solar in P. Velur, Namakkal
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                RS Block 1st Floor, Jedarpalayam Main Road, Paramathi Velur, Namakkal District, Tamil Nadu – 638181
              </p>
            </div>
            
            <a
              href="https://maps.app.goo.gl/QUT6naDzq9AMAvvf6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              Get Directions ↗
            </a>
          </div>

          {/* Map Frame */}
          <div className="rounded-2xl overflow-hidden h-[340px] sm:h-[420px] w-full border border-slate-200 bg-slate-100 shadow-inner relative">
            <iframe
              title="Run Hi Tech Solar Office Location in Namakkal"
              src="https://maps.google.com/maps?q=RUN+HI+TECH+SOLAR,+Jedarpalayam+Main+Road,+Paramathi+Velur&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
