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
  ];

  return (
    <div className="flex flex-col space-y-4">
      {/* Buttons to switch calculators */}
      <div className="flex flex-wrap gap-4">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`px-4 py-2 rounded-lg border ${
              activeCalculator === calc.id
                ? "bg-primary text-white"
                : "bg-muted text-gray-700"
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
