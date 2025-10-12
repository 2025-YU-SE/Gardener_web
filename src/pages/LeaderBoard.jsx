import React from "react";
import Header from "../components/header/Header";

function LeaderBoard() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div>
        {/* 타이틀 + 소개 텍스트 */}
        <div className="text-center mt-8">
          <h1 className="text-[30px] font-semibold">리더보드</h1>
          <p className="mt-2 text-[14px] text-[#4D4D4D]">
            Code Gardener에서 가장 활발한 가드너들을 만나보세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
