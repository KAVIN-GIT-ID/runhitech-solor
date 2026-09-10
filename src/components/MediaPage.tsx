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
      id: "pm-surya-ghar-subsidy-guide",
      title: "The PM Surya Ghar Subsidy Guide",
      category: "Subsidy",
      categoryLabel: "Subsidy Guide",
      date: "February 2026",
      views: "1.2K Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.26-890x664.jpeg",
      desc: "Avoid common TANGEDCO paperwork traps. Learn the exact, step-by-step process to secure your ₹78,000 Direct Benefit Transfer (DBT) without delays.",
      highlights: [
        "Avoid common TANGEDCO paperwork traps and registration delays",
        "Step-by-step process to secure ₹78,000 Direct Benefit Transfer (DBT)",
        "End-to-end site survey, net-metering and bank credit guide"
      ]
    },
    {
      id: "regional-project-posters",
      title: "Regional Project Posters (Salem, Karur & Namakkal)",
      category: "Posters",
      categoryLabel: "Regional Posters",
      date: "February 2026",
      views: "890 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2026/02/Salem-Blog-Poster-890x664.jpg",
      desc: "See what solar looks like in your own neighborhood. Browse real roof layouts, installation galleries, and setup configurations from local homes and businesses.",
      highlights: [
        "Real roof layouts and installation galleries across Salem, Karur & Namakkal",
        "Setup configurations for local homes, fuel bunks, and commercial rooftops",
        "Rapid-response engineering and localized service support"
      ]
    },
    {
      id: "before-after-case-studies",
      title: "Genuine \"Before & After\" Case Studies",
      category: "Subsidy",
      categoryLabel: "Case Studies",
      date: "January 2026",
      views: "1.5K Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2026/02/karur-ads-poster-1-890x664.jpg",
      desc: "Read the exact stories of how Tamil Nadu homeowners and HPCL petrol bunk operators permanently slashed their monthly EB bills to zero.",
      highlights: [
        "Real homeowner stories dropping monthly EB bills from ₹3,000+ to ₹200",
        "350+ HPCL petrol bunk operators solarized for maximum efficiency",
        "Demonstrated 3 to 4 year complete investment payback period"
      ]
    },
    {
      id: "mw-industrial-blueprints",
      title: "MW Industrial Engineering Blueprints",
      category: "Engineering",
      categoryLabel: "Industrial MW",
      date: "January 2026",
      views: "2.1K Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.27-890x664.jpeg",
      desc: "Deep-dive insights for facility managers. Discover high-ROI strategies for Captive, Group Captive, and PPA solar plants, including grid integration and Tier-1 module selection.",
      highlights: [
        "High-ROI blueprints for Captive, Group Captive, and PPA solar plants",
        "Substation grid integration & TNEB open access regulations",
        "Tier-1 Mono PERC and TOPCon module selection for 25+ year performance"
      ]
    },
    {
      id: "salem-solar",
      title: "Salem Rooftop Solar Installation Guide",
      category: "Posters",
      categoryLabel: "Salem Hub",
      date: "February 2026",
      views: "640 Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2026/02/Salem-Blog-Poster-890x664.jpg",
      desc: "Complete rooftop solar installation guide for Salem homeowners and businesses under the PM Surya Ghar government subsidy scheme with ₹78,000 direct bank subsidy.",
      highlights: [
        "Up to ₹78,000 government subsidy credited to bank",
        "Quick 7 to 10 day turnkey installation across Salem & surrounding taluks",
        "Full TNEB net-metering synchronization handled"
      ]
    },
    {
      id: "industrial-rooftop-savings",
      title: "Industrial & Commercial Rooftop Solar Guide for Factories",
      category: "Engineering",
      categoryLabel: "Commercial MW",
      date: "January 2026",
      views: "1.1K Views",
      image: "https://runhitechsolar.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-21-at-16.50.28-890x664.jpeg",
      desc: "How industrial units in Coimbatore, Tirupur, Karur, and Salem protect their business from rising peak-hour TNEB tariffs with on-site solar plants.",
      highlights: [
        "Reduce operational overheads by up to 70%",
        "Shield factory from TNEB peak hour surcharge penalties",
        "Over 10+ MW successfully commissioned across Tamil Nadu"
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
          <span className="gradient-text-shine">Don't Navigate Your Solar Switch Blind. Get the Facts.</span>
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Navigating government portals, choosing the right inverter capacity, and understanding grid regulations can feel overwhelming. You shouldn't have to be an electrical engineer to lower your EB bill.
        </p>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          We have stripped away the complex jargon. Explore our free library of regional success stories, step-by-step subsidy guides, and heavy-duty engineering blueprints to make your solar transition completely frictionless.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#articles"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all text-center"
          >
            Read the Latest Articles
          </a>
          <Link
            to="/contact"
            className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-6 py-3.5 rounded-xl border border-slate-200 transition-all text-center"
          >
            Download the Free Subsidy Application Checklist
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div id="articles" className="mt-8 sm:mt-10 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2">
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
