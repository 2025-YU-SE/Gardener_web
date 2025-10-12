import React from "react";
import Header from "../components/header/Header";
import StatCard from "../components/leaderboard/StatCard";
import icon1 from "../assets/leaderboard_icon1.png";
import icon2 from "../assets/leaderboard_icon2.png";
import icon3 from "../assets/leaderboard_icon3.png";
import icon4 from "../assets/leaderboard_icon4.png";

function LeaderBoard() {
  // value값은 추후 연동해야함
  const stats = [
    { icon: icon1, value: 24, unit: "명", label: "이번 주 신규 가드너" },
    { icon: icon2, value: 127, unit: "%", label: "평균 성장률" },
    { icon: icon3, value: 15670, unit: "점", label: "이번 달 최고 기록" },
    { icon: icon4, value: 8.3, unit: "개", label: "평균 완료 과제" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mx-auto max-w-[1248px] mt-8">
        {/* 타이틀 + 소개 텍스트 */}
        <div className="text-center">
          <h1 className="text-[30px] font-semibold">리더보드</h1>
          <p className="mt-2 text-[14px] text-[#4D4D4D]">
            Code Gardener에서 가장 활발한 가드너들을 만나보세요
          </p>
        </div>

        {/* 지표 카드 4개 */}
        <div className="flex justify-between gap-3 mt-6 w-full">
          {stats.map((item, idx) => (
            <StatCard
              key={idx}
              icon={item.icon}
              value={item.value}
              unit={item.unit}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
