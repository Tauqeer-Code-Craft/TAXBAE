import { useState, useMemo } from "react";
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

const COLORS = ["#FACC15", "#16A34A"]; // Invested, Returns

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [annualReturn, setAnnualReturn] = useState<number | "">("");
  const [tenureYears, setTenureYears] = useState<number | "">("");
  const [stepUpPercentage, setStepUpPercentage] = useState<number | "">("");

  const sipResult = useMemo(() => {
    if (!monthlyInvestment || !annualReturn || !tenureYears) {
      return {
        maturityAmount: null,
        investedAmount: null,
        returns: null,
        yearlyData: [] as { year: number; value: number; invested: number }[],
      };
    }

    const months = (tenureYears as number) * 12;
    const monthlyRate = (annualReturn as number) / 12 / 100;
    const stepUp = stepUpPercentage ? (stepUpPercentage as number) / 100 : 0;

    let amount = 0;
    let invested = 0;
    const yearlyData: { year: number; value: number; invested: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const currentYear = Math.floor((m - 1) / 12); // 0-based
      const currentMonthlyInvestment =
        (monthlyInvestment as number) * Math.pow(1 + stepUp, currentYear);

      // standard SIP monthly compounding
      amount = amount * (1 + monthlyRate) + currentMonthlyInvestment;
      invested += currentMonthlyInvestment;

      // capture data at the end of each year
      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          value: parseFloat(amount.toFixed(2)),
          invested: parseFloat(invested.toFixed(2)),
        });
      }
    }

    const maturityAmount = parseFloat(amount.toFixed(2));
    const investedAmount = parseFloat(invested.toFixed(2));
    const returns = parseFloat((maturityAmount - investedAmount).toFixed(2));

    return { maturityAmount, investedAmount, returns, yearlyData };
  }, [monthlyInvestment, annualReturn, tenureYears, stepUpPercentage]);

  const { maturityAmount, investedAmount, returns, yearlyData } = sipResult;

  const compositionData =
    investedAmount !== null && returns !== null
      ? [
          { name: "Invested Amount", value: investedAmount },
          { name: "Returns", value: returns },
        ]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        SIP Calculator
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Monthly Investment (₹)"
          type="number"
          value={monthlyInvestment}
          onChange={(e) => {
            const v = e.target.value;
            setMonthlyInvestment(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Expected Annual Return (%)"
          type="number"
          value={annualReturn}
          onChange={(e) => {
            const v = e.target.value;
            setAnnualReturn(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Investment Period (Years)"
          type="number"
          value={tenureYears}
          onChange={(e) => {
            const v = e.target.value;
            setTenureYears(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Annual Step-up (%) - Optional"
          type="number"
          value={stepUpPercentage}
          onChange={(e) => {
            const v = e.target.value;
            setStepUpPercentage(v === "" ? "" : Number(v));
          }}
        />
      </div>

      {/* Summary Card */}
      <div className="bg-yellow-50 p-4 rounded-lg space-y-2 text-center">
        {maturityAmount !== null ? (
          <>
            <p className="text-xl font-semibold text-yellow-700">
              Maturity Amount: ₹{formatCurrency(maturityAmount)}
            </p>
            <p className="text-md text-gray-800">
              Total Invested: ₹
              {investedAmount !== null ? formatCurrency(investedAmount) : "-"}
            </p>
            <p className="text-md text-green-600 font-semibold">
              Total Returns: ₹{returns !== null ? formatCurrency(returns) : "-"}
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Enter all values (at least first 3 fields) to calculate SIP
          </p>
        )}
      </div>

      {/* Visualizations */}
      {maturityAmount !== null && investedAmount !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart - Invested vs Returns */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Investment Breakdown
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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

          {/* Line Chart - Portfolio Growth */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Portfolio Growth Over Time
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData}>
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `Year ${value}`}
                  minTickGap={16}
                />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 100000).toFixed(0)}L`
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${formatCurrency(value as number)}`
                  }
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  name="Invested Amount"
                  stroke="#FACC15"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Portfolio Value"
                  stroke="#16A34A"
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

export default SIPCalculator;
