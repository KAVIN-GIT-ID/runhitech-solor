export default function Subsidy() {
  return (
    <section id="subsidy" className="relative bg-night py-24 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold/80">PM Surya Ghar Yojana</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-mist tracking-tight max-w-2xl">
            Get up to <span className="text-gold">₹78,000 subsidy</span> for your home solar installation in Tamil&nbsp;Nadu.
          </h2>
          <p className="mt-4 text-mist/60 max-w-xl">
            We handle the application, net-metering approval and documentation —
            you just switch on. 200+ homes already installed under the scheme.
          </p>
        </div>
        <a
          href="#quote"
          className="shrink-0 rounded-full bg-gold text-night font-semibold px-8 py-4 text-center hover:bg-gold-deep transition-colors"
        >
          Check My Subsidy Eligibility
        </a>
      </div>
    </section>
  );
}
