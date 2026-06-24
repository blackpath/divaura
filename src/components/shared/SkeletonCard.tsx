export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-square skeleton-luxury" />
      <div className="p-5 space-y-3">
        <div className="skeleton-luxury h-3 w-20 rounded-full" />
        <div className="skeleton-luxury h-5 w-full rounded-xl" />
        <div className="skeleton-luxury h-4 w-2/3 rounded-xl" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton-luxury h-5 w-24 rounded-xl" />
          <div className="skeleton-luxury h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}