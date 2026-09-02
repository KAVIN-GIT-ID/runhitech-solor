import { useEffect, useState } from "react";

function useCountUp(target: number, duration: number = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export default function Hero() {
  const mw = useCountUp(10, 1600);

  return (
    <section id="top" className="relative overflow-hidden bg-night pt-32 pb-24 lg:pt-44 lg:pb-32">
      {/* ambient sunrise glow — signature element */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1/3 h-[70%] overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[140%] aspect-square rounded-full bg-[radial-gradient(circle_at_center,_rgba(242,169,59,0.28)_0%,_rgba(242,169,59,0.08)_35%,_transparent_65%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,32,0)_0%,rgba(10,18,32,0.4)_60%,rgba(10,18,32,1)_100%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-gold/90 bg-gold/10 border border-gold/25 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Solar Installations · Namakkal, Tamil&nbsp;Nadu
          </p>

          <h1 className="font-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-mist tracking-tight">
            Stop paying big EB bills.<br />
            <span className="text-gold">Power your home with free solar energy.</span>
          </h1>

          <p className="mt-6 text-lg text-mist/60 max-w-xl leading-relaxed">
            From home rooftops to petrol bunks and factories, we install reliable solar systems across Namakkal, Karur, Salem, Erode, Tirupur and Coimbatore. We handle all government subsidy and TNEB net-metering paperwork for you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#quote"
              className="rounded-full bg-gold text-night font-semibold px-7 py-3.5 hover:bg-gold-deep transition-colors"
            >
              Get Free Roof Survey
            </a>
            <a
              href="#services"
              className="rounded-full border border-white/15 text-mist font-medium px-7 py-3.5 hover:border-gold/50 hover:text-gold transition-colors"
            >
              View Solar Services
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 max-w-lg gap-6 border-t border-white/10 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-mist/40">Petrol bunks solarized</dt>
              <dd className="font-display text-2xl text-mist mt-1">350+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-mist/40">Subsidy homes</dt>
              <dd className="font-display text-2xl text-mist mt-1">200+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-mist/40">Industrial capacity</dt>
              <dd className="font-display text-2xl text-mist mt-1">{mw}+ MW</dd>
            </div>
          </dl>
        </div>

        {/* Signature: live "yield ring" — a sun-path arc reading like a generation meter */}
        <div className="relative mx-auto w-full max-w-sm aspect-square">
          <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90">
            <circle cx="160" cy="160" r="132" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
            <circle
              cx="160" cy="160" r="132" fill="none"
              stroke="url(#arcGradient)" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 132}
              strokeDashoffset={2 * Math.PI * 132 * 0.22}
            />
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2A93B" />
                <stop offset="100%" stopColor="#2FB7A6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase tracking-widest text-mist/40">System Efficiency</span>
            <span className="font-display text-5xl text-mist mt-2">78%</span>
            <span className="text-sm text-gold mt-2">avg. bill reduction*</span>
            <span className="text-[11px] text-mist/30 mt-1 max-w-[14rem]">*typical residential on-grid installation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
