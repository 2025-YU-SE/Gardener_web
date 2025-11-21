import React from "react";
import { TbCoin } from "react-icons/tb";
import profile from "../../assets/profile.png";

function SmallTopCard({ rank, name, score, profileImage, tone = "neutral" }) {
  const toneMap = {
    gold: "bg-[#FEF9C3] border-[#FACC15]",
    silver: "bg-[#F3F4F6] border-[#D1D5DB]",
    bronze: "bg-[#FFE4D6] border-[#FDBA74]",
  };

  return (
    <div
      className={`w-[160px] h-[160px] p-3 flex flex-col items-center justify-center 
      rounded-xl shadow-sm border ${toneMap[tone]}`}
    >
      {/* 등수 */}
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/70 text-[11px] font-bold border border-black/10">
        {rank}
      </div>

      {/* 프로필 */}
      <div className="mt-3 w-12 h-12 rounded-full bg-white/50 flex items-center justify-center border border-black/10 overflow-hidden">
        <img
          src={profileImage || profile}
          alt={`${name} profile`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 이름 + 포인트 */}
      <div className="mt-2 text-center">
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="flex items-center justify-center gap-1 text-[12px] text-[#4D4D4D] mt-1">
          <TbCoin size={12} />
          {Number(score || 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function MainTop3() {
  // 임시 데이터
  const ranking = [
    { rank: 1, name: "DuuGanadi", score: 12345, profileImage: profile },
    { rank: 2, name: "Ddabong", score: 9000, profileImage: profile },
    { rank: 3, name: "huup", score: 7000, profileImage: profile },
  ];

  const first = ranking[0];
  const second = ranking[1];
  const third = ranking[2];

  return (
    <div className="mt-10">
      <div className="flex items-end justify-center gap-3">
        <div className="translate-y-1">
          <SmallTopCard {...second} tone="silver" />
        </div>
        <div className="-translate-y-2">
          <SmallTopCard {...first} tone="gold" />
        </div>
        <div className="translate-y-1">
          <SmallTopCard {...third} tone="bronze" />
        </div>
      </div>
    </div>
  );
}
