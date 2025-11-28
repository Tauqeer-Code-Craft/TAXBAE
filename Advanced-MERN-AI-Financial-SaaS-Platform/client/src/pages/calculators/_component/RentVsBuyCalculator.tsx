import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CURRENCY_LOCALE = "en-IN";

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const RentVsBuyCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number | "">("");
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [loanInterest, setLoanInterest] = useState<number | "">("");
  const [loanTenure, setLoanTenure] = useState<number | "">("");
  const [monthlyRent, setMonthlyRent] = useState<number | "">("");
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number | "">("");
  const [timeHorizon, setTimeHorizon] = useState<number | "">("");

  const [chartData, setChartData] = useState<
    { year: number; Buying: number; Renting: number }[]
  >([]);
  const [totalRentCost, setTotalRentCost] = useState<number | null>(null);
  const [totalBuyCost, setTotalBuyCost] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<"rent" | "buy" | null>(
    null
  );
  const [savings, setSavings] = useState<number | null>(null);

  useEffect(() => {
    if (
      homePrice !== "" &&
      downPayment !== "" &&
      loanInterest !== "" &&
      loanTenure !== "" &&
      monthlyRent !== "" &&
      annualRentIncrease !== "" &&
      timeHorizon !== ""
    ) {
      const price = Number(homePrice);
      const down = Number(downPayment);
      const loanRate = Number(loanInterest);
      const tenureYears = Number(loanTenure);
      const rent0 = Number(monthlyRent);
      const rentInc = Number(annualRentIncrease);
      const years = Number(timeHorizon);

      const loanAmount = price - down;
      const monthlyInterestRate = loanRate / 12 / 100;
      const totalMonths = tenureYears * 12;

      const emi =
        (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

      const buyCosts: number[] = [];
      const rentCosts: number[] = [];
      let cumulativeBuy = down; // include down payment up front
      let cumulativeRent = 0;
      let currentRent = rent0;

      for (let year = 1; year <= years; year++) {
        // Add 12 months of EMI if loan still running
        if (year <= tenureYears) {
          cumulativeBuy += emi * 12;
        }
        buyCosts.push(parseFloat(cumulativeBuy.toFixed(2)));

        // Rent side
        cumulativeRent += currentRent * 12;
        rentCosts.push(parseFloat(cumulativeRent.toFixed(2)));

        // Increase rent for next year
        currentRent *= 1 + rentInc / 100;
      }

      const data = Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        Buying: buyCosts[i],
        Renting: rentCosts[i],
      }));

      setChartData(data);

      const finalBuyCost = buyCosts[years - 1];
      const finalRentCost = rentCosts[years - 1];

      setTotalBuyCost(finalBuyCost);
      setTotalRentCost(finalRentCost);

      if (finalRentCost < finalBuyCost) {
        setRecommendation("rent");
        setSavings(parseFloat((finalBuyCost - finalRentCost).toFixed(2)));
      } else {
        setRecommendation("buy");
        setSavings(parseFloat((finalRentCost - finalBuyCost).toFixed(2)));
      }
    } else {
      setChartData([]);
      setTotalRentCost(null);
      setTotalBuyCost(null);
      setRecommendation(null);
      setSavings(null);
    }
  }, [
    homePrice,
    downPayment,
    loanInterest,
    loanTenure,
    monthlyRent,
    annualRentIncrease,
    timeHorizon,
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        Rent vs Buy Analyzer
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Home Price (₹)"
          type="number"
          value={homePrice}
          onChange={(e) =>
            setHomePrice(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Down Payment (₹)"
          type="number"
          value={downPayment}
          onChange={(e) =>
            setDownPayment(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Loan Interest Rate (%)"
          type="number"
          value={loanInterest}
          onChange={(e) =>
            setLoanInterest(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Loan Tenure (Years)"
          type="number"
          value={loanTenure}
          onChange={(e) =>
            setLoanTenure(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Monthly Rent (₹)"
          type="number"
          value={monthlyRent}
          onChange={(e) =>
            setMonthlyRent(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Annual Rent Increase (%)"
          type="number"
          value={annualRentIncrease}
          onChange={(e) =>
            setAnnualRentIncrease(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Time Horizon (Years)"
          type="number"
          value={timeHorizon}
          onChange={(e) =>
            setTimeHorizon(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* Summary Card */}
      <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {totalBuyCost !== null && totalRentCost !== null ? (
          <>
            <div>
              <p className="text-sm text-gray-500">Total Cost of Buying</p>
              <p className="text-lg font-semibold text-purple-700">
                ₹{formatCurrency(totalBuyCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost of Renting</p>
              <p className="text-lg font-semibold text-purple-700">
                ₹{formatCurrency(totalRentCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recommendation</p>
              <p
                className={`text-lg font-semibold ${
                  recommendation === "rent" ? "text-emerald-600" : "text-indigo-600"
                }`}
              >
                {recommendation === "rent" ? "RENT" : "BUY"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Potential Savings</p>
              <p className="text-lg font-semibold text-emerald-600">
                {savings !== null ? `₹${formatCurrency(savings)}` : "-"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-4">
            Enter all values to compare renting vs buying
          </p>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl shadow-inner h-80">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Cumulative Cost Over Time
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                dataKey="Buying"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={false}
                name="Buying (Cumulative)"
              />
              <Line
                type="monotone"
                dataKey="Renting"
                stroke="#EC4899"
                strokeWidth={2}
                dot={false}
                name="Renting (Cumulative)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RentVsBuyCalculator;
