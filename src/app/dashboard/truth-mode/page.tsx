'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { StoredSimulation } from '@/lib/types';
import { AIInsightCard } from '../components/ai-insight-card';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { CheckSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TruthModePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const latestSimQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'financialSimulations'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, user]);

  const { data: latestSimulations, isLoading: isSimLoading } = useCollection<StoredSimulation>(latestSimQuery);

  const latestInsight = latestSimulations?.[0]?.results?.aiInsight;
  const isLoading = isUserLoading || isSimLoading;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!latestInsight) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[60vh]">
        <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <CardTitle className="font-headline text-2xl">The Unfiltered Truth Awaits</CardTitle>
        <CardDescription className="mt-2 max-w-md">
          Run a financial simulation on the dashboard to get your personalized AI-driven insight here. This is the unfiltered look at your financial decisions.
        </CardDescription>
        <Button asChild className="mt-6">
            <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <AIInsightCard insight={latestInsight} isLoading={false} />
    </div>
  );
}
