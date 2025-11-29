import React, { useRef, useState, useEffect } from "react";
import Header from "../components/header/Header";
import baseProfile from "../assets/profile.png";
import { TbCoin, TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import PostCard from "../components/PostCard.jsx";
import FeedbackCard from "../components/FeedbackCard.jsx";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  getUserRecentPosts,
  getUserPosts,
  getUserRecentFeedbacks,
  getUserFeedbacks,
} from "../api/userApi";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";

// 날짜 포맷팅
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
};

function MyPaged() {
  const navigate = useNavigate();
  const currentUserId = 1;

  const [profile, setProfile] = useState({
    name: "Loading...",
    avatar: null,
    points: 0,
    selectRate: 0,
    postCount: 0,
    feedbackCount: 0,
    gradeLabel: "Loading",
  });

  const [myPosts, setMyPosts] = useState([]);
  const [hasFetchedAllPosts, setHasFetchedAllPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const INITIAL_COUNT = 4;
  const [myPostsDisplayCount, setMyPostsDisplayCount] = useState(INITIAL_COUNT);
  const [myFeedbackAll, setMyFeedbackAll] = useState([]);
  const [myFeedbackCount, setMyFeedbackCount] = useState(INITIAL_COUNT);
  const [hasFetchedAllFeedbacks, setHasFetchedAllFeedbacks] = useState(false);

  const postsRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 프로필 조회
        const profileRes = await getUserProfile(currentUserId);
        const pData = profileRes.data;

        // 피드백 채택률 계산
        const selectRate =
          pData.totalFeedbackCount > 0
            ? Math.round(
                (pData.adoptedFeedbackCount / pData.totalFeedbackCount) * 100
              )
            : 0;

        setProfile({
          name: pData.userName,
          avatar: pData.userPicture,
          points: pData.points,
          selectRate: selectRate,
          postCount: pData.postCount, // 총 게시글 수
          feedbackCount: pData.totalFeedbackCount, // 총 피드백 수
          gradeLabel: pData.grade,
        });

        // 최근 게시글 조회 (초기 4개 데이터)
        const postsRes = await getUserRecentPosts(currentUserId);
        const mappedPosts = postsRes.data.map((post) =>
          mapApiToPostData(post, pData)
        );
        setMyPosts(mappedPosts);

        // 최근 피드백 조회 (초기 4개 데이터)
        const feedbacksRes = await getUserRecentFeedbacks(currentUserId);
        setMyFeedbackAll(feedbacksRes.data);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const mapApiToPostData = (apiPost, profileData) => {
    return {
      id: apiPost.postId,
      title: apiPost.title,
      content: apiPost.content,
      languages: apiPost.languages
        ? apiPost.languages.split(",").map((s) => s.trim())
        : [],
      stacks: apiPost.stacks
        ? apiPost.stacks.split(",").map((s) => s.trim())
        : [],
      likes: apiPost.likesCount,
      comments: apiPost.feedbackCount,
      views: apiPost.views,
      timeAgo: formatTimeAgo(apiPost.createdAt),
      author: profileData.userName,
      avatar: profileData.userPicture,
      createdAt: apiPost.createdAt,
    };
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // 게시글 더보기 버튼 클릭 시 (전체/페이징 API 호출)
  const expandPosts = async () => {
    if (!hasFetchedAllPosts) {
      try {
        const res = await getUserPosts(currentUserId, 0, profile.postCount);
        const contentList = res.data.content || [];

        const allPostsMapped = contentList.map((post) =>
          mapApiToPostData(post, profile)
        );

        setMyPosts(allPostsMapped);
        setHasFetchedAllPosts(true);
        setMyPostsDisplayCount(allPostsMapped.length);
      } catch (e) {
        console.error("전체 게시글 로딩 실패", e);
      }
    } else {
      setMyPostsDisplayCount(myPosts.length);
    }
  };

  const collapsePosts = () => {
    setMyPostsDisplayCount(INITIAL_COUNT);
    postsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 피드백 더보기 버튼 클릭 시
  const expandFeedback = async () => {
    if (!hasFetchedAllFeedbacks) {
      try {
        const res = await getUserFeedbacks(
          currentUserId,
          0,
          profile.feedbackCount
        );
        const contentList = res.data.content || [];

        setMyFeedbackAll(contentList);
        setHasFetchedAllFeedbacks(true);
        setMyFeedbackCount(contentList.length);
      } catch (e) {
        console.error("전체 피드백 로딩 실패", e);
      }
    } else {
      setMyFeedbackCount(myFeedbackAll.length);
    }
  };

  const collapseFeedback = () => {
    setMyFeedbackCount(INITIAL_COUNT);
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const profileImgSrc = makeAbsoluteImageUrl(profile.avatar) || baseProfile;
  const isPostsExpanded = myPostsDisplayCount >= profile.postCount;
  const isFeedbackExpanded = myFeedbackCount >= profile.feedbackCount;

  const GradeDonut = ({ percent = 50, label = "등급" }) => {
    const size = 120;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (percent / 100) * c;

    return (
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#E5E7EB"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#10B981"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-semibold text-gray-800">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="rounded-[10px] border border-gray-200 bg-white px-10 py-5 shadow-sm">
          {/* 프로필 */}
          <div className="flex items-center gap-5 px-20 mb-10">
            <div className="h-full w-[132px] overflow-hidden rounded-[10px]">
              <img
                src={profileImgSrc}
                alt={`${profile.name} 프로필`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = baseProfile;
                }}
              />
            </div>
            <div className="flex-1 w-[825px] rounded-[10px] border border-[#ACACAC] bg-white pl-6 pr-3 py-4 flex items-center justify-between box-border overflow-hidden">
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-semibold mb-2">
                  {profile.name}
                </h2>
                <ul className="space-y-2 text-[14px]">
                  <Row
                    icon={<TbCoin className="text-[#4D4D4D]" size={18} />}
                    label="누적포인트"
                    value={profile.points.toLocaleString()}
                  />
                  <Row
                    icon={
                      <TbMessage2Check className="text-[#4D4D4D]" size={18} />
                    }
                    label="피드백 채택률"
                    value={`${profile.selectRate}%`}
                  />
                  <Row
                    icon={<TbPencil className="text-[#4D4D4D]" size={18} />}
                    label="등록한 게시물 수"
                    value={profile.postCount}
                  />
                  <Row
                    icon={<VscFeedback className="text-[#4D4D4D]" size={18} />}
                    label="등록한 피드백 수"
                    value={profile.feedbackCount}
                  />
                </ul>
              </div>
              <div className="shrink-0 ml-16 mr-5">
                <GradeDonut
                  percent={profile.selectRate}
                  label={profile.gradeLabel}
                />
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-5 px-1">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                activeTab === "posts"
                  ? "bg-[#00B834] text-white border-[#00B834]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              내 게시글 ({profile.postCount})
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                activeTab === "feedback"
                  ? "bg-[#00B834] text-white border-[#00B834]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              내 피드백 ({profile.feedbackCount})
            </button>
          </div>

          {/* 내 게시글 영역 */}
          {activeTab === "posts" && (
            <section ref={postsRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold ml-1">
                  내가 올린 게시글
                </h2>
              </div>
              {myPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myPosts.slice(0, myPostsDisplayCount).map((p) => (
                    <PostCard
                      key={`mypost-${p.id}`}
                      {...p}
                      avatar={makeAbsoluteImageUrl(p.avatar) || baseProfile}
                      badge="내 게시글"
                      rightPill={null}
                      onClick={() => handlePostClick(p.id)}
                    />
                  ))}
                </div>
              )}

              {/* 더보기/접기 버튼 */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {profile.postCount > INITIAL_COUNT && !isPostsExpanded && (
                  <button
                    onClick={expandPosts}
                    className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                  >
                    더보기
                  </button>
                )}
                {/* 전체 게시글이 표시되었을 때 */}
                {profile.postCount > INITIAL_COUNT && isPostsExpanded && (
                  <button
                    onClick={collapsePosts}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    접기
                  </button>
                )}
              </div>
            </section>
          )}

          {/* 내 피드백 영역 */}
          {activeTab === "feedback" && (
            <section ref={feedbackRef} className="mb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold ml-1">
                  내가 등록한 피드백
                </h2>
              </div>

              {myFeedbackAll.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  등록된 피드백이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myFeedbackAll.slice(0, myFeedbackCount).map((feedback) => (
                    <FeedbackCard
                      key={`myfb-${feedback.feedbackId}`}
                      feedback={feedback}
                      userName={profile.name}
                      userAvatar={profileImgSrc}
                      // 클릭 시 해당 피드백이 달린 게시글로 이동
                      onClick={() => handlePostClick(feedback.postId)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                {profile.feedbackCount > INITIAL_COUNT &&
                  !isFeedbackExpanded && (
                    <button
                      onClick={expandFeedback}
                      className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                    >
                      더보기
                    </button>
                  )}
                {/* 전체 피드백이 표시되었을 때 */}
                {profile.feedbackCount > INITIAL_COUNT &&
                  isFeedbackExpanded && (
                    <button
                      onClick={collapseFeedback}
                      className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      접기
                    </button>
                  )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-800">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </li>
  );
}

export default MyPaged;
