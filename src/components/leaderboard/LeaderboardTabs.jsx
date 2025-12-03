import React from "react";

const CRITERIA_MAP = {
  "누적 포인트": "points",
  "주간 피드백 채택 수": "weeklyadopted",
  "주간 피드백 등록 수": "weeklyfeedback",
};
const TABS = Object.keys(CRITERIA_MAP);

function LeaderboardTabs({ currentCriteria, onCriteriaChange }) {
  const handleClick = (tabName) => {
    const criteria = CRITERIA_MAP[tabName];
    if (onCriteriaChange && criteria) {
      onCriteriaChange(criteria);
    }
  };

  const activeTabName = TABS.find(
    (name) => CRITERIA_MAP[name] === currentCriteria
  );

  return (
    <div className="mt-8 w-full bg-white rounded-[10px] p-2 shadow-sm border border-[#E5E7EB]">
      <div className="bg-[#F3F4F6] p-1 rounded-[10px]">
        <div className="grid grid-cols-3 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleClick(tab)}
              className={[
                "h-10 rounded-[10px] text-[14px] font-medium transition-all",
                activeTabName === tab
                  ? "bg-white"
                  : "bg-transparent text-[#4D4D4D] hover:bg-[#eeeff0]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardTabs;
