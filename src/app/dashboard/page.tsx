"use client";

import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { SummaryCard } from "./components/summary-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSimulationContext } from "./layout";
import { AIInsightCard } from "./components/ai-insight-card";
import { calculateRetirement } from "@/lib/finance-utils";

export default function DashboardPage() {
  const { user, isUserLoading: authLoading } = useUser();
  const { simulationInput, isLoading: isSimLoading } = useSimulationContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const {
    currentSavingsCorpus = 0,
    currentMonthlySavings = 0,
    expectedAnnualReturn = 0,
    currentAge = 0,
    targetRetirementAge = 0,
  } = simulationInput || {};

  const { corpus: corpusBefore } = calculateRetirement(
    currentSavingsCorpus,
    currentMonthlySavings,
    expectedAnnualReturn,
    currentAge,
    targetRetirementAge
  );

  if (authLoading || !user || isSimLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, {user?.displayName || "User"}!</h1>
        <p className="text-lg text-muted-foreground">Here’s your financial command center.</p>
        <p className="text-md mt-2 italic text-muted-foreground">
          &quot;Wealth is the ability to fully experience life.&quot;
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard isLoading={isSimLoading} title="Projected Retirement Corpus" value={`₹${corpusBefore.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} description="Live from your simulation profile." icon={TrendingUp} />
        <SummaryCard isLoading={isSimLoading} title="Financial Health" value={`Good`} description="Live from your simulation profile." icon={ShieldCheck} />
        <SummaryCard isLoading={isSimLoading} title="Next Smart Step" value="Run Simulation" description="Check AI insights for opportunities" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <AIInsightCard insight={"Run a simulation to get your personalized AI financial insight."} isLoading={isSimLoading}/>
          <Card className="flex flex-col justify-center rounded-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Take Control</CardTitle>
              <CardDescription>
                Ready to explore scenarios? Dive into the simulation tool.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full transition-transform duration-300 ease-in-out hover:scale-105">
                  <Link href="/dashboard/simulation">Go to Simulation Tools</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
