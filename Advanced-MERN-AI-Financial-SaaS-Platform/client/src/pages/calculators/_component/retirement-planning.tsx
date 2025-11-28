import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CURRENCY_LOCALE = "en-IN";

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const PIE_COLORS = ["#4F46E5", "#10B981"]; // Current savings vs future investments

const RetirementPlanningCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number | "">("");
  const [retirementAge, setRetirementAge] = useState<number | "">("");
  const [currentSalary, setCurrentSalary] = useState<number | "">("");
  const [currentSavings, setCurrentSavings] = useState<number | "">("");
  const [expectedInflation, setExpectedInflation] = useState<number | "">(6);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [retirementExpenseRatio, setRetirementExpenseRatio] = useState<
    number | ""
  >(0.8);

  const result = useMemo(() => {
    if (!currentAge || !retirementAge || !currentSalary) {
      return {
        yearsToRetirement: null,
        requiredCorpus: null,
        monthlyInvestmentNeeded: null,
        totalInvestmentNeeded: null,
        monthlyExpenseAtRetirement: null,
        yearlyData: [] as {
          year: number;
          corpus: number;
          neededCorpus: number;
        }[],
        pieData: [] as { name: string; value: number }[],
      };
    }

    const ageNow = currentAge as number;
    const ageRetire = retirementAge as number;
    const salary = currentSalary as number;
    const savingsNow = currentSavings ? (currentSavings as number) : 0;
    const infl = (expectedInflation as number) / 100;
    const ret = (expectedReturn as number) / 100;
    const ratio = retirementExpenseRatio
      ? (retirementExpenseRatio as number)
      : 0.8;

    const yearsToRetirement = ageRetire - ageNow;
    if (yearsToRetirement <= 0) {
      return {
        yearsToRetirement: 0,
        requiredCorpus: null,
        monthlyInvestmentNeeded: null,
        totalInvestmentNeeded: null,
        monthlyExpenseAtRetirement: null,
        yearlyData: [],
        pieData: [],
      };
    }

    // Monthly expense today based on salary + ratio
    const monthlyExpenseToday = (salary / 12) * ratio;

    // Inflate expenses to retirement
    const monthlyExpenseAtRetirement =
      monthlyExpenseToday * Math.pow(1 + infl, yearsToRetirement);

    // Rule-of-thumb: 25x yearly expenses at retirement
    const yearlyExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
    const requiredCorpus = yearlyExpenseAtRetirement * 25;

    // Time and rates for SIP math
    const months = yearsToRetirement * 12;
    const monthlyRate = ret / 12;

    // Future value of existing savings
    const futureValueSavings = savingsNow * Math.pow(1 + monthlyRate, months);

    // SIP factor for monthly investment
    const factor =
      monthlyRate === 0
        ? months
        : ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);

    const corpusNeededFromSIP = Math.max(requiredCorpus - futureValueSavings, 0);

    const monthlyInvestmentNeeded =
      factor === 0 ? 0 : corpusNeededFromSIP / factor;

    const totalInvestmentNeeded =
      monthlyInvestmentNeeded * months + savingsNow;

    // Yearly projection of corpus
    const yearlyData: { year: number; corpus: number; neededCorpus: number }[] =
      [];
    let corpus = savingsNow;

    for (let y = 1; y <= yearsToRetirement; y++) {
      const yearMonths = 12;
      for (let m = 1; m <= yearMonths; m++) {
        corpus = corpus * (1 + monthlyRate) + monthlyInvestmentNeeded;
      }

      const neededThisYear =
        yearlyExpenseAtRetirement * 25; // Keeping required corpus flat for visual simplicity

      yearlyData.push({
        year: y,
        corpus: parseFloat(corpus.toFixed(2)),
        neededCorpus: parseFloat(neededThisYear.toFixed(2)),
      });
    }

    const coveredBySavings = Math.min(futureValueSavings, requiredCorpus);
    const toBeFunded = Math.max(requiredCorpus - futureValueSavings, 0);

    const pieData = [
      { name: "Covered by Current Savings", value: coveredBySavings },
      { name: "To be Funded via Investments", value: toBeFunded },
    ];

    return {
      yearsToRetirement,
      requiredCorpus: parseFloat(requiredCorpus.toFixed(2)),
      monthlyInvestmentNeeded: parseFloat(
        monthlyInvestmentNeeded.toFixed(2)
      ),
      totalInvestmentNeeded: parseFloat(totalInvestmentNeeded.toFixed(2)),
      monthlyExpenseAtRetirement: parseFloat(
        monthlyExpenseAtRetirement.toFixed(2)
      ),
      yearlyData,
      pieData,
    };
  }, [
    currentAge,
    retirementAge,
    currentSalary,
    currentSavings,
    expectedInflation,
    expectedReturn,
    retirementExpenseRatio,
  ]);

  const {
    yearsToRetirement,
    requiredCorpus,
    monthlyInvestmentNeeded,
    totalInvestmentNeeded,
    monthlyExpenseAtRetirement,
    yearlyData,
    pieData,
  } = result;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        Retirement Planning Calculator
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Current Age"
          type="number"
          value={currentAge}
          onChange={(e) =>
            setCurrentAge(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Retirement Age"
          type="number"
          value={retirementAge}
          onChange={(e) =>
            setRetirementAge(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Current Annual Salary (₹)"
          type="number"
          value={currentSalary}
          onChange={(e) =>
            setCurrentSalary(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Current Savings (₹)"
          type="number"
          value={currentSavings}
          onChange={(e) =>
            setCurrentSavings(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Expected Inflation (%)"
          type="number"
          value={expectedInflation}
          onChange={(e) =>
            setExpectedInflation(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Expected Return (%)"
          type="number"
          value={expectedReturn}
          onChange={(e) =>
            setExpectedReturn(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Retirement Expense Ratio (e.g., 0.8)"
          type="number"
          step="0.01"
          value={retirementExpenseRatio}
          onChange={(e) =>
            setRetirementExpenseRatio(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* Summary Card */}
      <div className="bg-violet-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
        {requiredCorpus !== null ? (
          <>
            <div>
              <p className="text-gray-500">Years to Retirement</p>
              <p className="text-lg font-semibold text-gray-900">
                {yearsToRetirement} years
              </p>
            </div>
            <div>
              <p className="text-gray-500">Required Corpus</p>
              <p className="text-lg font-semibold text-violet-700">
                ₹{formatCurrency(requiredCorpus!)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Monthly Investment Needed</p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹
                {monthlyInvestmentNeeded !== null
                  ? formatCurrency(monthlyInvestmentNeeded)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Investment</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹
                {totalInvestmentNeeded !== null
                  ? formatCurrency(totalInvestmentNeeded)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                Monthly Expense at Retirement (inflation-adjusted)
              </p>
              <p className="text-lg font-semibold text-amber-600">
                ₹
                {monthlyExpenseAtRetirement !== null
                  ? formatCurrency(monthlyExpenseAtRetirement)
                  : "-"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-5">
            Fill in your details to see your retirement plan.
          </p>
        )}
      </div>

      {/* Visualizations */}
      {requiredCorpus !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Corpus Coverage Breakdown
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) =>
                    `${name}: ₹${formatCurrency(value)}`
                  }
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `₹${formatCurrency(value as number)}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Projected Corpus vs Required Corpus
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData}>
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `Year ${value}`}
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
                  dataKey="corpus"
                  name="Projected Corpus"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="neededCorpus"
                  name="Required Corpus"
                  stroke="#F97316"
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

export default RetirementPlanningCalculator;
