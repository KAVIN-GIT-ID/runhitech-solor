const REVIEWS = [
  {
    quote: "We solarized our fuel station with Run Hi Tech Solar. With our 24/7 power requirements, our electricity bills dropped by nearly 65% from the first month. ROI is excellent, and their installation quality is top-notch.",
    name: "M. Kathirvel",
    role: "HPCL Petrol Bunk Owner, Namakkal",
  },
  {
    quote: "Switching to home rooftop solar was very smooth. The Run Hi Tech team handled all the PM Surya Ghar subsidy paperwork and net-metering approvals. Highly recommend them for a hassle-free residential setup.",
    name: "Rajesh Kumar",
    role: "Homeowner, Karur",
  },
  {
    quote: "We commissioned a 150 kW system for our spinning mill. The engineering design, safety protocols during installation, and after-sales maintenance response have been exceptional. Savings are substantial.",
    name: "S. Srinivasan",
    role: "Spinning Mill Director, Salem",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-mist py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-deep">Testimonials</p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-ink tracking-tight max-w-xl">
          Trusted by over 550+ homes, petrol bunks, and industries.
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="bg-paper rounded-2xl border border-ink/10 p-7 hover:shadow-md transition-shadow">
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-gold/50">
                <path d="M0 20V9.5C0 4.3 3.7 0.5 9.4 0L10 3.4C6.9 4 5 6 5 9h5v11H0Zm15 0V9.5C15 4.3 18.7.5 24.4 0L25 3.4c-3.1.6-5 2.6-5 5.6h5v11H15Z" fill="currentColor"/>
              </svg>
              <blockquote className="mt-4 text-sm text-slate leading-relaxed italic">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-ink">{r.name}</span>
                <span className="text-slate"> · {r.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

