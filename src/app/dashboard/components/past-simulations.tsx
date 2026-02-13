"use client";

import { useEffect, useState } from "react";
import { getSimulationsForUser } from "@/lib/firebase/firestore";
import type { SimulationInput, StoredSimulation } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface PastSimulationsProps {
  userId: string;
  onLoad: (data: SimulationInput) => void;
  simulationCount: number;
}

export function PastSimulations({ userId, onLoad, simulationCount }: PastSimulationsProps) {
  const [simulations, setSimulations] = useState<StoredSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSimulations() {
      setIsLoading(true);
      const fetchedSimulations = await getSimulationsForUser(userId);
      setSimulations(fetchedSimulations);
      setIsLoading(false);
    }
    fetchSimulations();
  }, [userId, simulationCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Simulation History</CardTitle>
        <CardDescription>Review and re-run your past simulations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : simulations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <History className="h-10 w-10 mb-2" />
                <p>No past simulations found.</p>
                <p className="text-xs">Your saved simulations will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {simulations.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">
                        EMI of ₹{sim.inputs.plannedEmi.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(sim.timestamp.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onLoad(sim.inputs)}>
                    Re-run
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
