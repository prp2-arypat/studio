import type { StressResult } from './types';

export function calculateStress(
  income: number,
  existingEmi: number,
  plannedEmi: number
): StressResult {
  if (income === 0) return { ratio: 0, level: 'Safe', message: 'Enter income to calculate stress.' };
  
  const totalEmi = existingEmi + plannedEmi;
  const stressRatio = totalEmi / income;
  const remainingIncomeRatio = (income - totalEmi) / income;

  let level: 'Safe' | 'Risky' | 'Stressed' = 'Safe';
  let message = 'This decision looks manageable and shouldn\'t add much financial stress.';

  if (stressRatio >= 0.4 && stressRatio < 0.6) {
    level = 'Risky';
    message = 'This decision makes your finances a bit risky. Proceed with caution.';
  } else if (stressRatio >= 0.6) {
    level = 'Stressed';
    message = 'High financial stress! This decision could strain your budget significantly.';
  }

  if (remainingIncomeRatio < 0.2 && level !== 'Stressed') {
    level = 'Stressed';
    message = 'Your disposable income is very low, which puts you in a stress zone.';
  }

  return { ratio: stressRatio, level, message };
}

export function calculateRetirement(
  initialCorpus: number,
  monthlySaving: number,
  annualRate: number,
  currentAge: number,
  retirementAge: number,
  generateGrowthData: boolean = false
) {
  const monthlyRate = annualRate / 12 / 100;
  const months = (retirementAge - currentAge) * 12;

  if (months <= 0) return { corpus: initialCorpus, monthlyGrowthData: [] };

  const futureValueOfCorpus = initialCorpus * Math.pow(1 + monthlyRate, months);
  
  let futureValueOfSip = 0;
  if (monthlyRate > 0) {
    futureValueOfSip = monthlySaving * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else {
    futureValueOfSip = monthlySaving * months;
  }
  
  const totalCorpus = futureValueOfCorpus + futureValueOfSip;

  let monthlyGrowthData: { month: number; corpus: number }[] = [];
  if (generateGrowthData) {
    for (let i = 1; i <= months; i++) {
        const fvCorpus = initialCorpus * Math.pow(1 + monthlyRate, i);
        const fvSip = monthlySaving * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate);
        monthlyGrowthData.push({ month: i, corpus: fvCorpus + fvSip });
    }
  }

  return { corpus: totalCorpus, monthlyGrowthData };
}

interface RetirementDelayParams {
  originalCorpus: number;
  newMonthlySavings: number;
  annualRate: number;
  currentCorpus: number;
  currentAge: number;
  originalRetirementAge: number;
}

export function calculateRetirementDelay({
  originalCorpus,
  newMonthlySavings,
  annualRate,
  currentCorpus,
  currentAge,
  originalRetirementAge
}: RetirementDelayParams): number {
  if (newMonthlySavings <= 0) return 30; // A large number to indicate it's not achievable
  
  const monthlyRate = annualRate / 12 / 100;
  const originalMonths = (originalRetirementAge - currentAge) * 12;

  // We need to find `n` (months) such that:
  // originalCorpus = currentCorpus * (1+r)^n + newMonthlySavings * [((1+r)^n - 1) / r]
  // This is hard to solve directly for n. Let's iterate.

  let calculatedCorpus = 0;
  let months = originalMonths;

  while(calculatedCorpus < originalCorpus && months < (35 * 12)) { // Cap at 35 years extra
    months++;
    const fvCorpus = currentCorpus * Math.pow(1 + monthlyRate, months);
    const fvSip = newMonthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    calculatedCorpus = fvCorpus + fvSip;
  }
  
  const delayInMonths = months - originalMonths;

  return delayInMonths > 0 ? delayInMonths / 12 : 0;
}
