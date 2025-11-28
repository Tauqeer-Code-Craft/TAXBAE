import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const CURRENCY_LOCALE = "en-IN";

const COLORS = ["#2563EB", "#EF4444"]; // Principal, Interest

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [tenureYears, setTenureYears] = useState<number | "">("");

  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  useEffect(() => {
    if (loanAmount && interestRate && tenureYears) {
      const principal = loanAmount;
      const rate = interestRate / 12 / 100; // Monthly rate
      const months = tenureYears * 12; // Convert years to months

      const emiValue =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);

      const totalAmt = emiValue * months;
      const interest = totalAmt - principal;

      setEmi(parseFloat(emiValue.toFixed(2)));
      setTotalAmount(parseFloat(totalAmt.toFixed(2)));
      setTotalInterest(parseFloat(interest.toFixed(2)));
    } else {
      setEmi(null);
      setTotalAmount(null);
      setTotalInterest(null);
    }
  }, [loanAmount, interestRate, tenureYears]);

  // Pie chart data: Principal vs Interest
  const compositionData = useMemo(() => {
    if (!loanAmount || !totalInterest) return [];
    return [
      { name: "Principal", value: loanAmount as number },
      { name: "Interest", value: totalInterest },
    ];
  }, [loanAmount, totalInterest]);

  // Line chart data: Outstanding balance over time (per month)
  const amortizationData = useMemo(() => {
    if (!emi || !loanAmount || !interestRate || !tenureYears) return [];

    const principal = loanAmount as number;
    const rateMonthly = (interestRate as number) / 12 / 100;
    const months = (tenureYears as number) * 12;

    let balance = principal;
    const rows: { month: number; balance: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const interestPortion = balance * rateMonthly;
      const principalPortion = emi - interestPortion;
      balance = balance - principalPortion;

      rows.push({
        month: m,
        balance: balance > 0 ? parseFloat(balance.toFixed(2)) : 0,
      });

      if (balance <= 0) break;
    }

    return rows;
  }, [emi, loanAmount, interestRate, tenureYears]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        EMI Calculator
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Loan Amount (₹)"
          type="number"
          value={loanAmount}
          onChange={(e) => {
            const value = e.target.value;
            setLoanAmount(value === "" ? "" : Number(value));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Interest Rate (% per annum)"
          type="number"
          value={interestRate}
          onChange={(e) => {
            const value = e.target.value;
            setInterestRate(value === "" ? "" : Number(value));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Loan Tenure (Years)"
          type="number"
          value={tenureYears}
          onChange={(e) => {
            const value = e.target.value;
            setTenureYears(value === "" ? "" : Number(value));
          }}
        />
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        {emi !== null ? (
          <>
            <p className="text-xl font-semibold text-blue-700">
              Monthly EMI: ₹{formatCurrency(emi)}
            </p>
            <p className="text-md text-gray-800">
              Total Amount Payable: ₹
              {totalAmount !== null ? formatCurrency(totalAmount) : "-"}
            </p>
            <p className="text-md text-red-600 font-semibold">
              Total Interest: ₹
              {totalInterest !== null ? formatCurrency(totalInterest) : "-"}
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Enter all values to calculate EMI
          </p>
        )}
      </div>

      {/* Visualizations */}
      {emi !== null && totalInterest !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart - Principal vs Interest */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Loan Cost Breakdown
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) =>
                    `${name}: ₹${formatCurrency(value)}`
                  }
                >
                  {compositionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `₹${formatCurrency(value as number)}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Outstanding Balance Over Time */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Outstanding Balance Over Time
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={amortizationData}>
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => `M${value}`}
                  minTickGap={20}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${formatCurrency(value as number)}`
                  }
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Outstanding Balance"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
