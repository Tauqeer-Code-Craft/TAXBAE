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

const COLORS = ["#3B82F6", "#10B981"]; // Invested, Returns

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const GoalPlannerCalculator: React.FC = () => {
  const [goalAmount, setGoalAmount] = useState<number | "">("");
  const [timeInYears, setTimeInYears] = useState<number | "">("");
  const [expectedReturn, setExpectedReturn] = useState<number | "">("");

  const goalResult = useMemo(() => {
    if (!goalAmount || !timeInYears || !expectedReturn) {
      return {
        monthlyInvestment: null,
        totalInvestment: null,
        returns: null,
        yearlyData: [] as { year: number; value: number; invested: number }[],
      };
    }

    const target = goalAmount as number;
    const years = timeInYears as number;
    const annualRate = expectedReturn as number;

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    // SIP formula reversed:
    // FV = P * [((1+r)^n - 1) / r] * (1 + r)
    // => P = FV / ( [((1+r)^n - 1) / r] * (1 + r) )
    const factor =
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const monthlyInvestment = target / factor;
    const totalInvestment = monthlyInvestment * months;
    const returns = target - totalInvestment;

    // Yearly projection data
    const yearlyData: { year: number; value: number; invested: number }[] = [];
    let amount = 0;
    let invested = 0;

    for (let m = 1; m <= months; m++) {
      amount = amount * (1 + monthlyRate) + monthlyInvestment;
      invested += monthlyInvestment;

      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          value: parseFloat(amount.toFixed(2)),
          invested: parseFloat(invested.toFixed(2)),
        });
      }
    }

    return {
      monthlyInvestment: parseFloat(monthlyInvestment.toFixed(2)),
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      yearlyData,
    };
  }, [goalAmount, timeInYears, expectedReturn]);

  const { monthlyInvestment, totalInvestment, returns, yearlyData } = goalResult;

  const compositionData =
    totalInvestment !== null && returns !== null
      ? [
          { name: "Total Investment", value: totalInvestment },
          { name: "Returns", value: returns },
        ]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        Goal Planner
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Target Amount (₹)"
          type="number"
          value={goalAmount}
          onChange={(e) => {
            const v = e.target.value;
            setGoalAmount(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Time to Goal (Years)"
          type="number"
          value={timeInYears}
          onChange={(e) => {
            const v = e.target.value;
            setTimeInYears(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Expected Annual Return (%)"
          type="number"
          value={expectedReturn}
          onChange={(e) => {
            const v = e.target.value;
            setExpectedReturn(v === "" ? "" : Number(v));
          }}
        />
      </div>

      {/* Summary Card */}
      <div className="bg-indigo-50 p-4 rounded-lg space-y-2 text-center">
        {monthlyInvestment !== null ? (
          <>
            <p className="text-xl font-semibold text-indigo-700">
              Required Monthly Investment: ₹{formatCurrency(monthlyInvestment)}
            </p>
            <p className="text-md text-gray-800">
              Total Investment: ₹
              {totalInvestment !== null ? formatCurrency(totalInvestment) : "-"}
            </p>
            <p className="text-md text-green-600 font-semibold">
              Expected Returns: ₹
              {returns !== null ? formatCurrency(returns) : "-"}
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Enter all values to calculate your goal plan
          </p>
        )}
      </div>

      {/* Visualizations */}
      {monthlyInvestment !== null && totalInvestment !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart - Investment vs Returns */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Goal Amount Composition
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

          {/* Line Chart - Goal Progress Yearly */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Projected Growth Towards Goal
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
                  name="Total Invested"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Portfolio Value"
                  stroke="#10B981"
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

export default GoalPlannerCalculator;
