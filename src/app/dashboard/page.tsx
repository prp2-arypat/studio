"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Landmark, Wallet, HeartPulse } from "lucide-react";
import { SummaryCard } from "./components/summary-card";
import { type StoredSimulation } from "@/lib/types";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const latestSimQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, "users", user.uid, "financialSimulations"),
        orderBy("timestamp", "desc"),
        limit(1)
    );
  }, [firestore, user]);

  const { data: latestSimulations, isLoading: isSimLoading } = useCollection<StoredSimulation>(latestSimQuery);

  const latestSimData = latestSimulations?.[0]?.inputs;

  const savingsHealth = (latestSimData?.currentSavingsCorpus && latestSimData?.monthlyIncome) ? (latestSimData.currentSavingsCorpus / latestSimData.monthlyIncome) : 0;
  const savingsHealthDescription = savingsHealth < 3 ? "Below recommended 3-6 months cover" : savingsHealth > 6 ? "Above recommended 3-6 months cover" : "Within recommended 3-6 months cover";


  if (authLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             <SummaryCard isLoading={isSimLoading} title="Monthly Income" value={`₹${(latestSimData?.monthlyIncome || 0).toLocaleString('en-IN')}`} description="Latest from your simulations." icon={Landmark} />
             <SummaryCard isLoading={isSimLoading} title="Total Monthly EMI" value={`₹${(latestSimData?.existingEmis || 0).toLocaleString('en-IN')}`} description="Latest from your simulations." icon={Wallet} />
             <SummaryCard isLoading={isSimLoading} title="Savings Health" value={`${savingsHealth.toFixed(1)} months`} description={savingsHealthDescription} icon={HeartPulse} />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Welcome to Your Dashboard, {user.displayName || 'User'}</CardTitle>
                <CardDescription>
                    This is your financial overview. For a deeper dive, head over to the simulation page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                    Ready to see how your next big decision impacts your future? Run a new simulation to get personalized insights and retirement projections.
                </p>
                <Button asChild>
                    <Link href="/dashboard/simulation">Go to Simulation</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
