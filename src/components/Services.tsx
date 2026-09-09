import React from "react";

const SERVICES = [
  {
    title: "Residential Rooftop",
    desc: "On-grid rooftop systems sized to your sanctioned load, with PM Surya Ghar subsidy paperwork handled for you.",
    icon: "home",
  },
  {
    title: "Commercial & HPCL Sites",
    desc: "Turnkey solar for petrol bunks, shops and offices — 350+ HPCL outlets solarized across Tamil Nadu.",
    icon: "store",
  },
  {
    title: "Industrial EPC (MW-scale)",
    desc: "Design, procurement and commissioning for industrial plants up to 10+ MW, with O&M support.",
    icon: "factory",
  },
  {
    title: "Battery Storage",
    desc: "Backup-ready hybrid systems that keep critical loads running through grid outages.",
    icon: "battery",
  },
  {
    title: "EV Charging Stations",
    desc: "Solar-fed EV charge points for homes, offices and commercial parking.",
    icon: "bolt",
  },
  {
    title: "Solar Water Heaters",
    desc: "Efficient water heating systems for residential and institutional hot-water needs.",
    icon: "sun",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  ),
  store: (
    <path d="M4 9v10h16V9M2 9l2-5h16l2 5M2 9h20M8 19v-5h8v5" />
  ),
  factory: (
    <path d="M3 21V11l6 4v-4l6 4v-4l6 4v6H3ZM7 21v-4M12 21v-4M17 21v-4" />
  ),
  battery: (
    <path d="M3 9h14v6H3zM17 11h2v2h-2zM7 12h5" />
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  sun: (
    <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  ),
};

export default function Services() {
  return (
    <section id="services" className="bg-paper py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            End-to-end solar, from survey to switch-on.
          </h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 rounded-2xl overflow-hidden border border-ink/10">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-paper p-8 hover:bg-mist transition-colors">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C97A1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[s.icon]}
              </svg>
              <h3 className="font-display mt-5 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
