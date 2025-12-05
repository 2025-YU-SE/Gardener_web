import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Banner from "../components/main/Banner";
import MainTop3 from "../components/main/MainTop3";
import MainRankingList from "../components/main/MainRankingList";
import PopularDevPosts from "../components/main/PopularDevPosts";
import PopularCodingPosts from "../components/main/PopularCodingPosts";
import Loading from "../components/Loading";
import fetchMain from "../api/main.jsx";

function Main() {
  const [mainData, setMainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMain();
        if (!ignore) {
          setMainData(data);
          if (data?.userInfo?.userId) {
            localStorage.setItem(
              "loggedInUserId",
              String(data.userInfo.userId)
            );
            console.log(
              "Main: 로그인된 사용자 ID 저장 완료:",
              data.userInfo.userId
            );
          }
        }
      } catch (err) {
        console.error("메인 데이터 조회 실패:", err);
        if (!ignore) {
          setError("메인 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const userInfo = mainData?.userInfo;

  const bannerProps = userInfo
    ? {
        name: userInfo.userName,
        avatar: userInfo.userPicture,
        postCount: userInfo.postCount,
        totalFeedbackCount: userInfo.totalFeedbackCount,
        adoptedFeedbackCount: userInfo.adoptedFeedbackCount,
      }
    : {
        name: "",
        avatar: undefined,
        postCount: 0,
        totalFeedbackCount: 0,
        adoptedFeedbackCount: 0,
      };

  if (loading && !mainData) {
    return <Loading message="메인 데이터를 불러오는 중입니다..." />;
  }

  if (error && !mainData) {
    return (
      <div>
        <Header />
        <Banner {...bannerProps} />
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Banner {...bannerProps} />

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">명예의 전당</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {/* Top3 */}
          <div className="w-full flex justify-center lg:justify-start">
            <MainTop3 users={mainData?.topPointUsers || []} />
          </div>

          {/* 4~7등 리스트 */}
          <div className="w-full flex justify-center">
            <MainRankingList users={mainData?.topPointUsers || []} />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10">
          <PopularDevPosts posts={mainData?.popularDevPosts || []} />
        </div>
        <div className="mt-6 sm:mt-8 lg:mt-10">
          <PopularCodingPosts posts={mainData?.popularCodingTestPosts || []} />
        </div>
      </div>
    </div>
  );
}

export default Main;
