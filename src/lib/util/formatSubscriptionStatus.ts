const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  canceled: "Canceled",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete expired",
  unpaid: "Unpaid",
  paused: "Paused",
};

/**
 * Humanize a subscription status enum for display (e.g. `past_due` -> "Past due").
 */
const formatSubscriptionStatus = (status: string) => {
  const label = STATUS_LABELS[status];
  if (label) return label;

  const spaced = status.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export default formatSubscriptionStatus;
