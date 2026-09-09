
export function PageSkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      {/* ── Top Hero Skeleton ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_infinite]" />
        
        <div className="max-w-2xl space-y-4">
          <div className="h-6 w-36 bg-blue-100/80 rounded-full" />
          <div className="h-10 sm:h-12 w-3/4 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-5/6 bg-slate-100 rounded-lg" />
          
          <div className="pt-4 flex flex-wrap gap-3">
            <div className="h-11 w-40 bg-blue-600/20 rounded-xl" />
            <div className="h-11 w-32 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Floating Brand Emblem Watermark in corner */}
        <div className="absolute -right-6 -bottom-6 w-48 h-48 rounded-full bg-blue-50/50 flex items-center justify-center opacity-60 pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-blue-100/60" />
        </div>
      </div>

      {/* ── 4-Column Quick Stat Badges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-3 relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50" />
            <div className="h-6 w-20 bg-slate-200 rounded-lg" />
            <div className="h-3 w-28 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* ── Content Grid Section ── */}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="h-44 w-full bg-slate-100 rounded-2xl" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded-md" />
              <div className="h-3.5 w-5/6 bg-slate-100 rounded-md" />
            </div>
            <div className="pt-2 flex justify-between items-center">
              <div className="h-8 w-24 bg-blue-50 rounded-lg" />
              <div className="h-8 w-8 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ height = "h-48" }: { height?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 animate-pulse ${height} flex flex-col justify-between`}>
      <div className="space-y-2.5">
        <div className="h-4 w-1/3 bg-blue-100 rounded-lg" />
        <div className="h-6 w-3/4 bg-slate-200 rounded-xl" />
        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
      </div>
      <div className="h-10 w-full bg-slate-100 rounded-xl" />
    </div>
  );
}
