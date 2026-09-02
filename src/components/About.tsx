export default function About() {
  const stats = [
    { value: "550+", label: "Total Installations", desc: "Across residential, commercial & industrial sectors" },
    { value: "350+", label: "HPCL Petrol Bunks", desc: "Solarized for uninterrupted 24/7 operations" },
    { value: "200+", label: "Subsidy Homes", desc: "Powered under PM Surya Ghar Muft Bijli Yojana" },
    { value: "10+ MW", label: "Industrial Projects", desc: "Commissioned for spinning mills, factories & warehouses" }
  ];

  const values = [
    {
      title: "End-to-End Service",
      desc: "We handle everything: site survey, custom engineering, procurement, installation, and lifecycle maintenance."
    },
    {
      title: "Subsidy Assistance",
      desc: "Complete support for PM Surya Ghar subsidy application, document submission, and net-metering approvals."
    },
    {
      title: "Premium Components",
      desc: "Tier-1 solar panels and smart inverters ensuring high yield, longevity, and a 30-year performance warranty."
    },
    {
      title: "Local Service Teams",
      desc: "Quick, responsive maintenance support stationed directly in all major Western Tamil Nadu districts."
    }
  ];

  return (
    <section id="about" className="bg-paper py-24 lg:py-32 border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left column: Text content */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-deep">Who We Are</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
              Powering Tamil&nbsp;Nadu's transition to clean energy since 2019.
            </h2>
            <p className="mt-6 text-base text-slate leading-relaxed">
              Based in Velur, Namakkal, Run Hi Tech Solar is one of the fastest-growing solar EPC companies in Tamil Nadu. We specialize in designing and executing solar installations that offer maximum energy efficiency and rapid return on investment.
            </p>
            <p className="mt-4 text-base text-slate leading-relaxed">
              Whether it is a residential rooftop under the national subsidy scheme, a 24/7 petrol station, or a multi-megawatt industrial grid-tie system, our expert engineering team delivers reliable green power.
            </p>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              {values.slice(0, 2).map((v) => (
                <div key={v.title}>
                  <h4 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {v.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Stats grid and remaining values */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {stats.map((s, idx) => (
              <div 
                key={s.label}
                className={`p-8 rounded-2xl border transition-all ${
                  idx === 0 
                    ? "bg-night border-night text-mist sm:col-span-2 shadow-lg shadow-night/10" 
                    : "bg-mist/30 border-ink/5 text-ink hover:bg-mist/50"
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className={`font-display text-4xl sm:text-5xl font-bold ${idx === 0 ? "text-gold" : "text-ink"}`}>
                    {s.value}
                  </span>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-teal bg-teal/10 border border-teal/20 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      Tamil Nadu Leader
                    </span>
                  )}
                </div>
                <h3 className={`font-display mt-3 text-base font-semibold ${idx === 0 ? "text-mist" : "text-ink"}`}>
                  {s.label}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${idx === 0 ? "text-mist/60" : "text-slate"}`}>
                  {s.desc}
                </p>
              </div>
            ))}
            
            <div className="sm:col-span-2 mt-4 grid sm:grid-cols-2 gap-6 border-t border-ink/5 pt-8">
              {values.slice(2).map((v) => (
                <div key={v.title}>
                  <h4 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    {v.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
