import { PlansPageTemplate } from "@/features/plans/components/PlansPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Plans | Academic LMS",
  description: "Manage subscription plans and pricing for the platform.",
};

import { Suspense } from "react";

export default function PlansPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Loading plans...</div>}>
      <PlansPageTemplate />
    </Suspense>
  );
}
