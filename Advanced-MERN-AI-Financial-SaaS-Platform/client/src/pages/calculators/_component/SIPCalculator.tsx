import { useState, useEffect } from "react";

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [expectedReturn, setExpectedReturn] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [futureValue, setFutureValue] = useState<number | null>(null);

  useEffect(() => {
    if (monthlyInvestment && expectedReturn && duration) {
      const months = duration * 12;
      const monthlyRate = expectedReturn / 12 / 100;

      const fv =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);

      setFutureValue(parseFloat(fv.toFixed(2)));
    } else {
      setFutureValue(null);
    }
  }, [monthlyInvestment, expectedReturn, duration]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center">SIP Calculator</h3>

      <div className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Monthly Investment"
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Expected Return (%)"
          type="number"
          value={expectedReturn}
          onChange={(e) => setExpectedReturn(Number(e.target.value))}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Duration (years)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg text-center">
        {futureValue !== null ? (
          <p className="text-xl font-semibold text-yellow-700">
            Future Value: ₹{futureValue}
          </p>
        ) : (
          <p className="text-gray-500">Enter all values to calculate SIP</p>
        )}
      </div>
    </div>
  );
};

export default SIPCalculator;
