// src/chatbot/toon.converter.ts

type AnalyticsData = {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  savingRate: {
    percentage: number;
    expenseRatio: number;
  };
  transactionCount: number;
  percentageChange: {
    income: number;
    expenses: number;
    balance: number;
  };
  chartData?: { date: string; income: number; expenses: number }[];
  expenseBreakdown?: { name: string; value: number; percentage: number }[];
  presetLabel?: string;
};

export function convertAnalyticsToTOON(data: AnalyticsData): string {
  const label = data.presetLabel || "Yearly Summary";

  let toon = `@summary {\n`;
  toon += `  period: "${label}";\n`;
  toon += `  totalIncome: ${data.totalIncome};\n`;
  toon += `  totalExpenses: ${data.totalExpenses};\n`;
  toon += `  availableBalance: ${data.availableBalance};\n`;
  toon += `  savingRate {\n`;
  toon += `    percentage: ${data.savingRate.percentage.toFixed(2)};\n`;
  toon += `    expenseRatio: ${data.savingRate.expenseRatio.toFixed(2)};\n`;
  toon += `  }\n`;
  toon += `  transactionCount: ${data.transactionCount};\n`;
  toon += `  percentageChange {\n`;
  toon += `    income: ${data.percentageChange.income.toFixed(2)};\n`;
  toon += `    expenses: ${data.percentageChange.expenses.toFixed(2)};\n`;
  toon += `    balance: ${data.percentageChange.balance.toFixed(2)};\n`;
  toon += `  }\n`;
  toon += `}\n`;

  if (data.chartData && data.chartData.length > 0) {
    toon += `@chartData {\n`;
    data.chartData.forEach((item) => {
      toon += `  entry { date: "${item.date}"; income: ${item.income}; expenses: ${item.expenses}; }\n`;
    });
    toon += `}\n`;
  }

  if (data.expenseBreakdown && data.expenseBreakdown.length > 0) {
    toon += `@expenseBreakdown {\n`;
    data.expenseBreakdown.forEach((item) => {
      toon += `  category { name: "${item.name}"; value: ${item.value}; percentage: ${item.percentage.toFixed(2)}; }\n`;
    });
    toon += `}\n`;
  }

  return toon;
}
