const featureMinimumPlan: Record<string, "free" | "premium" | "pro"> = {
  basic_dashboard: "free",
  manual_movements: "free",
  basic_goals: "free",
  basic_assistant: "free",
  basic_image_upload: "free",
  unlimited_movements: "premium",
  advanced_assistant: "premium",
  image_extraction: "premium",
  advanced_alerts: "premium",
  mp_advanced_sync: "premium",
  timeline_full: "premium",
  invoice_exports: "premium",
  decision_simulator: "premium",
  investment_dashboard: "pro",
  advanced_reports: "pro",
  market_scenarios: "pro",
  cashflow_prediction: "pro",
  priority_support: "pro",
  admin_insights: "pro",
};

const planRank: Record<string, number> = {
  free: 0,
  premium: 1,
  pro: 2,
};

export function hasFeatureAccess(userPlan: string, featureKey: string) {
  const minimumPlan = featureMinimumPlan[featureKey] ?? "free";

  return (planRank[userPlan] ?? 0) >= planRank[minimumPlan];
}

export function getMinimumPlanForFeature(featureKey: string) {
  return featureMinimumPlan[featureKey] ?? "free";
}
