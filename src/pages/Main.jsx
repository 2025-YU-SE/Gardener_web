import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Banner from "../components/main/Banner";
import MainTop3 from "../components/main/MainTop3";
import MainRankingList from "../components/main/MainRankingList";
import PopularDevPosts from "../components/main/PopularDevPosts";
import PopularCodingPosts from "../components/main/PopularCodingPosts";
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
    return (
      <div>
        <Header />
        <Banner {...bannerProps} />
        <div className="max-w-[1080px] mx-auto px-4 mt-10">
          <p>메인 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error && !mainData) {
    return (
      <div>
        <Header />
        <Banner {...bannerProps} />
        <div className="max-w-[1080px] mx-auto px-4 mt-10">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Banner {...bannerProps} />

      <div className="max-w-[1080px] mx-auto px-4 mt-10">
        <h2 className="text-[20px] font-semibold mb-4">명예의 전당</h2>
        <div className="grid grid-cols-2 gap-5">
          {/* Top3 */}
          <div>
            <MainTop3 users={mainData?.topPointUsers || []} />
          </div>

          {/* 4~7등 리스트 */}
          <div className="flex justify-center">
            <MainRankingList users={mainData?.topPointUsers || []} />
          </div>
        </div>

        <PopularDevPosts posts={mainData?.popularDevPosts || []} />
        <PopularCodingPosts posts={mainData?.popularCodingTestPosts || []} />
      </div>
    </div>
  );
}

export default Main;
