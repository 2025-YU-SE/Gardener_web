// -----------------------------------------
// PostDetail.jsx (완전 수정본 — UI 유지 + 기능추가)
// -----------------------------------------
import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaEye,
  FaStar,
} from "react-icons/fa";
import Header from "../components/header/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ReadonlyCodeEditor from "../components/ReadonlyCodeEditor";
import FeedbackCodeEditor from "../components/FeedbackCodeEditor";

// API
import { getPostDetail } from "../api/postApi";
import { getFeedbacksByPost, createFeedback } from "../api/feedbackApi";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";
import baseProfile from "../assets/baseProfile.png";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  const [post, setPost] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [displayedFeedbacksCount, setDisplayedFeedbacksCount] = useState(5);

  // -----------------------------
  // 피드백 작성 상태
  // -----------------------------
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState(""); // ⬅ 추가됨
  const [feedbackContent, setFeedbackContent] = useState("");
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("일반 피드백");
  const [rating, setRating] = useState(5);

  const [feedbackRanges, setFeedbackRanges] = useState([]);

  const [isAIFeedbackOpen, setIsAIFeedbackOpen] = useState(false);

  const [postLiked, setPostLiked] = useState(false);
  const [postBookmarked, setPostBookmarked] = useState(false);

  // ===================================================
  // 1. 게시물 상세 불러오기
  // ===================================================
  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await getPostDetail(postId);
        const p = res.data;

        setPost({
          id: p.postId,
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
        });
      } catch (err) {
        console.error("게시글 로드 실패:", err);
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
        }));

        setFeedbacks(mapped);
      } catch (err) {
        console.error("피드백 로드 실패:", err);
      }
    };

    loadFeedbacks();
  }, [postId]);

  if (!post) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <p>게시글을 불러오는 중...</p>
        </div>
    );
  }

  // ===================================================
  // 🔥 피드백 등록
  // ===================================================
  const handleSubmitFeedback = async () => {
    try {
      const feedbackPayload = {
        postId: Number(postId),
        content: feedbackContent,
        rating: rating,
        title: feedbackTitle,
        lineFeedbacks: feedbackRanges.map((r) => ({
          lineNumber: r.start,
          endLineNumber: r.end,
          content: r.text || "",
        })),
      };

      await createFeedback(feedbackPayload);

      alert("피드백이 등록되었습니다!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("피드백 등록 실패");
    }
  };

  const handleFeedbackButtonClick = () => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }

    setIsFeedbackFormOpen(true);
  };

  return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* -------------------------------- */}
          {/* 게시글 카드 */}
          {/* -------------------------------- */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>

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
                    onClick={() => {
                      if (!isAuthed) {
                        navigate("/sign-in", { state: { from: location.pathname } });
                        return;
                      }
                      setPostLiked((v) => !v);
                    }}
                    className="flex items-center gap-1 text-gray-600"
                >
                  {postLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span>{post.likes + (postLiked ? 1 : 0)}</span>
                </button>

                <button
                    onClick={() => {
                      if (!isAuthed) {
                        navigate("/sign-in", { state: { from: location.pathname } });
                        return;
                      }
                      setPostBookmarked((v) => !v);
                    }}
                    className="flex items-center gap-1 text-gray-600"
                >
                  {postBookmarked ? (
                      <FaBookmark className="text-blue-500" />
                  ) : (
                      <FaRegBookmark />
                  )}
                  <span>{post.bookmarks + (postBookmarked ? 1 : 0)}</span>
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
                  onClick={() => setIsAIFeedbackOpen((v) => !v)}
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
                        language="java"
                        title="라인 피드백 입력"
                        initialFeedbacks={[]}
                        onAddFeedbackRange={(range) => {
                          setFeedbackRanges((prev) => [...prev, range]);
                        }}
                        onSaveFeedback={(item) => {
                          setFeedbackRanges((prev) =>
                              prev.map((r) => (r.id === item.id ? item : r))
                          );
                        }}
                    />
                ) : (
                    <ReadonlyCodeEditor
                        value={post.code}
                        language="java"
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
                      {/* 🔥 피드백 제목 입력칸 추가됨 */}
                      <div>
                        <label className="block mb-1 text-sm font-semibold">피드백 제목</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="예: 코드 복잡도 개선 제안"
                            value={feedbackTitle}
                            onChange={(e) => setFeedbackTitle(e.target.value)}
                        />
                      </div>

                      {/* 피드백 유형 */}
                      <div>
                        <label className="block mb-2 text-sm">피드백 유형</label>
                        <div className="flex gap-2">
                          {["일반 피드백", "개선 제안", "버그 신고"].map((type) => (
                              <button
                                  key={type}
                                  onClick={() => setSelectedFeedbackType(type)}
                                  className={`px-3 py-1 rounded ${
                                      selectedFeedbackType === type
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-200"
                                  }`}
                              >
                                {type}
                              </button>
                          ))}
                        </div>
                      </div>

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
                                  <p className="text-xs text-gray-500">{fb.timeAgo}</p>
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

                              <div className="max-h-[150px] overflow-y-auto pr-2">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{fb.content}</p>
                              </div>
                            </div>
                        ))}
                      </div>
                      
                      {feedbacks.length > displayedFeedbacksCount && (
                          <button
                              onClick={() => setDisplayedFeedbacksCount(prev => prev + 5)}
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
        </div>
      </div>
  );
}

export default PostDetail;
