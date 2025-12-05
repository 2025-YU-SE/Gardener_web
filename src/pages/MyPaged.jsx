import React, { useRef, useState, useEffect } from "react";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import baseProfile from "../assets/baseProfile.png";
import { TbCoin, TbMessage2Check, TbPencil } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  deleteMyAccount,
} from "../api/userApi";
import { likePost, bookmarkPost } from "../api/postApi";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";
import { getCurrentUsername } from "../utils/jwtHelper";

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
  const location = useLocation();
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

  // API → 화면용 포스트 데이터 변환
  const mapApiToPostData = (apiPost) => {
    const username = getCurrentUsername();
    const likedKey = username
      ? `postLiked:${username}:${apiPost.postId}`
      : null;
    const scrapKey = username
      ? `postScrapped:${username}:${apiPost.postId}`
      : null;

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

      // ✅ 작성자는 항상 글 쓴 사람 기준으로
      author: apiPost.userName,
      avatar: apiPost.userPicture,

      createdAt: apiPost.createdAt,

      // ✅ 서버 필드가 있으면 우선, 없으면 localStorage 기준
      liked:
        apiPost.liked ??
        (likedKey ? localStorage.getItem(likedKey) === "true" : false),

      scrapped:
        apiPost.scrapped ??
        (scrapKey ? localStorage.getItem(scrapKey) === "true" : false),

      scrapCount: apiPost.scrapCount ?? 0,
    };
  };

  useEffect(() => {
    // 로그인 확인 및 리다이렉트
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

    // 타인 프로필인데 스크랩 탭이면 게시글 탭으로
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
        let mappedScraps = [];
        if (isMyProfile) {
          // 최근 스크랩 4개
          const recentScrapsRes = await getUserRecentScraps(targetUserId);
          mappedScraps = recentScrapsRes.data.map((post) =>
            mapApiToPostData(post, pData)
          );

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
        }

        // 최근 게시글 조회
        const postsRes = await getUserRecentPosts(targetUserId);
        const mappedPosts = postsRes.data.map((post) =>
          mapApiToPostData(post, pData)
        );

        const username = getCurrentUsername();
        if (username) {
          const syncLocalFromPosts = (items) => {
            items.forEach((post) => {
              const likedKey = `postLiked:${username}:${post.id}`;
              const scrapKey = `postScrapped:${username}:${post.id}`;

              if (post.liked) localStorage.setItem(likedKey, "true");
              else localStorage.removeItem(likedKey);

              if (post.scrapped) localStorage.setItem(scrapKey, "true");
              else localStorage.removeItem(scrapKey);
            });
          };

          syncLocalFromPosts(mappedPosts);
          if (isMyProfile) {
            syncLocalFromPosts(mappedScraps);
          }
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

        setMyPosts(mappedPosts);
        setMyScraps(isMyProfile ? mappedScraps : []);

        // 최근 피드백 조회
        const feedbacksRes = await getUserRecentFeedbacks(targetUserId);
        setMyFeedbackAll(feedbacksRes.data);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          alert("로그인이 필요합니다.");
          navigate("/sign-in", {
            state: { from: location.pathname + location.search },
          });
        } else {
          alert("프로필 데이터를 불러오는 데 실패했습니다.");
        }
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
    isLoggedIn,
    location.pathname,
    location.search,
  ]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // 게시글 좋아요
  const handleTogglePostLike = async (postId) => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in");
      return;
    }

    const username = getCurrentUsername();
    const likedKey = username ? `postLiked:${username}:${postId}` : null;
    const wasLiked = likedKey && localStorage.getItem(likedKey) === "true";

    const willLike = !wasLiked;

    const updateOne = (p) => {
      if (p.id !== postId) return p;
      const nextLikes = Math.max(0, p.likes + (willLike ? 1 : -1));
      return {
        ...p,
        liked: willLike,
        likes: nextLikes,
      };
    };

    setMyPosts((prev) => prev.map(updateOne));
    setMyScraps((prev) => prev.map(updateOne));

    if (likedKey) {
      if (willLike) localStorage.setItem(likedKey, "true");
      else localStorage.removeItem(likedKey);
    }

    try {
      await likePost(postId);
    } catch (err) {
      console.error("게시글 좋아요 API 호출 실패:", err);

      const rollbackLike = wasLiked;
      const rollbackUpdate = (p) => {
        if (p.id !== postId) return p;
        const nextLikes = Math.max(0, p.likes + (rollbackLike ? 1 : -1));
        return {
          ...p,
          liked: rollbackLike,
          likes: nextLikes,
        };
      };

      setMyPosts((prev) => prev.map(rollbackUpdate));
      setMyScraps((prev) => prev.map(rollbackUpdate));

      if (likedKey) {
        if (rollbackLike) localStorage.setItem(likedKey, "true");
        else localStorage.removeItem(likedKey);
      }
    }
  };

  // 게시글 스크랩
  const handleTogglePostBookmark = async (postId) => {
    const username = getCurrentUsername();
    const scrapKey = username ? `postScrapped:${username}:${postId}` : null;

    const current =
      myPosts.find((p) => p.id === postId) ||
      myScraps.find((p) => p.id === postId);

    const wasScrapped = current?.scrapped ?? false;
    const willScrap = !wasScrapped;
    if (scrapKey) {
      if (willScrap) localStorage.setItem(scrapKey, "true");
      else localStorage.removeItem(scrapKey);
    }

    // 내 게시글 목록 반영
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, scrapped: willScrap } : p))
    );

    // 스크랩 목록 반영
    setMyScraps((prev) => {
      if (willScrap) {
        if (prev.some((p) => p.id === postId)) {
          return prev.map((p) =>
            p.id === postId ? { ...p, scrapped: true } : p
          );
        }

        const base =
          current ||
          myPosts.find((p) => p.id === postId) ||
          prev.find((p) => p.id === postId);

        if (!base) return prev;
        return [{ ...base, scrapped: true }, ...prev];
      }

      // 스크랩 해제 -> 제거
      return prev.filter((p) => p.id !== postId);
    });

    // 상단 프로필의 스크랩 개수
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

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!isMyProfile) return;

    const confirmed = window.confirm(
      "정말로 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다."
    );
    if (!confirmed) return;

    try {
      await deleteMyAccount();
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loggedInUserId");
      navigate("/sign-in");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      const msg =
        error.response?.data?.message || error.message || "알 수 없는 오류";
      alert(`회원 탈퇴에 실패했습니다: ${msg}`);
    }
  };

  // 게시글 더보기
  const INITIAL_COUNT_VAL = INITIAL_COUNT;

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
    setMyPostsDisplayCount(INITIAL_COUNT_VAL);
    postsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 피드백 더보기
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
    setMyFeedbackCount(INITIAL_COUNT_VAL);
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 스크랩 더보기
  const expandScraps = async () => {
    if (!isMyProfile) return;

    if (!hasFetchedAllScraps) {
      try {
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
    setMyScrapsCount(INITIAL_COUNT_VAL);
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
        <div className="rounded-[10px] border border-gray-200 bg-white px-10 py-5 shadow-sm relative">
          {/* 회원 탈퇴 버튼 - 오른쪽 상단 */}
          {isMyProfile && (
            <div className="absolute top-5 right-5">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                회원 탈퇴
              </button>
            </div>
          )}
          {/* 프로필 영역 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4 sm:px-8 lg:px-12 mb-10">
            {/* 프로필 이미지 */}
            <div
              className={`h-[132px] w-[132px] sm:h-full sm:w-[132px] relative shrink-0 ${
                isMyProfile ? "cursor-pointer" : ""
              }`}
              onClick={() => isMyProfile && fileInputRef.current?.click()}
            >
              <div
                className={`h-full w-full overflow-hidden rounded-[10px] ${
                  isMyProfile ? "group" : ""
                }`}
              >
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

            {/* 프로필 정보 */}
            <div className="flex-1 min-w-0 w-full rounded-[10px] border border-[#ACACAC] bg-white pl-4 sm:pl-6 pr-4 sm:pr-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 box-border">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h2 className="text-lg sm:text-[22px] font-semibold mb-2 break-words">{profile.name}</h2>
                <ul className="space-y-2 text-xs sm:text-[14px]">
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
              <div className="shrink-0 flex-shrink-0 self-center sm:self-auto">
                <GradeDonut label={profile.gradeLabel} />
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

          {/* 내 게시글 */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {profile.postCount > INITIAL_COUNT_VAL && !isPostsExpanded && (
                  <button
                    onClick={expandPosts}
                    className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                  >
                    더보기
                  </button>
                )}
                {profile.postCount > INITIAL_COUNT_VAL && isPostsExpanded && (
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

          {/* 내 피드백 */}
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
                {profile.feedbackCount > INITIAL_COUNT_VAL &&
                  !isFeedbackExpanded && (
                    <button
                      onClick={expandFeedback}
                      className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                    >
                      더보기
                    </button>
                  )}
                {profile.feedbackCount > INITIAL_COUNT_VAL &&
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

          {/* 내 스크랩 (본인만) */}
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
                {profile.scrapCount > INITIAL_COUNT_VAL &&
                  !isScrapsExpanded && (
                    <button
                      onClick={expandScraps}
                      className="px-4 py-2 text-sm rounded-md border border-[#00B834] text-[#00B834] hover:bg-[#00B834]/5"
                    >
                      더보기
                    </button>
                  )}
                {profile.scrapCount > INITIAL_COUNT_VAL && isScrapsExpanded && (
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
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-gray-800 min-w-0 flex-1">
        <span className="shrink-0 flex-shrink-0">{icon}</span>
        <span className="font-medium whitespace-nowrap">{label}</span>
      </div>
      <span className="font-semibold text-gray-900 shrink-0 flex-shrink-0 whitespace-nowrap">{value}</span>
    </li>
  );
}

export default MyPaged;
