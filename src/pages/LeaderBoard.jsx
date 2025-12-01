import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import StatCard from "../components/leaderboard/StatCard";
import LeaderboardTabs from "../components/leaderboard/LeaderboardTabs";
import icon1 from "../assets/leaderboard_icon1.png";
import icon2 from "../assets/leaderboard_icon2.png";
import icon3 from "../assets/leaderboard_icon3.png";
import RankingBoard from "../components/leaderboard/RankingBoard.jsx";
import {
  getTop3Leaders,
  getFullLeaders,
  getWeeklyFeedbackCount,
} from "../api/leaderboardApi";

function LeaderBoard() {
  const PAGE_SIZE = 10; // 한 페이지당 가져올 데이터 수
  const [top3Leaders, setTop3Leaders] = useState([]);
  const [fullLeaders, setFullLeaders] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({
    totalPages: 1,
    totalElements: 0,
    currentPage: 0,
    isLast: true,
  });
  const [loading, setLoading] = useState(true);
  const [currentCriteria, setCurrentCriteria] = useState("points");

  // 이번 주 피드백 수
  const [weeklyFeedbackCount, setWeeklyFeedbackCount] = useState(0);

  // 상단 통계 카드 데이터
  const stats = [
    { icon: icon1, value: 24, unit: "명", label: "이번 주 신규 가드너" },
    { icon: icon2, value: 127, unit: "개", label: "이번 주 게시글 수" },
    {
      icon: icon3,
      value: weeklyFeedbackCount ?? 0,
      unit: "개",
      label: "이번 주 피드백 수",
    },
  ];

  // 이번 주 피드백 수 로딩
  const fetchWeeklyFeedback = async () => {
    try {
      const count = await getWeeklyFeedbackCount();
      setWeeklyFeedbackCount(Number(count) || 0);
    } catch (error) {
      console.error("Failed to fetch weekly feedback count:", error);
      setWeeklyFeedbackCount(0);
    }
  };

  // 상위 3명 데이터 로딩 함수
  const fetchTop3Leaders = async (criteria) => {
    try {
      const data = await getTop3Leaders(criteria);
      setTop3Leaders(data);
    } catch (error) {
      console.error("Failed to fetch top 3 leaders:", error);
      setTop3Leaders([]);
    }
  };

  // 전체 순위 데이터 로딩 함수
  const fetchFullLeaders = async (criteria, page) => {
    if (page === 0) setLoading(true);

    try {
      const response = await getFullLeaders(criteria, page, PAGE_SIZE);
      const newLeaders = response.content.slice(page === 0 ? 3 : 0);

      setFullLeaders((prev) =>
        page === 0 ? newLeaders : [...prev, ...newLeaders]
      );

      setPagingInfo({
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        isLast: response.last,
      });
    } catch (error) {
      console.error("Failed to fetch full leaders:", error);
    } finally {
      if (page === 0) setLoading(false);
    }
  };

  const handleCriteriaChange = (criteria) => {
    setCurrentCriteria(criteria);
    fetchTop3Leaders(criteria);
    fetchFullLeaders(criteria, 0);
  };

  //  더보기 버튼 핸들러
  const handleLoadMore = () => {
    if (!pagingInfo.isLast) {
      fetchFullLeaders(currentCriteria, pagingInfo.currentPage + 1);
    }
  };

  // 접기 버튼 핸들러
  const handleCollapse = () => {
    const DEFAULT_DISPLAY_COUNT = PAGE_SIZE - 3;
    const firstPageLeaders = fullLeaders.slice(0, DEFAULT_DISPLAY_COUNT);

    setFullLeaders(firstPageLeaders);
    setPagingInfo((prev) => ({
      ...prev,
      currentPage: 0,
      isLast: prev.totalElements <= PAGE_SIZE,
    }));
  };

  useEffect(() => {
    fetchTop3Leaders(currentCriteria);
    fetchFullLeaders(currentCriteria, 0);
    fetchWeeklyFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mt-8">
        {/* 타이틀 + 소개 텍스트 */}
        <div className="text-center">
          <h1 className="text-[30px] font-semibold">리더보드</h1>
          <p className="mt-2 text-[14px] text-[#4D4D4D]">
            Code Gardener에서 가장 활발한 가드너들을 만나보세요
          </p>
        </div>

        <div className="mx-auto max-w-[1080px] w-full">
          {/* 지표 카드 3개 */}
          <div className="mt-8 mx-auto max-w-[900px] grid grid-cols-3 gap-5 place-items-center">
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

          {/* 정렬 탭 */}
          <LeaderboardTabs
            currentCriteria={currentCriteria}
            onCriteriaChange={handleCriteriaChange}
          />

          {/* 랭킹보드 */}
          <RankingBoard
            leaders={top3Leaders}
            loading={loading}
            fullLeaders={fullLeaders}
            totalElements={pagingInfo.totalElements}
            isLast={pagingInfo.isLast}
            onLoadMore={handleLoadMore}
            onCollapse={handleCollapse}
          />

          {/* Footer */}
          <div className="w-full flex justify-center my-8">
            <div className="w-full max-w-[1248px] px-8 py-8 rounded-[10px] bg-gradient-to-r from-[#F0FDF4] to-[#EFF6FF] border border-[#E5E7EB] text-center shadow-sm">
              <div className="flex justify-center items-center gap-2 mb-1">
                <span className="text-[15px] font-medium text-[#4D4D4D]">
                  🌱 함께 성장하는
                  <span className="text-[#65C676]"> Code Gardener </span>
                  커뮤니티
                </span>
              </div>
              <p className="text-[12px] text-[#4A5565]">
                총 {pagingInfo.totalElements}명의 개발자가 함께 코드를 키우고
                있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
