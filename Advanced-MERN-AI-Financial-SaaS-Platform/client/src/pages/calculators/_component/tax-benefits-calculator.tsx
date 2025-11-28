import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const CURRENCY_LOCALE = "en-IN";

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

type TaxRegime = "OLD_REGIME" | "NEW_REGIME";

const TAX_COLORS = ["#22C55E", "#EF4444"]; // Take-home, Tax
const BAR_COLOR_BEFORE = "#F97316";
const BAR_COLOR_AFTER = "#22C55E";

const calculateTaxForRegime = (
  taxableIncome: number,
  regime: TaxRegime
): number => {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  let income = taxableIncome;

  if (regime === "OLD_REGIME") {
    // Simple old regime slabs (illustrative)
    // 0–2.5L: 0%
    // 2.5–5L: 5%
    // 5–10L: 20%
    // >10L: 30%
    if (income > 250000) {
      const slab = Math.min(income, 500000) - 250000;
      tax += slab * 0.05;
    }
    if (income > 500000) {
      const slab = Math.min(income, 1000000) - 500000;
      tax += slab * 0.2;
    }
    if (income > 1000000) {
      const slab = income - 1000000;
      tax += slab * 0.3;
    }
  } else {
    // Simple new regime slabs (illustrative)
    // 0–3L: 0%
    // 3–7L: 5%
    // 7–10L: 10%
    // 10–12L: 15%
    // 12–15L: 20%
    // >15L: 30%
    if (income > 300000) {
      const slab = Math.min(income, 700000) - 300000;
      tax += slab * 0.05;
    }
    if (income > 700000) {
      const slab = Math.min(income, 1000000) - 700000;
      tax += slab * 0.1;
    }
    if (income > 1000000) {
      const slab = Math.min(income, 1200000) - 1000000;
      tax += slab * 0.15;
    }
    if (income > 1200000) {
      const slab = Math.min(income, 1500000) - 1200000;
      tax += slab * 0.2;
    }
    if (income > 1500000) {
      const slab = income - 1500000;
      tax += slab * 0.3;
    }
  }

  return parseFloat(tax.toFixed(2));
};

const TaxBenefitsCalculator: React.FC = () => {
  const [income, setIncome] = useState<number | "">("");
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("OLD_REGIME");
  const [section80C, setSection80C] = useState<number | "">("");
  const [section80D, setSection80D] = useState<number | "">("");
  const [nps, setNps] = useState<number | "">("");

  const result = useMemo(() => {
    if (!income || income <= 0) {
      return {
        taxableIncome: null,
        totalTax: null,
        taxSavings: null,
        totalDeductions: null,
        effectiveTaxRate: null,
        taxBeforeDeductions: null,
      };
    }

    const grossIncome = income as number;

    let eligible80C = 0;
    let eligible80D = 0;
    let eligibleNps = 0;

    if (taxRegime === "OLD_REGIME") {
      eligible80C = section80C ? Math.min(section80C as number, 150000) : 0;
      eligible80D = section80D ? Math.min(section80D as number, 25000) : 0;
      eligibleNps = nps ? Math.min(nps as number, 50000) : 0;
    } else {
      // Under new regime, for simplicity we ignore deductions.
      eligible80C = 0;
      eligible80D = 0;
      eligibleNps = 0;
    }

    const totalDeductions = eligible80C + eligible80D + eligibleNps;
    const taxableIncome = Math.max(grossIncome - totalDeductions, 0);

    const taxBeforeDeductions = calculateTaxForRegime(
      grossIncome,
      taxRegime
    );
    const totalTax = calculateTaxForRegime(taxableIncome, taxRegime);

    const taxSavings = parseFloat(
      (taxBeforeDeductions - totalTax).toFixed(2)
    );

    const effectiveTaxRate = parseFloat(
      ((totalTax / grossIncome) * 100).toFixed(2)
    );

    return {
      taxableIncome,
      totalTax,
      taxSavings,
      totalDeductions,
      effectiveTaxRate,
      taxBeforeDeductions,
    };
  }, [income, taxRegime, section80C, section80D, nps]);

  const {
    taxableIncome,
    totalTax,
    taxSavings,
    totalDeductions,
    effectiveTaxRate,
    taxBeforeDeductions,
  } = result;

  const pieData =
    totalTax !== null && income
      ? [
          {
            name: "Take Home (After Tax)",
            value: (income as number) - totalTax,
          },
          { name: "Tax Outgo", value: totalTax },
        ]
      : [];

  const barData =
    taxBeforeDeductions !== null && totalTax !== null
      ? [
          {
            label: "Before Deductions",
            Tax: taxBeforeDeductions,
          },
          {
            label: "After Deductions",
            Tax: totalTax,
          },
        ]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        Tax Benefits Calculator
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Annual Income (₹)"
          type="number"
          value={income}
          onChange={(e) => {
            const v = e.target.value;
            setIncome(v === "" ? "" : Number(v));
          }}
        />

        {/* Regime toggle */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
          <span className="text-sm text-gray-700 font-medium">
            Tax Regime
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium ${
                taxRegime === "OLD_REGIME"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setTaxRegime("OLD_REGIME")}
            >
              Old Regime
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium ${
                taxRegime === "NEW_REGIME"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setTaxRegime("NEW_REGIME")}
            >
              New Regime
            </button>
          </div>
        </div>

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Section 80C (₹)"
          type="number"
          value={section80C}
          onChange={(e) => {
            const v = e.target.value;
            setSection80C(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Section 80D (₹)"
          type="number"
          value={section80D}
          onChange={(e) => {
            const v = e.target.value;
            setSection80D(v === "" ? "" : Number(v));
          }}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="NPS Contribution (₹)"
          type="number"
          value={nps}
          onChange={(e) => {
            const v = e.target.value;
            setNps(v === "" ? "" : Number(v));
          }}
        />
      </div>

      {/* Summary Card */}
      <div className="bg-green-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
        {taxableIncome !== null && totalTax !== null ? (
          <>
            <div>
              <p className="text-gray-500">Taxable Income</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{formatCurrency(taxableIncome)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Tax</p>
              <p className="text-lg font-semibold text-red-600">
                ₹{formatCurrency(totalTax)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tax Savings</p>
              <p className="text-lg font-semibold text-emerald-600">
                {taxSavings !== null ? `₹${formatCurrency(taxSavings)}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Deductions</p>
              <p className="text-lg font-semibold text-blue-600">
                {totalDeductions !== null
                  ? `₹${formatCurrency(totalDeductions)}`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Effective Tax Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {effectiveTaxRate !== null ? `${effectiveTaxRate}%` : "-"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-5">
            Enter income (and optional deductions) to see tax details
          </p>
        )}
      </div>

      {/* Visualizations */}
      {totalTax !== null && income && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Tax before vs after deductions */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Impact of Deductions on Tax
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="label" />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 100000).toFixed(0)}L`
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${formatCurrency(value as number)}`
                  }
                />
                <Legend />
                <Bar
                  dataKey="Tax"
                  name="Tax Amount"
                  fill={BAR_COLOR_BEFORE}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Take-home vs Tax */}
          <div className="w-full h-72 bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Take-home vs Tax Outgo
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
                      fill={TAX_COLORS[index % TAX_COLORS.length]}
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
        </div>
      )}
    </div>
  );
};

export default TaxBenefitsCalculator;
