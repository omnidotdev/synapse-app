import { Link } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";

interface Props {
  /** Show the banner (true when user has no active paid subscription) */
  show: boolean;
}

/**
 * Upgrade prompt banner shown when the user is on the free plan.
 */
function UpgradeBanner({ show }: Props) {
  if (!show) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <SparklesIcon className="h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm">
        You&apos;re on the Free plan.{" "}
        <Link
          to="/pricing"
          className="font-medium underline hover:text-foreground"
        >
          upgrade for higher limits
        </Link>
      </p>
    </div>
  );
}

export default UpgradeBanner;
