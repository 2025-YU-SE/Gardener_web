import React from "react";

// 리더보드 통계 지표 카드 컴포넌트
function StatCard({ icon, value, unit, label }) {
  return (
    <div
      className="flex flex-col items-start justify-center 
    w-full 
    h-[120px] sm:h-[130px] lg:h-[138px] rounded-[10px] bg-white p-4 sm:p-5 lg:p-6 
    shadow-sm border border-[#E5E7EB]"
    >
      <img src={icon} alt="icon" className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] lg:w-[30px] lg:h-[30px] mb-2" />
      <div className="flex items-end gap-[2px]">
        <span className="text-lg sm:text-xl lg:text-[24px] font-medium">
          {value.toLocaleString()}
        </span>
        <span className="text-lg sm:text-xl lg:text-[24px] font-medium">{unit}</span>
      </div>
      <div className="mt-1 text-xs sm:text-[13px] lg:text-[14px] text-[#4D4D4D] whitespace-nowrap">{label}</div>
    </div>
  );
}

export default StatCard;
