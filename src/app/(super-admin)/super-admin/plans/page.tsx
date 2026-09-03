import { PlansPageTemplate } from "@/features/plans/components/PlansPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Plans | Academic LMS",
  description: "Manage subscription plans and pricing for the platform.",
};

export default function PlansPage() {
  return <PlansPageTemplate />;
}
