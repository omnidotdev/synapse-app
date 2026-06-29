import { Skeleton } from "@omnidotdev/thornberry/skeleton";

/**
 * Table skeleton for the members page.
 */
function MembersListSkeleton() {
  return (
    <div className="rounded-lg border">
      {/* Header */}
      <div className="flex gap-4 border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>

      {/* Rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          key={i}
          className="flex items-center gap-4 border-b px-4 py-3"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export default MembersListSkeleton;
