import { useState, useEffect } from "react";

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [tenure, setTenure] = useState<number | "">("");
  const [emi, setEmi] = useState<number | null>(null);

  useEffect(() => {
    if (loanAmount && interestRate && tenure) {
      const principal = loanAmount;
      const rate = interestRate / 12 / 100; // monthly interest rate
      const months = tenure;

      const emiValue =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);

      setEmi(parseFloat(emiValue.toFixed(2)));
    } else {
      setEmi(null);
    }
  }, [loanAmount, interestRate, tenure]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center">
        EMI Calculator
      </h3>

      <div className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Interest Rate (%)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
        />
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tenure (months)"
          type="number"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-center">
        {emi !== null ? (
          <p className="text-xl font-semibold text-blue-700">
            Your EMI: ₹{emi}
          </p>
        ) : (
          <p className="text-gray-500">Enter all values to calculate EMI</p>
        )}
      </div>
    </div>
  );
};

export default EMICalculator;
