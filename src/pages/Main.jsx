import React from "react";
import Header from "../components/header/Header";
import Banner from "../components/Banner";
import MainTop3 from "../components/main/MainTop3";
import MainRankingList from "../components/main/MainRankingList";

function Main() {
  return (
    <div>
      <Header />
      <Banner />

      <div className="max-w-[1080px] mx-auto px-4 mt-10">
        <h2 className="text-[20px] font-semibold mb-4">명예의 전당</h2>
        <div className="grid grid-cols-2 gap-5">
          {/* Top3 */}
          <div>
            <MainTop3 />
          </div>

          {/* 4~7등 리스트 */}
          <div className="flex justify-center">
            <MainRankingList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
