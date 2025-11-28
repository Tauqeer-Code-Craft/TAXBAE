import PageLayout from "@/components/page-layout";
import { useState } from "react";
import { DateRangeType } from "@/components/date-range-select";

import CalculatorSummary from "./calculator-summary";
import CalculatorChart from "./calculator-chart";

import EMICalculator from "./_component/EMICalculator";
import SIPCalculator from "./_component/SIPCalculator";
import RentVsBuyCalculator from "./_component/RentVsBuyCalculator";
import GoalPlannerCalculator from "./_component/goal-planner-calculator";
import TaxBenefitsCalculator from "./_component/tax-benefits-calculator";

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState("emi");
  const [dateRange, _setDateRange] = useState<DateRangeType>(null);

  return (
    <div className="w-full flex flex-col">
      <PageLayout
        className="space-y-6"
        renderPageHeader={
          <CalculatorSummary
            activeCalculator={activeCalculator}
            setActiveCalculator={setActiveCalculator}
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
      >
        {/* Main Section (Chart + Calculator Input) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">

          {/* Left — Chart */}
          <div className="lg:col-span-4">
            <CalculatorChart calculator={activeCalculator} dateRange={dateRange} />
          </div>

          {/* Right — Calculator Form */}
          <div className="lg:col-span-2">
            {activeCalculator === "emi" && <EMICalculator />}
            {activeCalculator === "sip" && <SIPCalculator />}
            {activeCalculator === "rent-vs-buy" && <RentVsBuyCalculator />}
            {activeCalculator === "goal" && <GoalPlannerCalculator />}
            {activeCalculator === "tax" && <TaxBenefitsCalculator />}
          </div>

        </div>
      </PageLayout>
    </div>
  );
};

export default Calculators;
