import QuoteForm from "./QuoteForm";
import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Page Header */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Get in touch with our team for a free site visit, quotation, or visit our office in Paramathi Velur, Namakkal.
          </p>
        </div>

        {/* Two-Column 2020s SaaS/Corporate Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── Left Column (5 cols): Direct Contact Channels & Headquarters ── */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Call Us</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <a href="tel:+919080557472" className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      +91 90805 57472
                    </a>
                    <span className="hidden sm:inline text-slate-300">/</span>
                    <a href="tel:+919688830274" className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      +91 96888 30274
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Email Us</span>
                  <a href="mailto:info@runhitechsolar.com" className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors block mt-1">
                    info@runhitechsolar.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Send us your requirements or queries anytime</p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Office Address</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                    RS Block 1st Floor, Jedarpalayam Main Road, Paramathi Velur, Namakkal District, Tamil Nadu – 638181
                  </p>
                  <a
                    href="https://maps.app.goo.gl/QUT6naDzq9AMAvvf6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-2.5 transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Office Timings</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    Monday – Saturday: 9:00 AM – 6:30 PM
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Sunday: Closed (Site visits on appointment)</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column (7 cols): Free Site Survey Request Form ── */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12">
            <QuoteForm />
          </div>

        </div>

        {/* ── Full-Width Office Location & Map Card ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Our Location
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Visit Our Office in Paramathi Velur, Namakkal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                RS Block 1st Floor, Jedarpalayam Main Road, Paramathi Velur, Namakkal District, Tamil Nadu – 638181
              </p>
            </div>
            
            <a
              href="https://maps.app.goo.gl/QUT6naDzq9AMAvvf6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 active:scale-98"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions ↗</span>
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
