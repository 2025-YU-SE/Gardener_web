import React, { useState } from "react";

// 리더보드 정렬 탭 컴포넌트
function LeaderboardTabs() {
  const TABS = ["누적 포인트", "주간 피드백 채택 수", "주간 피드백 등록 수"];
  const [active, setActive] = useState(TABS[0]);

  return (
    <div className="mt-8 w-full bg-white rounded-[10px] p-2 shadow-sm border border-[#E5E7EB]">
      <div className="bg-[#F3F4F6] p-1 rounded-[10px]">
        <div className="grid grid-cols-3 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={[
                "h-10 rounded-[10px] text-[14px] font-medium transition-all",
                active === tab
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
