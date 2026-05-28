"use client";

import { useDashboard } from "@/lib/filters";
import { PrimaryChart } from "./PrimaryChart";
import { SecondaryWidget } from "./SecondaryWidget";

export function MainContentRow() {
  const { activeSection } = useDashboard();
  const isOverview = activeSection === "overview";

  return (
    <div className={isOverview ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5 min-h-[600px] sm:min-h-[650px]" : "grid grid-cols-1 gap-4 sm:gap-5 min-h-[550px] sm:min-h-[600px]"}>
      <div className={isOverview ? "md:col-span-1 xl:col-span-3 min-h-[450px] sm:min-h-[500px]" : "min-h-[450px] sm:min-h-[500px]"}>
        <PrimaryChart />
      </div>
      {isOverview && (
        <div className="md:col-span-1 xl:col-span-2 min-h-[450px] sm:min-h-[500px]">
          <SecondaryWidget />
        </div>
      )}
    </div>
  );
}
