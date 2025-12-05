import React, { useRef, useState, useEffect } from "react";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import baseProfile from "../assets/baseProfile.png";
import { TbCoin, TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import FeedbackCard from "../components/FeedbackCard.jsx";
import {
  getUserProfile,
  getUserRecentPosts,
  getUserPosts,
  getUserRecentFeedbacks,
  getUserFeedbacks,
  getUserRecentScraps,
  getUserScraps,
  updateProfilePicture,
  deleteProfilePicture,
} from "../api/userApi";
import { likePost, bookmarkPost } from "../api/postApi";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";

// 날짜 포맷팅 함수
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
  const { userId: urlUserId } = useParams();

  // 로그인 ID 추출
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const isLoggedIn = !!loggedInUserId;

  // 조회 대상 ID 결정
  const targetUserId = urlUserId ? urlUserId : loggedInUserId;

  // 본인 프로필 여부 결정
  const isMyProfile =
    isLoggedIn &&
    (!urlUserId || (urlUserId && targetUserId === loggedInUserId));

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "Loading...",
    avatar: null,
    points: 0,
    selectRate: 0,
    postCount: 0,
    feedbackCount: 0,
    scrapCount: 0,
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

  const [myScraps, setMyScraps] = useState([]);
  const [myScrapsCount, setMyScrapsCount] = useState(INITIAL_COUNT);
  const [hasFetchedAllScraps, setHasFetchedAllScraps] = useState(false);

  const postsRef = useRef(null);
  const feedbackRef = useRef(null);
  const scrapsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 로그인 확인 및 리다이렉션
    if (!urlUserId && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in");
      return;
    }
    if (!targetUserId) {
      console.error(
        "조회할 사용자 ID가 유효하지 않아 데이터 로딩을 중단합니다."
      );
      return;
    }

    // 타인 프로필을 볼 때 스크랩 탭이 선택되어 있다면 게시글 탭으로 초기화
    if (!isMyProfile && activeTab === "scraps") {
      setActiveTab("posts");
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await getUserProfile(targetUserId);
        const pData = profileRes.data;

        // 피드백 채택률 계산
        const selectRate =
          pData.totalFeedbackCount > 0
            ? Math.round(
                (pData.adoptedFeedbackCount / pData.totalFeedbackCount) * 100
              )
            : 0;

        // 스크랩
        let scrapCount = 0;
        if (isMyProfile) {
          // 최근 스크랩 4개
          const recentScrapsRes = await getUserRecentScraps(targetUserId);
          const mappedScraps = recentScrapsRes.data.map((post) =>
            mapApiToPostData(post, pData)
          );
          setMyScraps(mappedScraps);

          // 전체 스크랩 개수
          try {
            const scrapPageRes = await getUserScraps(targetUserId, 0, 1);
            const total = scrapPageRes?.data?.totalElements;
            scrapCount =
              typeof total === "number" ? total : mappedScraps.length;
          } catch (e) {
            console.error("스크랩 개수 조회 실패:", e);
            scrapCount = mappedScraps.length;
          }
        } else {
          setMyScraps([]);
        }

        setProfile({
          name: pData.userName,
          avatar: pData.userPicture,
          points: pData.points,
          selectRate: selectRate,
          postCount: pData.postCount,
          feedbackCount: pData.totalFeedbackCount,
          scrapCount: isMyProfile ? scrapCount : 0,
          gradeLabel: pData.grade,
        });

        // 최근 게시글 조회
        const postsRes = await getUserRecentPosts(targetUserId);
        const mappedPosts = postsRes.data.map((post) =>
          mapApiToPostData(post, pData)
        );
        setMyPosts(mappedPosts);

        // 최근 피드백 조회
        const feedbacksRes = await getUserRecentFeedbacks(targetUserId);
        setMyFeedbackAll(feedbacksRes.data);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        alert("프로필 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    targetUserId,
    loggedInUserId,
    navigate,
    urlUserId,
    activeTab,
    isMyProfile,
  ]);

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
      liked: apiPost.liked ?? false,
      scrapped: apiPost.scrapped ?? false,
      scrapCount: apiPost.scrapCount ?? 0,
    };
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // 게시글 좋아요
  const handleTogglePostLike = async (postId) => {
    setMyPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.liked;
        const nextLikes = Math.max(0, p.likes + (nextLiked ? 1 : -1));
        return { ...p, liked: nextLiked, likes: nextLikes };
      })
    );

    setMyScraps((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.liked;
        const nextLikes = Math.max(0, p.likes + (nextLiked ? 1 : -1));
        return { ...p, liked: nextLiked, likes: nextLikes };
      })
    );

    try {
      await likePost(postId);
    } catch (error) {
      console.error("게시글 좋아요 API 호출 실패:", error);
    }
  };

  // 게시글 스크랩
  const handleTogglePostBookmark = async (postId) => {
    const current =
      myPosts.find((p) => p.id === postId) ||
      myScraps.find((p) => p.id === postId);
    const wasScrapped = current?.scrapped ?? false;
    const willScrap = !wasScrapped;

    // 내 게시글 목록에 스크랩 상태 반영
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, scrapped: willScrap } : p))
    );

    // 내 스크랩 목록에 반영
    setMyScraps((prev) => {
      if (willScrap) {
        // 새로 스크랩한 경우
        if (prev.some((p) => p.id === postId)) {
          // 이미 목록에 있으면 상태만 맞춰줌
          return prev.map((p) =>
            p.id === postId ? { ...p, scrapped: true } : p
          );
        }

        // 목록에 없다면 myPosts / current 에서 기반 데이터 찾아서 추가
        const base =
          current ||
          myPosts.find((p) => p.id === postId) ||
          prev.find((p) => p.id === postId);

        if (!base) return prev;
        // 새로 스크랩한 글을 맨 위에 추가
        return [{ ...base, scrapped: true }, ...prev];
      }

      // 스크랩 해제 -> 해당 카드 제거 (스크랩 탭에서 바로 사라짐)
      return prev.filter((p) => p.id !== postId);
    });

    // 프로필의 스크랩 개수 즉시 반영
    setProfile((prev) => {
      const next = Math.max(0, (prev.scrapCount || 0) + (willScrap ? 1 : -1));
      return { ...prev, scrapCount: next };
    });

    setMyScrapsCount((prev) => Math.max(0, prev + (willScrap ? 1 : -1)));
    try {
      await bookmarkPost(postId);
    } catch (error) {
      console.error("게시글 스크랩 API 호출 실패:", error);
    }
  };

  // 파일 업로드
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      const newImagePath = await updateProfilePicture(file);
      setProfile((prev) => ({
        ...prev,
        avatar: newImagePath,
      }));

      alert("프로필 사진이 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("프로필 사진 업로드 실패:", error);
      alert("프로필 사진 변경에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      event.target.value = null;
    }
  };

  // 프로필 사진 삭제
  const handleDeleteProfilePicture = async () => {
    if (!profile.avatar) {
      alert("삭제할 프로필 사진이 없습니다.");
      return;
    }

    const confirmed = window.confirm(
      "프로필 사진을 삭제하고 기본 이미지로 되돌리시겠습니까?"
    );
    if (!confirmed) return;

    try {
      await deleteProfilePicture();
      setProfile((prev) => ({
        ...prev,
        avatar: null,
      }));
      alert("프로필 사진이 삭제되었습니다.");
    } catch (error) {
      console.error("프로필 사진 삭제 실패:", error);
      alert("프로필 사진 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 게시글 더보기 버튼 클릭 시 (전체/페이징 API 호출)
  const expandPosts = async () => {
    if (!hasFetchedAllPosts) {
      try {
        const res = await getUserPosts(targetUserId, 0, profile.postCount);
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
          targetUserId,
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

  // 스크랩 더보기 버튼 클릭 시
  const expandScraps = async () => {
    if (!isMyProfile) return;

    if (!hasFetchedAllScraps) {
      try {
        //전체 스크랩 목록 조회
        const res = await getUserScraps(targetUserId, 0, profile.scrapCount);
        const contentList = res.data.content || [];
        const allScrapsMapped = contentList.map((post) =>
          mapApiToPostData(post, profile)
        );

        setMyScraps(allScrapsMapped);
        setHasFetchedAllScraps(true);
        setMyScrapsCount(allScrapsMapped.length);
      } catch (e) {
        console.error("전체 스크랩 로딩 실패", e);
      }
    } else {
      setMyScrapsCount(myScraps.length);
    }
  };

  const collapseScraps = () => {
    setMyScrapsCount(INITIAL_COUNT);
    scrapsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return <Loading message="프로필을 불러오는 중입니다..." />;
  }

  const profileImgSrc = makeAbsoluteImageUrl(profile.avatar) || baseProfile;
  const isPostsExpanded = myPostsDisplayCount >= profile.postCount;
  const isFeedbackExpanded = myFeedbackCount >= profile.feedbackCount;
  const isScrapsExpanded = myScrapsCount >= profile.scrapCount;

  // 등급별 도넛 채움 비율 매핑
  const getGradeFillPercent = (grade) => {
    switch (grade) {
      case "숲의 현자":
        return 100;
      case "나무 개발자":
        return 75;
      case "잎새 개발자":
        return 50;
      case "새싹 개발자":
      default:
        return 25;
    }
  };

  const GradeDonut = ({ label = "등급" }) => {
    const size = 120;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const percent = getGradeFillPercent(label);
    const dash = (percent / 100) * c;

    return (
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px]">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
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
          <span className="text-[10px] sm:text-xs md:text-[13px] font-semibold text-gray-800 text-center px-1">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-[10px] border border-gray-200 bg-white px-4 sm:px-6 lg:px-10 py-4 sm:py-5 shadow-sm">
          {/* 프로필 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 px-0 sm:px-4 lg:px-20 mb-6 sm:mb-10">
            {/* 프로필 이미지 영역 */}
            <div
              className={`h-auto w-full max-w-[132px] sm:w-[132px] sm:h-[132px] mx-auto sm:mx-0 relative ${
                isMyProfile ? "cursor-pointer" : ""
              }`}
              onClick={() => isMyProfile && fileInputRef.current?.click()}
            >
              <div
                className={`h-full w-full aspect-square overflow-hidden rounded-[10px] ${
                  isMyProfile ? "group" : ""
                }`}
              >
                {/* 이미지 태그 */}
                <img
                  src={profileImgSrc}
                  alt={`${profile.name} 프로필`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = baseProfile;
                  }}
                />
                {isMyProfile && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TbPencil size={24} className="text-white" />
                  </div>
                )}
              </div>

              {/* 삭제 버튼 */}
              {isMyProfile && profile.avatar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfilePicture();
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[12px] flex items-center justify-center hover:bg-black"
                >
                  ×
                </button>
              )}
              {isMyProfile && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              )}
            </div>

            <div className="flex-1 w-full sm:w-auto rounded-[10px] border border-[#ACACAC] bg-white pl-4 sm:pl-6 pr-3 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between box-border overflow-hidden gap-4">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h2 className="text-lg sm:text-[22px] font-semibold mb-2">
                  {profile.name}
                </h2>
                <ul className="space-y-2 text-sm sm:text-[14px]">
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
              <div className="shrink-0 mx-auto sm:ml-8 lg:ml-16 sm:mr-5">
                <GradeDonut label={profile.gradeLabel} />
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-4 sm:mb-5 px-1 flex-wrap">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                activeTab === "posts"
                  ? "bg-[#00B834] text-white border-[#00B834]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              게시글 ({profile.postCount})
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                activeTab === "feedback"
                  ? "bg-[#00B834] text-white border-[#00B834]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              피드백 ({profile.feedbackCount})
            </button>

            {isMyProfile && (
              <button
                onClick={() => setActiveTab("scraps")}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  activeTab === "scraps"
                    ? "bg-[#00B834] text-white border-[#00B834]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                스크랩 ({profile.scrapCount})
              </button>
            )}
          </div>

          {/* 내 게시글 영역 */}
          {activeTab === "posts" && (
            <section ref={postsRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold ml-1">
                  {isMyProfile
                    ? "내가 올린 게시글"
                    : `${profile.name} 님의 게시글`}
                </h2>
              </div>
              {myPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {myPosts.slice(0, myPostsDisplayCount).map((p) => (
                    <PostCard
                      key={`mypost-${p.id}`}
                      avatar={makeAbsoluteImageUrl(p.avatar) || baseProfile}
                      author={p.author}
                      timeAgo={p.timeAgo}
                      title={p.title}
                      content={p.content}
                      languages={p.languages}
                      stacks={p.stacks}
                      likes={p.likes}
                      comments={p.comments}
                      views={p.views}
                      isLiked={p.liked}
                      isBookmarked={p.scrapped}
                      badge={isMyProfile ? "내 게시글" : null}
                      rightPill={null}
                      onClick={() => handlePostClick(p.id)}
                      onLike={() => handleTogglePostLike(p.id)}
                      onBookmark={() => handleTogglePostBookmark(p.id)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                {profile.postCount > INITIAL_COUNT && !isPostsExpanded && (
                  <button
                    onClick={expandPosts}
                    className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                  >
                    더보기
                  </button>
                )}
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
                  {isMyProfile
                    ? "내가 등록한 피드백"
                    : `${profile.name} 님의 피드백`}
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

          {/* 내 스크랩 영역 (본인에게만 표시) */}
          {activeTab === "scraps" && isMyProfile && (
            <section ref={scrapsRef} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold ml-1">
                  내가 스크랩한 게시글
                </h2>
              </div>
              {myScraps.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  스크랩한 게시글이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myScraps.slice(0, myScrapsCount).map((p) => (
                    <PostCard
                      key={`myscrap-${p.id}`}
                      avatar={makeAbsoluteImageUrl(p.avatar) || baseProfile}
                      author={p.author}
                      timeAgo={p.timeAgo}
                      title={p.title}
                      content={p.content}
                      languages={p.languages}
                      stacks={p.stacks}
                      likes={p.likes}
                      comments={p.comments}
                      views={p.views}
                      isLiked={p.liked}
                      isBookmarked={p.scrapped}
                      badge="스크랩"
                      rightPill={null}
                      onClick={() => handlePostClick(p.id)}
                      onLike={() => handleTogglePostLike(p.id)}
                      onBookmark={() => handleTogglePostBookmark(p.id)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                {profile.scrapCount > INITIAL_COUNT && !isScrapsExpanded && (
                  <button
                    onClick={expandScraps}
                    className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                  >
                    더보기
                  </button>
                )}
                {profile.scrapCount > INITIAL_COUNT && isScrapsExpanded && (
                  <button
                    onClick={collapseScraps}
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
