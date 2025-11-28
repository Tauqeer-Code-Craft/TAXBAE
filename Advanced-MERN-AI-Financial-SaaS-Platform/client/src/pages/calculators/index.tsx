import PageLayout from "@/components/page-layout";
import { useState } from "react";
import { DateRangeType } from "@/components/date-range-select";

import CalculatorSummary from "./calculator-summary";

import EMICalculator from "./_component/EMICalculator";
import SIPCalculator from "./_component/SIPCalculator";
import RentVsBuyCalculator from "./_component/RentVsBuyCalculator";
import GoalPlannerCalculator from "./_component/goal-planner-calculator";
import TaxBenefitsCalculator from "./_component/tax-benefits-calculator";
import RetirementPlanningCalculator from "./_component/retirement-planning";

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
        {/* Just render the active calculator as a single-section page */}
        <div className="w-full max-w-10xl mx-auto">
          {activeCalculator === "emi" && <EMICalculator />}
          {activeCalculator === "sip" && <SIPCalculator />}
          {activeCalculator === "rent-vs-buy" && <RentVsBuyCalculator />}
          {activeCalculator === "goal" && <GoalPlannerCalculator />}
          {activeCalculator === "tax" && <TaxBenefitsCalculator />}
          {activeCalculator === "retirement" && <RetirementPlanningCalculator />}
        </div>
      </PageLayout>
    </div>
  );
};

export default Calculators;
