import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaStar } from "react-icons/fa";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import { getPosts, deletePost } from "../api/postApi";
import { getAllFeedbacks, getFeedbacksByPost, deleteFeedback } from "../api/feedbackApi";
import { isAdmin } from "../utils/jwtHelper";

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "feedbacks"
  
  const [posts, setPosts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 관리자 권한 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }
    if (!isAdmin()) {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/main", { replace: true });
      return;
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!isAdmin()) return; // 관리자가 아니면 데이터 로드하지 않음
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "posts") {
        // 넉넉한 페이지 사이즈로 전체 게시물 수집
        const res = await getPosts({ params: { page: 0, size: 200 } });
        const data = res.data?.content || [];
        const mapped = data.map((p) => ({
          id: p.postId,
          title: p.title,
          content: p.content,
          author: p.userName || "익명",
          timeAgo: p.createdAt ? p.createdAt.slice(0, 10) : "",
          tags: [p.languages, p.stacks].filter(Boolean),
          languages: p.languages,
          stacks: p.stacks,
          category: p.category || "개발",
          likes: p.likesCount || 0,
          bookmarks: p.scrapCount || 0,
          comments: p.feedbackCount || 0,
          views: p.views || 0,
          code: p.code || "",
        }));
        setPosts(mapped);
      } else {
        try {
          // 1차: 관리자 전용 전체 피드백 조회 (권한 403 시 다음 단계로 fallback)
          const feedbackRes = await getAllFeedbacks({ page: 0, size: 200 });
          const list =
            feedbackRes?.content ||
            feedbackRes?.data ||
            (Array.isArray(feedbackRes) ? feedbackRes : []);

          // 게시글 제목 매핑
          const postResForTitle = await getPosts({ params: { page: 0, size: 200 } });
          const postTitleMap = {};
          (postResForTitle?.data?.content || []).forEach((p) => {
            postTitleMap[p.postId] = p.title;
          });

          const mapped = list.map((fb) => ({
            id: fb.feedbackId || fb.id,
            postId: fb.postId,
            author: fb.userName || fb.author || "익명",
            // 피드백 제목 대신 해당 게시글 제목 사용
            title: postTitleMap[fb.postId] || fb.title || "",
            content: fb.content || "",
            rating: fb.rating || 0,
            timeAgo: fb.createdAt ? fb.createdAt.slice(0, 10) : "",
            likes: fb.likesCount || fb.likes || 0,
          }));

          setFeedbacks(mapped);
        } catch {
          // 403 등의 경우 기존 per-post 조회로 우회 (로그 미출력)
          try {
            // 게시글을 넉넉히 받아서 누락 방지
            const postsRes = await getPosts({ params: { page: 0, size: 200 } });
            const postsData = postsRes?.data?.content || [];
            const postTitleMap = {};
            postsData.forEach((p) => {
              postTitleMap[p.postId] = p.title;
            });
            const feedbackPromises = postsData.map(async (post) => {
              try {
                const feedbacks = await getFeedbacksByPost(post.postId, {
                  page: 0,
                  size: 200,
                });
                return Array.isArray(feedbacks) ? feedbacks : [];
              } catch {
                return [];
              }
            });
            const allFeedbacksArrays = await Promise.all(feedbackPromises);
            const allFeedbacks = allFeedbacksArrays.flat();
            const mapped = allFeedbacks.map((fb) => ({
              id: fb.feedbackId || fb.id,
              postId: fb.postId,
              author: fb.userName || fb.author || "익명",
              // 피드백 제목 대신 해당 게시글 제목 사용
              title: postTitleMap[fb.postId] || fb.title || "",
              content: fb.content || "",
              rating: fb.rating || 0,
              timeAgo: fb.createdAt ? fb.createdAt.slice(0, 10) : "",
              likes: fb.likesCount || fb.likes || 0,
            }));
            setFeedbacks(mapped);
          } catch {
            setFeedbacks([]);
          }
        }
      }
    } catch {
      setFeedbacks([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 언어 이름을 정규화하는 함수 (language.jsx 형식에 맞게)
  const handleDeletePost = async (postId) => {
    if (!window.confirm("정말 이 게시물을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      alert("게시물이 삭제되었습니다.");
      loadData();
    } catch (err) {
      console.error("게시물 삭제 실패:", err);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("정말 이 피드백을 삭제하시겠습니까?")) return;
    try {
      await deleteFeedback(feedbackId);
      alert("피드백이 삭제되었습니다.");
      loadData();
    } catch (err) {
      console.error("피드백 삭제 실패:", err);
      alert("피드백 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <Loading message="데이터를 불러오는 중입니다..." />;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">관리자 페이지</h1>

        {/* 탭 */}
        <div className="flex space-x-4 mb-4 sm:mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "posts"
                ? "text-black border-black"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            게시물 관리
          </button>
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "feedbacks"
                ? "text-black border-black"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            피드백 관리
          </button>
        </div>

        {/* 게시물 목록 */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500">게시물이 없습니다.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-300 p-4 sm:p-6 rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                        {post.title}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 break-words">{post.content}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span>작성자: {post.author}</span>
                        <span>작성일: {post.timeAgo}</span>
                        <span>조회수: {post.views}</span>
                        <span>좋아요: {post.likes}</span>
                        <span>댓글: {post.comments}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {post.tags.map(
                          (tag, index) =>
                            tag && (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                              >
                                {tag}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 피드백 목록 */}
        {activeTab === "feedbacks" && (
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500">피드백이 없습니다.</p>
            ) : (
              feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white border border-gray-300 p-4 sm:p-6 rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">
                        {feedback.title || "제목 없음"}
                      </h3>
                      <div className="max-h-[200px] overflow-y-auto pr-2 mb-2">
                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
                          {feedback.content}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-2">
                        <span>작성자: {feedback.author}</span>
                        <span>작성일: {feedback.timeAgo}</span>
                        <span>좋아요: {feedback.likes}</span>
                        <div className="flex items-center gap-1">
                          <span>평점:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-sm ${
                                star <= feedback.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/posts/${feedback.postId}`)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        관련 게시물 보기 →
                      </button>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDeleteFeedback(feedback.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;

