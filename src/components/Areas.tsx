const AREAS = ["Namakkal", "Karur", "Salem", "Erode", "Tirupur", "Coimbatore"];

export default function Areas() {
  return (
    <section id="areas" className="bg-paper py-20 lg:py-24 border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-deep">Where we operate</p>
        <h2 className="font-display mt-3 text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
          Active across six districts in Tamil Nadu.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-mist px-5 py-2.5 text-sm font-medium text-ink"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
