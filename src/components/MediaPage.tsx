import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Share2, BookOpen, X } from "lucide-react";

interface MediaPost {
  id: string;
  title: string;
  category: "All" | "Subsidy" | "Engineering" | "Posters";
  categoryLabel: string;
  date: string;
  views: string;
  image: string;
  desc: string;
  highlights: string[];
}

export default function MediaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<MediaPost | null>(null);

  const posts: MediaPost[] = [
    {
      id: "salem-solar",
      title: "Best Solar Company in Salem – PM Surya Ghar Subsidy Rooftop Installation",
      category: "Posters",
      categoryLabel: "Salem Guide",
      date: "February 23, 2026",
      views: "99 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2026/02/Salem-Blog-Poster-890x664.jpg",
      desc: "Complete rooftop solar installation guide for Salem homeowners and businesses under the PM Surya Ghar government subsidy scheme with ₹78,000 direct bank subsidy.",
      highlights: [
        "Up to ₹78,000 government subsidy credited to bank",
        "Quick 3-day installation across Salem & surrounding taluks",
        "Full TNEB net-metering synchronization handled"
      ]
    },
    {
      id: "karur-solar",
      title: "Best Solar Company in Karur – PM Surya Ghar Subsidy Solar Installation",
      category: "Posters",
      categoryLabel: "Karur Guide",
      date: "February 14, 2026",
      views: "48 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2026/02/karur-ads-poster-1-890x664.jpg",
      desc: "Why Karur textile factories, individual homes, and HPCL fuel bunks are switching to Run Hi Tech Solar to eliminate high EB electricity tariffs.",
      highlights: [
        "Cut monthly power bills by 80% to 90%",
        "30-Year linear performance warranty on mono-PERC panels",
        "Dedicated local Karur service response team"
      ]
    },
    {
      id: "namakkal-solar",
      title: "Best Solar Company in Namakkal – Run Hi Tech Solar | PM Suryaghar Yojana 2025",
      category: "Subsidy",
      categoryLabel: "Namakkal Hub",
      date: "August 21, 2025",
      views: "243 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-17.54.23-890x664.jpeg",
      desc: "Headquartered in Velur, Namakkal, Run Hi Tech Solar is the most trusted local integrator for residential rooftop and agricultural solar power.",
      highlights: [
        "Direct local installation team in Velur & Namakkal",
        "Over 550+ verified installations across Western Tamil Nadu",
        "Zero-hassle paperwork and TNEB meter commissioning"
      ]
    },
    {
      id: "mw-solar-projects",
      title: "MW Solar Power Plant in Tamil Nadu – Captive, Group Captive & PPA Explained",
      category: "Engineering",
      categoryLabel: "MW Power Plants",
      date: "August 21, 2025",
      views: "1.0K Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.27-890x664.jpeg",
      desc: "Detailed engineering guide on setting up 1 MW to 10+ MW captive solar farms, group captive models, and Power Purchase Agreements (PPA) for Tamil Nadu industries.",
      highlights: [
        "10+ MW track record across spinning mills & foundries",
        "Accelerated tax depreciation (40%) and GST input benefits",
        "Fast 3 to 4 year complete project payback period"
      ]
    },
    {
      id: "pm-suryaghar-top-10",
      title: "Top 10 Questions About PM Surya Ghar Yojana Solar Subsidy – Tamil Nadu Guide",
      category: "Subsidy",
      categoryLabel: "Subsidy FAQ",
      date: "August 21, 2025",
      views: "496 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.26-890x664.jpeg",
      desc: "Everything you need to know about applying for government solar subsidy in Tamil Nadu: eligibility, documents needed, slab rates, and bank transfer timeline.",
      highlights: [
        "1 kW: ₹30,000 subsidy | 2 kW: ₹60,000 | 3 kW+: ₹78,000",
        "Required documents: Aadhaar, EB Bill & Bank Passbook",
        "Net metering approval and billing adjustments explained"
      ]
    },
    {
      id: "industrial-rooftop-savings",
      title: "Top 5 Benefits of Industrial Rooftop Solar for Tamil Nadu Factories",
      category: "Engineering",
      categoryLabel: "Factory Solar",
      date: "August 21, 2025",
      views: "175 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.28-890x664.jpeg",
      desc: "How industrial units in Coimbatore, Tirupur, and Salem protect their business from rising peak-hour TNEB tariffs with on-site solar plants.",
      highlights: [
        "Reduce operational overheads by up to 70%",
        "Shield factory from TNEB peak hour surcharge penalties",
        "Increase corporate ESG and clean sustainability ratings"
      ]
    }
  ];

  const categories = [
    { id: "All", label: "All Media" },
    { id: "Subsidy", label: "Govt Subsidy" },
    { id: "Engineering", label: "Engineering & MW" },
    { id: "Posters", label: "Regional Posters" }
  ];

  const filteredPosts = posts.filter((p) => {
    return selectedCategory === "All" || p.category === selectedCategory;
  });

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedPost(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedPost]);

  return (
    <div className="bg-dark-950 text-ink min-h-screen pt-28 sm:pt-32 pb-24 font-sans antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      
      {/* ══════════════════════════════════════════════════ */}
      {/*  HEADER BANNER                                     */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          <span className="gradient-text-shine">Solar Guides, Subsidy News & Project Posters</span>
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Explore genuine case studies, regional installation posters in Salem, Karur & Namakkal, government subsidy guides, and MW industrial engineering insights.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-blue-600 text-white shadow-sm scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  POSTS GRID                                        */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching articles found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for "subsidy", "Salem", "Karur", or "MW".</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-4 text-xs font-bold text-blue-600 hover:underline"
            >
              Show All Articles
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {/* Desc */}
                    <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {post.desc}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span className="flex items-center gap-1">
                    Read Guide & Summary <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-600">
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/*  ARTICLE DETAIL MODAL (PORTAL)                     */}
      {/* ══════════════════════════════════════════════════ */}
      {selectedPost && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-slate-200/90 relative my-auto flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header with Gradient & Close Button */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all z-20 cursor-pointer active:scale-95 border border-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold uppercase tracking-wider text-[11px]">
                  {selectedPost.categoryLabel}
                </span>
                <span>•</span>
                <span>{selectedPost.date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                {selectedPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPost.desc}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">
                  Key Takeaways & Benefits:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-outside pl-5">
                  {selectedPost.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/contact"
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all"
                  onClick={() => setSelectedPost(null)}
                >
                  Request Survey for This Solution
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Article link copied!");
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-3.5 px-5 rounded-xl transition-all"
                >
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}



    </div>
  );
}
