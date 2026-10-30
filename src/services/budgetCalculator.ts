import { NightOutBudget } from '../types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const EXCHANGE_RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 85.5,
  EUR: 92.0,
  GBP: 108.5
};

export function formatCurrency(amountInInr: number, targetCurrency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '₹';
  const rate = EXCHANGE_RATES_TO_INR[targetCurrency] || 1;
  const converted = amountInInr / rate;

  if (targetCurrency === 'INR') {
    return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
}

export interface BudgetCalculationResult {
  basePerPerson: number;
  bufferAmountPerPerson: number;
  totalPerPerson: number;
  totalForSquad: number;
  breakdown: {
    label: string;
    costPerPerson: number;
    percentOfTotal: number;
  }[];
  savingTips: string[];
}

export function calculateNightOutBudget(budget: NightOutBudget): BudgetCalculationResult {
  const partySize = Math.max(1, budget.partySize);

  // Per person allocations
  // Note: Transport, Accommodation, Parking can be shared among the party!
  const sharedTransitPerPerson = budget.transitCost / partySize;
  const sharedAccommodationPerPerson = budget.accommodationCost / partySize;
  const sharedParkingPerPerson = budget.parkingCost / partySize;

  const basePerPerson = 
    budget.ticketPerPerson +
    sharedTransitPerPerson +
    sharedAccommodationPerPerson +
    budget.foodCost +
    budget.drinksCost +
    sharedParkingPerPerson +
    budget.merchCost +
    budget.activitiesCost;

  const bufferAmountPerPerson = (basePerPerson * (budget.bufferPercent || 10)) / 100;
  const totalPerPerson = basePerPerson + bufferAmountPerPerson;
  const totalForSquad = totalPerPerson * partySize;

  const breakdown = [
    { label: 'Event Ticket', costPerPerson: budget.ticketPerPerson, percentOfTotal: 0 },
    { label: 'Transport / Fuel', costPerPerson: sharedTransitPerPerson, percentOfTotal: 0 },
    { label: 'Stay / Camping', costPerPerson: sharedAccommodationPerPerson, percentOfTotal: 0 },
    { label: 'Food & Meals', costPerPerson: budget.foodCost, percentOfTotal: 0 },
    { label: 'Drinks & Water', costPerPerson: budget.drinksCost, percentOfTotal: 0 },
    { label: 'Parking & Tolls', costPerPerson: sharedParkingPerPerson, percentOfTotal: 0 },
    { label: 'Merchandise', costPerPerson: budget.merchCost, percentOfTotal: 0 },
    { label: 'Activities & Afters', costPerPerson: budget.activitiesCost, percentOfTotal: 0 },
    { label: 'Emergency Cushion', costPerPerson: bufferAmountPerPerson, percentOfTotal: 0 },
  ].filter(item => item.costPerPerson > 0);

  // Compute percentages
  breakdown.forEach(item => {
    item.percentOfTotal = totalPerPerson > 0 ? Math.round((item.costPerPerson / totalPerPerson) * 100) : 0;
  });

  const savingTips: string[] = [];
  if (partySize === 1) {
    savingTips.push('Group up via Squad Sync: sharing rides & stay can slash per-person costs by up to 45%.');
  }
  if (budget.ticketPerPerson > 3000) {
    savingTips.push('Grab Early Bird or Phase 1 presales on Ticket Drop Radar before general prices hike.');
  }
  if (budget.drinksCost > 1500) {
    savingTips.push('Take advantage of free festival water refill stations instead of buying bottled water.');
  }
  if (budget.transitCost > 1200) {
    savingTips.push('Check the festival metro shuttle bus routes detailed in our Crowd Mood Map.');
  }

  return {
    basePerPerson,
    bufferAmountPerPerson,
    totalPerPerson,
    totalForSquad,
    breakdown,
    savingTips
  };
}
