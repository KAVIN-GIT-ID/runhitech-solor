const REVIEWS = [
  {
    quote: "Run Hi Tech Solar made the PM Surya Ghar subsidy process completely effortless. My monthly EB bills have dropped drastically!",
    name: "Tom Anders",
    role: "Homeowner",
  },
  {
    quote: "On-time execution and highly professional. Switching to solar was the best investment I've made this year.",
    name: "David Martinez",
    role: "Investor",
  },
  {
    quote: "Great team and flawless installation. We haven't worried about a power cut since they installed our system.",
    name: "Molly Brown & Bobby Fischer",
    role: "Clients",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-mist py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-deep">Testimonials</p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-ink tracking-tight max-w-xl">
          Don't Just Take Our Word For It
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

