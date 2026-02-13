"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { SimulationInput } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface FinancialInputFormProps {
  form: UseFormReturn<SimulationInput>;
  onSubmit: (data: SimulationInput) => void;
  isSimulating: boolean;
}

export function FinancialInputForm({ form, onSubmit, isSimulating }: FinancialInputFormProps) {
  const decisionType = useWatch({
    control: form.control,
    name: "decisionType",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Financial Profile</CardTitle>
            <CardDescription>This is your financial snapshot. Keep it updated for accurate simulations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="currentSavingsCorpus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Savings</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="currentAge" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="targetRetirementAge" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retirement Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="existingEmis" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing EMIs</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="currentMonthlySavings" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Savings</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField control={form.control} name="expectedAnnualReturn" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Expected Annual Return (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="text-lg font-medium">New Financial Decision</h3>
                <FormField
                    control={form.control}
                    name="decisionType"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Decision Type</FormLabel>
                        <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                        >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="Loan" />
                            </FormControl>
                            <FormLabel className="font-normal">Loan / New EMI</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="Purchase" />
                            </FormControl>
                            <FormLabel className="font-normal">One-time Purchase</FormLabel>
                            </FormItem>
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="decisionName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Decision Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., New Bike, Home Downpayment" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField control={form.control} name="plannedAmount" render={({ field }) => (
                    <FormItem>
                    <FormLabel>{decisionType === 'Loan' ? 'Monthly EMI Amount' : 'Purchase Amount'}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder={decisionType === 'Loan' ? '10000' : '200000'} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {decisionType === 'Loan' && (
                    <FormField control={form.control} name="loanDurationYears" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Loan Duration (Years)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" className="w-full" disabled={isSimulating}>
                {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simulate
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
