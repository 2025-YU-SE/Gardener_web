import React from "react";

function StatCard({ icon, value, unit, label }) {
  return (
    <div className="flex flex-col items-start justify-center w-[300px] h-[138px] rounded-[10px] bg-white p-6 shadow-sm border border-[#E5E7EB]">
      <img src={icon} alt="icon" className="w-[30px] h-[30px] mb-2" />
      <div className="flex items-end gap-[2px]">
        <span className="text-[24px] font-medium">
          {value.toLocaleString()}
        </span>
        <span className="text-[24px] font-medium">{unit}</span>
      </div>
      <div className="mt-1 text-[14px] text-[#4D4D4D]">{label}</div>
    </div>
  );
}

export default StatCard;
