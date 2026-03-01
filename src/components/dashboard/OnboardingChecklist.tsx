import { Link } from "@tanstack/react-router";
import { CheckCircle2Icon, CircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "synapse:onboarding-dismissed";

interface Props {
  hasApiKeys: boolean;
  hasProviderKeys: boolean;
  hasUsage: boolean;
}

const steps = [
  {
    label: "Create an API key",
    to: "/dashboard/keys" as const,
    key: "hasApiKeys" as const,
  },
  {
    label: "Add a provider key",
    to: "/dashboard/provider-keys" as const,
    key: "hasProviderKeys" as const,
  },
  {
    label: "Make your first request",
    to: "/dashboard/usage" as const,
    key: "hasUsage" as const,
  },
];

/**
 * Dismissable onboarding checklist shown on the dashboard overview for new users.
 * Auto-hides when all steps are complete. Dismiss state persists in localStorage.
 */
function OnboardingChecklist({ hasApiKeys, hasProviderKeys, hasUsage }: Props) {
  const [dismissed, setDismissed] = useState(true);

  // Hydrate dismiss state from localStorage after mount
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const completion: Record<keyof Props, boolean> = {
    hasApiKeys,
    hasProviderKeys,
    hasUsage,
  };

  const allComplete = hasApiKeys && hasProviderKeys && hasUsage;

  if (dismissed || allComplete) return null;

  const completedCount = [hasApiKeys, hasProviderKeys, hasUsage].filter(
    Boolean,
  ).length;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Get started with Synapse</h3>
          <p className="text-muted-foreground text-xs">
            {completedCount}/3 steps complete
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Dismiss onboarding checklist"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {steps.map((step) => {
          const done = completion[step.key];

          return (
            <li key={step.key}>
              <Link
                to={step.to}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-primary/10"
              >
                {done ? (
                  <CheckCircle2Icon className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <CircleIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span
                  className={done ? "text-muted-foreground line-through" : ""}
                >
                  {step.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default OnboardingChecklist;
