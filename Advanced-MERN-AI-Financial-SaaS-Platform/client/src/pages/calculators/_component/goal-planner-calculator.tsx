import { useState, useEffect } from "react";

const TaxBenefitsCalculator: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<number | "">("");
  const [investmentAmount, setInvestmentAmount] = useState<number | "">("");
  const [section, setSection] = useState<"80C" | "80D" | "">("");
  const [taxSavings, setTaxSavings] = useState<number | null>(null);

  useEffect(() => {
    if (annualIncome && investmentAmount && section) {
      let limit = 0;
      switch (section) {
        case "80C":
          limit = 150000; // Max deduction for 80C
          break;
        case "80D":
          limit = 25000; // Max deduction for 80D (example for individual)
          break;
        default:
          limit = 0;
      }

      const eligibleAmount = Math.min(investmentAmount, limit);

      // Assuming 30% tax slab for simplicity
      const tax = eligibleAmount * 0.3;
      setTaxSavings(parseFloat(tax.toFixed(2)));
    } else {
      setTaxSavings(null);
    }
  }, [annualIncome, investmentAmount, section]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center">
        Tax Benefits Calculator
      </h3>

      <div className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Annual Income"
          type="number"
          value={annualIncome}
          onChange={(e) => setAnnualIncome(Number(e.target.value))}
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Investment Amount"
          type="number"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
        />

        <select
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={section}
          onChange={(e) => setSection(e.target.value as "80C" | "80D" | "")}
        >
          <option value="">Select Section</option>
          <option value="80C">80C</option>
          <option value="80D">80D</option>
        </select>
      </div>

      <div className="bg-green-50 p-4 rounded-lg text-center">
        {taxSavings !== null ? (
          <p className="text-xl font-semibold text-green-700">
            Estimated Tax Savings: ₹{taxSavings}
          </p>
        ) : (
          <p className="text-gray-500">Enter all values to calculate tax savings</p>
        )}
      </div>
    </div>
  );
};

export default TaxBenefitsCalculator;
