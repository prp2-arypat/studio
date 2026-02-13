"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StressResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StressIndicatorProps {
  stress: StressResult;
  isLoading: boolean;
}

export function StressIndicator({ stress, isLoading }: StressIndicatorProps) {
  const { ratio, level, message } = stress;

  const getLevelProperties = () => {
    switch (level) {
      case "Safe":
        return { color: "bg-green-500", textColor: "text-green-700 dark:text-green-400" };
      case "Risky":
        return { color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-400" };
      case "Stressed":
        return { color: "bg-red-500", textColor: "text-red-700 dark:text-red-400" };
      default:
        return { color: "bg-primary", textColor: "text-primary" };
    }
  };
  const { color, textColor } = getLevelProperties();

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-4 w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Financial Stress</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={ratio * 100} indicatorClassName={cn("transition-all duration-500", color)} className="h-3" />
          <span className={cn("text-lg font-bold", textColor)}>{(ratio * 100).toFixed(0)}%</span>
        </div>
        <div className="mt-2 text-sm font-medium text-center">
            <span className={textColor}>{level}</span>
        </div>
      </CardContent>
    </Card>
  );
}
