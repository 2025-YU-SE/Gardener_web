import React from "react";
import { TbCoin } from "react-icons/tb";
import profile from "../../assets/profile.png";

export default function MainRankingList() {
  // 임시 데이터
  const list = [
    { rank: 4, name: "DuuGanadi", score: 12345, profileImage: profile },
    { rank: 5, name: "DuuGanadi", score: 12345, profileImage: profile },
    { rank: 6, name: "DuuGanadi", score: 12345, profileImage: profile },
    { rank: 7, name: "DuuGanadi", score: 12345, profileImage: profile },
  ];

  return (
    <div className="space-y-3">
      {list.map((item) => (
        <div
          key={item.rank}
          className="w-[400px] min-w-[260px] px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-between"
        >
          {/* 왼쪽 영역 */}
          <div className="flex items-center gap-3">
            {/* 랭크 */}
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F4F6] text-[#374151] text-[12px] font-bold">
              {item.rank}
            </span>

            {/* 프로필 + 이름 */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden">
                <img
                  src={item.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[13px] font-semibold">{item.name}</span>
            </div>
          </div>

          {/* 오른쪽 점수 */}
          <div className="flex items-center gap-1 text-[12px] text-[#4D4D4D]">
            <TbCoin size={12} />
            {item.score.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
