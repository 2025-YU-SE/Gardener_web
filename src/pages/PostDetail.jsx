// -----------------------------------------
// PostDetail.jsx (완전 수정본 — UI 유지 + 기능추가)
// -----------------------------------------
import React, { useState, useEffect, useMemo } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaEye,
  FaStar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ReadonlyCodeEditor from "../components/ReadonlyCodeEditor";
import FeedbackCodeEditor from "../components/FeedbackCodeEditor";

// API
import {
  getPostDetail,
  deletePost,
  getAiFeedback,
  regenerateAiFeedback,
  likePost,
  bookmarkPost,
} from "../api/postApi";
import {
  getFeedbacksByPost,
  createFeedback,
  createLineFeedback,
} from "../api/feedbackApi";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";
import { getCurrentUsername, isAdmin } from "../utils/jwtHelper";
import baseProfile from "../assets/baseProfile.png";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  const [post, setPost] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [displayedFeedbacksCount, setDisplayedFeedbacksCount] = useState(5);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 피드백 작성 상태
  // -----------------------------
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState(5);

  const [feedbackRanges, setFeedbackRanges] = useState([]);

  const [isAIFeedbackOpen, setIsAIFeedbackOpen] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [postLiked, setPostLiked] = useState(false);
  const [postBookmarked, setPostBookmarked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ---------------------------------------------------
  // 코드 에디터 언어 감지
  // ---------------------------------------------------
  const editorLanguage = useMemo(() => {
    const lang = post?.languages;
    if (!lang) return "javascript";

    const l = String(lang).toLowerCase();

    if (l.includes("typescript") || l.includes("ts")) return "typescript";
    if (l.includes("javascript") || l.includes("js")) return "javascript";
    if (l.includes("java")) return "java";
    if (l.includes("python") || l.includes("py")) return "python";
    if (l.includes("c++")) return "cpp";
    if (l.includes("c#")) return "csharp";
    if (l === "c") return "c";
    if (l.includes("go")) return "go";

    return "javascript";
  }, [post?.languages]);

  // ===================================================
  // 1. 게시물 상세 불러오기
  // ===================================================
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await getPostDetail(postId);
        const p = res.data;

        setPost({
          id: p.postId,
          userId: p.userId,
          title: p.title,
          content: p.content,
          author: p.userName ?? "익명",
          avatar: makeAbsoluteImageUrl(p.userPicture) || baseProfile,
          timeAgo: p.createdAt?.slice(0, 10),
          tags: [p.languages, p.stacks],
          likes: p.likesCount,
          comments: p.feedbackCount,
          views: p.views,
          bookmarks: p.scrapCount,
          code: p.code,
          languages: p.languages,
          stacks: p.stacks,
          contentsType: p.contentsType,
          summary: p.summary,
          githubRepoUrl: p.githubRepoUrl,
          problemStatement: p.problemStatement,
          aiFeedback: p.aiFeedback || "",
        });

        setAiFeedback(p.aiFeedback || "");

        const username = getCurrentUsername();
        if (username) {
          const likedKey = `postLiked:${username}:${postId}`;
          const scrappedKey = `postScrapped:${username}:${postId}`;
          setPostLiked(localStorage.getItem(likedKey) === "true");
          setPostBookmarked(localStorage.getItem(scrappedKey) === "true");
        } else {
          setPostLiked(false);
          setPostBookmarked(false);
        }
      } catch (err) {
        console.error("게시글 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  // ===================================================
  // 2. 게시물의 피드백 목록 불러오기
  // ===================================================
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res = await getFeedbacksByPost(postId);
        const list = Array.isArray(res) ? res : res.data || [];

        const mapped = list.map((fb) => ({
          id: fb.feedbackId,
          author: fb.userName || `User ${fb.userId}`,
          avatar: makeAbsoluteImageUrl(fb.userPicture) || baseProfile,
          rating: fb.rating,
          content: fb.content,
          timeAgo: fb.createdAt?.slice(0, 10),
          likes: fb.likesCount,
          views: 0,
          adoptedTF: fb.adoptedTF === true,
        }));

        // 채택된 피드백이 상단
        mapped.sort((a, b) => {
          if (a.adoptedTF === b.adoptedTF) return 0;
          return a.adoptedTF ? -1 : 1;
        });

        setFeedbacks(mapped);
      } catch (err) {
        console.error("피드백 로드 실패:", err);
      }
    };

    loadFeedbacks();
  }, [postId]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".post-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading || !post) {
    return <Loading message="게시글을 불러오는 중입니다..." />;
  }

  // ===================================================
  // 🔥 피드백 등록
  // ===================================================
  const handleSubmitFeedback = async () => {
    // 인증 확인
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }

    try {
      const feedbackPayload = {
        postId: Number(postId),
        content: feedbackContent,
        rating: rating,
      };

      const createdFeedback = await createFeedback(feedbackPayload);
      const feedbackId = createdFeedback.feedbackId || createdFeedback.id;

      // 2. 각 라인 피드백을 개별적으로 등록
      if (feedbackRanges && feedbackRanges.length > 0) {
        // 모든 라인 피드백을 등록 (내용이 없어도 라인 번호는 저장)
        const lineFeedbackPromises = feedbackRanges.map((r) => {
          // text 필드 확인 (text 또는 content 필드 모두 확인)
          const rawText = r.text || r.content || "";
          const content = rawText.trim();

          const payload = {
            lineNumber: r.start,
            endLineNumber: r.end,
            content: content,
          };

          return createLineFeedback(feedbackId, payload);
        });

        await Promise.all(lineFeedbackPromises);
      }

      alert("피드백이 등록되었습니다!");
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("권한이 없습니다. 로그인 상태를 확인해주세요.");
        localStorage.removeItem("accessToken");
        navigate("/sign-in", { state: { from: location.pathname } });
      } else {
        alert(
          "피드백 등록 실패: " +
            (err.response?.data?.message || err.message || "알 수 없는 오류")
        );
      }
    }
  };

  const handleFeedbackButtonClick = () => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }

    setIsFeedbackFormOpen(true);
  };

  // ===================================================
  // 🔥 좋아요 / 스크랩
  // ===================================================

  const handleToggleLike = async () => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }

    const username = getCurrentUsername();
    const likedKey = username ? `postLiked:${username}:${postId}` : null;

    const wasLiked = postLiked;
    const willLike = !wasLiked;

    let prevLikes = post?.likes ?? 0;

    setPost((prev) => {
      if (!prev) return prev;
      prevLikes = prev.likes;
      const nextLikes = Math.max(0, prev.likes + (willLike ? 1 : -1));
      return { ...prev, likes: nextLikes };
    });
    setPostLiked(willLike);

    try {
      await likePost(postId);

      if (likedKey) {
        if (willLike) localStorage.setItem(likedKey, "true");
        else localStorage.removeItem(likedKey);
      }
    } catch (err) {
      console.error("게시글 좋아요 토글 실패:", err);

      setPost((prev) => (prev ? { ...prev, likes: prevLikes } : prev));
      setPostLiked(wasLiked);

      if (likedKey) {
        if (wasLiked) localStorage.setItem(likedKey, "true");
        else localStorage.removeItem(likedKey);
      }

      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }

    const username = getCurrentUsername();
    const scrapKey = username ? `postScrapped:${username}:${postId}` : null;

    const wasScrapped = postBookmarked;
    const willScrap = !wasScrapped;

    let prevBookmarks = post?.bookmarks ?? 0;

    setPost((prev) => {
      if (!prev) return prev;
      prevBookmarks = prev.bookmarks;
      const nextBookmarks = Math.max(0, prev.bookmarks + (willScrap ? 1 : -1));
      return { ...prev, bookmarks: nextBookmarks };
    });
    setPostBookmarked(willScrap);

    try {
      await bookmarkPost(postId);

      if (scrapKey) {
        if (willScrap) localStorage.setItem(scrapKey, "true");
        else localStorage.removeItem(scrapKey);
      }
    } catch (err) {
      console.error("게시글 스크랩 토글 실패:", err);

      setPost((prev) => (prev ? { ...prev, bookmarks: prevBookmarks } : prev));
      setPostBookmarked(wasScrapped);

      if (scrapKey) {
        if (wasScrapped) localStorage.setItem(scrapKey, "true");
        else localStorage.removeItem(scrapKey);
      }

      alert("스크랩 처리 중 오류가 발생했습니다.");
    }
  };

  // ===================================================
  // 🔥 AI 피드백 불러오기 / 재생성
  // ===================================================

  const fetchAiFeedback = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      const res = await getAiFeedback(postId);
      const text = res?.data ?? res;
      setAiFeedback(text || "");
    } catch (err) {
      console.error("AI 피드백 조회 실패:", err);
      setAiError("AI 피드백을 불러오지 못했습니다.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleAIFeedback = async () => {
    if (!isAIFeedbackOpen && !aiFeedback) {
      await fetchAiFeedback();
    }
    setIsAIFeedbackOpen((v) => !v);
  };

  const handleRegenerateAIFeedback = async () => {
    try {
      if (!window.confirm("AI 피드백을 다시 생성하시겠습니까?")) return;
      setAiLoading(true);
      setAiError("");
      const res = await regenerateAiFeedback(postId);
      const dto = res?.data ?? res;
      const text = dto?.aiFeedback || "";
      setAiFeedback(text);

      setPost((prev) => (prev ? { ...prev, aiFeedback: text } : prev));
    } catch (err) {
      console.error("AI 피드백 재생성 실패:", err);
      setAiError("AI 피드백 재생성에 실패했습니다.");
    } finally {
      setAiLoading(false);
    }
  };

  // ===================================================
  // 🔥 게시글 수정/삭제 권한 체크
  // ===================================================
  const canEditOrDelete = () => {
    if (!isAuthed || !post) return false;

    const currentUsername = getCurrentUsername();
    if (!currentUsername) return false;

    // 관리자는 항상 수정/삭제 가능
    if (isAdmin()) return true;

    // 게시글 작성자만 수정/삭제 가능
    return post.author === currentUsername;
  };

  // ===================================================
  // 🔥 게시글 수정
  // ===================================================
  const handleEditPost = () => {
    if (!canEditOrDelete()) {
      alert("수정 권한이 없습니다.");
      return;
    }
    navigate(`/upload?edit=${postId}`, { state: { post } });
  };

  // ===================================================
  // 🔥 게시글 삭제
  // ===================================================
  const handleDeletePost = async () => {
    if (!canEditOrDelete()) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePost(postId);
      alert("게시글이 삭제되었습니다.");
      navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      if (err.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert(
          "게시글 삭제에 실패했습니다: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* -------------------------------- */}
        {/* 게시글 카드 */}
        {/* -------------------------------- */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">
              {post.title}
            </h1>

            {/* 드롭다운 메뉴 */}
            {canEditOrDelete() && (
              <div className="relative post-menu-container ml-4">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoMdMore size={24} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleEditPost();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <FaEdit className="text-blue-600" />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleDeletePost();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <FaTrash />
                      <span>삭제</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6">{post.content}</p>

          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden flex justify-center items-center mr-3 bg-green-100 border border-gray-300">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = baseProfile;
                }}
              />
            </div>
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-gray-500">{post.timeAgo}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {post.tags?.filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-1 text-gray-600"
              >
                {postLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span>{post.likes}</span>
              </button>

              <button
                onClick={handleToggleBookmark}
                className="flex items-center gap-1 text-gray-600"
              >
                {postBookmarked ? (
                  <FaBookmark className="text-blue-500" />
                ) : (
                  <FaRegBookmark />
                )}
                <span>{post.bookmarks}</span>
              </button>

              <span className="flex items-center gap-1 text-gray-600">
                <FaComment />
                {post.comments}
              </span>

              <span className="flex items-center gap-1 text-gray-600">
                <FaEye />
                {post.views}
              </span>
            </div>

            <button
              onClick={handleToggleAIFeedback}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {isAIFeedbackOpen ? "AI 피드백 닫기" : "AI 피드백"}
            </button>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* 코드 영역 + 피드백 */}
        {/* -------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 코드 */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-6">
              {isFeedbackFormOpen ? (
                <FeedbackCodeEditor
                  value={post.code}
                  language={editorLanguage}
                  title="라인 피드백 입력"
                  initialFeedbacks={[]}
                  onAddFeedbackRange={(range) => {
                    setFeedbackRanges((prev) => [...prev, range]);
                  }}
                  onSaveFeedback={(item) => {
                    setFeedbackRanges((prev) => {
                      const exists = prev.some((r) => r.id === item.id);
                      if (exists) {
                        return prev.map((r) => (r.id === item.id ? item : r));
                      } else {
                        return [...prev, item];
                      }
                    });
                  }}
                />
              ) : (
                <ReadonlyCodeEditor
                  value={post.code}
                  language={editorLanguage}
                  title="코드"
                />
              )}
            </div>
          </div>

          {/* 오른쪽: 피드백 작성 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">피드백 작성</h3>

              {!isFeedbackFormOpen ? (
                <button
                  onClick={handleFeedbackButtonClick}
                  className="w-full bg-green-600 text-white py-2 rounded-md"
                >
                  피드백 작성하기
                </button>
              ) : (
                <div className="space-y-4">
                  {/* 평점 */}
                  <div>
                    <label className="block mb-2 text-sm">평점</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-2xl cursor-pointer ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 내용 */}
                  <div>
                    <textarea
                      className="w-full border rounded-md p-2"
                      rows="4"
                      placeholder="피드백 내용을 작성해주세요."
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                    />
                  </div>

                  {/* 제출 */}
                  <button
                    onClick={handleSubmitFeedback}
                    className="w-full bg-green-600 text-white py-2 rounded-md"
                  >
                    피드백 제출
                  </button>
                </div>
              )}
            </div>

            {/* 기존 피드백 */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">기존 피드백</h3>

              {feedbacks.length === 0 ? (
                <p className="text-gray-500">아직 피드백이 없습니다.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {feedbacks.slice(0, displayedFeedbacksCount).map((fb) => (
                      <div
                        key={fb.id}
                        className="border p-3 rounded-md cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/posts/${post.id}/${fb.id}`)}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center mr-2 bg-green-100 border border-gray-300">
                            <img
                              src={fb.avatar}
                              alt={fb.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = baseProfile;
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{fb.author}</p>
                            <p className="text-xs text-gray-500">
                              {fb.timeAgo}
                            </p>
                          </div>
                        </div>

                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-sm ${
                                star <= fb.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        {/* 채택 여부 표시 */}
                        {fb.adoptedTF && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100 mb-1">
                            채택된 피드백
                          </div>
                        )}

                        <div className="max-h-[150px] overflow-y-auto pr-2">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {fb.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {feedbacks.length > displayedFeedbacksCount && (
                    <button
                      onClick={() =>
                        setDisplayedFeedbacksCount((prev) => prev + 5)
                      }
                      className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      더보기 ({feedbacks.length - displayedFeedbacksCount}개 더)
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI 피드백 */}
        {isAIFeedbackOpen && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">AI 피드백</h2>
              <button
                type="button"
                onClick={handleRegenerateAIFeedback}
                className="text-sm px-3 py-1 rounded-md border border-green-500 text-green-600 hover:bg-green-50"
              >
                다시 생성
              </button>
            </div>

            {aiLoading && (
              <p className="text-sm text-gray-500">AI 피드백 생성 중...</p>
            )}

            {!aiLoading && aiError && (
              <p className="text-sm text-red-500">{aiError}</p>
            )}

            {!aiLoading && !aiError && (
              <div className="mt-2 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                <p className="whitespace-pre-wrap text-sm text-gray-800">
                  {aiFeedback && aiFeedback.trim()
                    ? aiFeedback
                    : "AI 피드백이 아직 생성되지 않았습니다."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
