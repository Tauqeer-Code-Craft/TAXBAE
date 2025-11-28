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

const RentVsBuyCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number | "">("");
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [loanInterest, setLoanInterest] = useState<number | "">("");
  const [loanTenure, setLoanTenure] = useState<number | "">("");
  const [monthlyRent, setMonthlyRent] = useState<number | "">("");
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number | "">(
    ""
  );
  const [timeHorizon, setTimeHorizon] = useState<number | "">("");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (
      homePrice &&
      downPayment !== "" &&
      loanInterest &&
      loanTenure &&
      monthlyRent &&
      annualRentIncrease !== "" &&
      timeHorizon
    ) {
      const years = timeHorizon;
      const loanAmount = homePrice - downPayment;
      const monthlyInterestRate = loanInterest / 12 / 100;
      const totalEMIPerMonth =
        (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, loanTenure * 12)) /
        (Math.pow(1 + monthlyInterestRate, loanTenure * 12) - 1);

      const buyCosts: number[] = [];
      const rentCosts: number[] = [];
      let cumulativeBuy = downPayment;
      let cumulativeRent = 0;
      let currentRent = monthlyRent;

      for (let i = 1; i <= years; i++) {
        if (i <= loanTenure) {
          cumulativeBuy += totalEMIPerMonth * 12;
        }
        buyCosts.push(parseFloat(cumulativeBuy.toFixed(2)));

        cumulativeRent += currentRent * 12;
        rentCosts.push(parseFloat(cumulativeRent.toFixed(2)));
        currentRent *= 1 + Number(annualRentIncrease) / 100;
      }

      const data = Array.from({ length: years }, (_, i) => ({
        year: `Year ${i + 1}`,
        Buying: buyCosts[i],
        Renting: rentCosts[i],
      }));

      setChartData(data);
    } else {
      setChartData([]);
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h3 className="text-lg font-bold text-gray-800 text-center">
        {chartData.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Buying"
                stroke="#833AA0"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Renting"
                stroke="#FF6384"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Home Price"
          type="number"
          value={homePrice}
          onChange={(e) => setHomePrice(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Down Payment"
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Loan Interest (%)"
          type="number"
          value={loanInterest}
          onChange={(e) => setLoanInterest(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Loan Tenure (years)"
          type="number"
          value={loanTenure}
          onChange={(e) => setLoanTenure(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Monthly Rent"
          type="number"
          value={monthlyRent}
          onChange={(e) => setMonthlyRent(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Annual Rent Increase (%)"
          type="number"
          value={annualRentIncrease}
          onChange={(e) => setAnnualRentIncrease(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Time Horizon (years)"
          type="number"
          value={timeHorizon}
          onChange={(e) => setTimeHorizon(Number(e.target.value))}
        />
      </div>

      
    </div>
  );
};

export default RentVsBuyCalculator;
