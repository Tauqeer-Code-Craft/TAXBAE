const CalculatorSummary = ({
  activeCalculator,
  setActiveCalculator,
  dateRange,
  setDateRange,
}) => {
  const calculators = [
    { id: "emi", label: "EMI" },
    { id: "sip", label: "SIP" },
    { id: "rent-vs-buy", label: "Rent vs Buy" },
    { id: "goal", label: "Goal Planner" },
    { id: "tax", label: "Tax Benefits" },
    { id: "retirement", label: "Retirement Planning" }, // Added
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-3">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`px-4 py-2 rounded-lg border transition duration-200 text-sm font-semibold
              ${
                activeCalculator === calc.id
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
          >
            {calc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorSummary;
