"use client";

import { useState } from "react";
import { useGetPlans } from "../api/get-plans";
import { PlanCard } from "./PlanCard";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQueryParam } from "@/hooks/use-query-params";

export function PlansPageTemplate() {
  const { data: plans, isLoading, isError } = useGetPlans();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  // Use the custom hook to track selected plan in URL
  const { value: selectedPlanSlug, setValue: setSelectedPlan } =
    useQueryParam("plan");

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !plans) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-bold text-red-600">Failed to load plans</h3>
        <p className="text-slate-500 max-w-md">
          There was an error retrieving the subscription plans. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Choose the perfect plan for your institution. Upgrade or downgrade
            at any time as your needs evolve.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 border p-2 rounded-full shadow-sm">
          <Label
            htmlFor="billing-toggle"
            className={`cursor-pointer font-medium ${
              billingCycle === "monthly"
                ? "text-slate-900 dark:text-white"
                : "text-slate-500"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "yearly" : "monthly")
            }
          />
          <Label
            htmlFor="billing-toggle"
            className={`cursor-pointer font-medium flex items-center ${
              billingCycle === "yearly"
                ? "text-slate-900 dark:text-white"
                : "text-slate-500"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span className="ml-1.5 rounded-full bg-green-100 dark:bg-green-900/50 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
              Save 20%
            </span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isSelected={selectedPlanSlug === plan.slug}
            onClick={() => setSelectedPlan(plan.slug)}
          />
        ))}
      </div>
    </div>
  );
}
