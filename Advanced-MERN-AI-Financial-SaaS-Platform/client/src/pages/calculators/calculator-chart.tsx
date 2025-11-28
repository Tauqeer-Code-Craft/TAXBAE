const CalculatorChart = ({ calculator, dateRange }) => {
  return (
    <div className="w-full h-80 bg-white shadow rounded-xl flex items-center justify-center">
      <p className="text-gray-500">
        Chart for: <strong>{calculator.toUpperCase()}</strong>
      </p>
    </div>
  );
};

export default CalculatorChart;
