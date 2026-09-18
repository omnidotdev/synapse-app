/**
 * Skeleton placeholder shown while dashboard overview loaders resolve.
 * Mirrors the layout of the DashboardOverview component: heading, 3 stat cards, 2 link cards.
 */
function DashboardPending() {
  return (
    <div className="flex flex-col gap-6">
      {/* Heading placeholder */}
      <div>
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
      </div>

      {/* 3 stat card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="rounded-xl border bg-card p-6 shadow dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1">
                <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-6 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2 link card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="flex items-center gap-3 rounded-xl border bg-card p-4"
          >
            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="mt-1.5 h-3 w-44 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPending;
