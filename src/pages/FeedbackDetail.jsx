// src/pages/FeedbackDetail.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import { FiChevronLeft } from "react-icons/fi";
import { FaHeart, FaRegHeart, FaComment, FaStar } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ReadonlyCodeEditor from "../components/ReadonlyCodeEditor";
import FeedbackReadonlyCodeEditor from "../components/FeedbackReadonlyCodeEditor";

import { getPostDetail } from "../api/postApi";
import { getFeedbackDetail } from "../api/feedbackApi";
import api from "../api/axiosInterceptor";

function FeedbackDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId, feedbackId } = useParams();
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  // ---------- 데이터 상태 ----------
  const [post, setPost] = useState(null);          // 게시글 정보
  const [feedback, setFeedback] = useState(null);  // 피드백 상세
  const [replies, setReplies] = useState([]);      // 댓글 목록

  const [loading, setLoading] = useState(true);

  // ---------- 좋아요 / 댓글 좋아요 ----------
  const [detailLiked, setDetailLiked] = useState(false);
  const [replyLikeState, setReplyLikeState] = useState({});

  // ---------- 수정 / 삭제 ----------
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);

  // ---------- 댓글 작성 ----------
  const [replyInput, setReplyInput] = useState("");
  const [displayedRepliesCount, setDisplayedRepliesCount] = useState(5);

  // ===================================================
  // 1. 게시글 + 피드백 상세 조회
  // ===================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        // 게시글
        const postRes = await getPostDetail(postId);
        const p = postRes?.data || postRes; // 어느 형식이든 대응
        setPost({
          id: p.postId,
          title: p.title,
          content: p.content,
          author: p.userName || "익명",
          avatar: "👤",
          timeAgo: p.createdAt?.slice(0, 10),
          tags: [p.languages, p.stacks].filter(Boolean),
          code: p.code || p.codeContent || p.content || "// 코드가 없습니다.",
        });

        // 피드백
        const fbRes = await getFeedbackDetail(feedbackId);
        const f = fbRes?.data || fbRes;

        setFeedback(f);
        setEditContent(f.content);
        setEditRating(f.rating);

        // 댓글(=replies) 매핑
        const mappedReplies = (f.comments || []).map((c) => {
          const name = c.userName || "익명";
          return {
            id: c.commentId,
            author: name,
            avatarInitial: name.charAt(0).toUpperCase(),
            timeAgo: c.createdAt?.slice(0, 10),
            content: c.content,
            likes: 0,
          };
        });
        setReplies(mappedReplies);

        // 댓글 좋아요 상태 초기화 (UI 전용)
        const init = {};
        mappedReplies.forEach((r) => {
          init[r.id] = { liked: false, count: r.likes ?? 0 };
        });
        setReplyLikeState(init);
      } catch (err) {
        console.error("피드백 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId, feedbackId]);

  // ===================================================
  // 2. 좋아요 / 수정 / 삭제 / 댓글 CRUD
  // ===================================================

  const baseLikes = feedback?.likesCount ?? 0;
  const detailLikes = baseLikes + (detailLiked ? 1 : 0);

  // 피드백 좋아요 토글
  const toggleDetailLike = async () => {
    if (!feedback) return;
    
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }
    
    try {
      await api.post(`/api/feedback/${feedbackId}/like`);
      setDetailLiked((prev) => !prev);
      setFeedback((prev) =>
          prev
              ? {
                ...prev,
                likesCount: prev.likesCount + (detailLiked ? -1 : 1),
              }
              : prev
      );
    } catch (err) {
      console.error("피드백 좋아요 토글 실패:", err);
    }
  };

  // 댓글 좋아요 (UI 전용)
  const toggleReplyLike = (id) => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }
    
    setReplyLikeState((prev) => {
      const curr = prev[id] || { liked: false, count: 0 };
      const nextLiked = !curr.liked;
      const nextCount = Math.max(0, curr.count + (nextLiked ? 1 : -1));
      return { ...prev, [id]: { liked: nextLiked, count: nextCount } };
    });
  };

  // 피드백 수정 저장
  const handleSaveEdit = async () => {
    if (!feedback) return;
    try {
      const body = {
        postId: feedback.postId,
        content: editContent,
        rating: editRating,
      };
      const res = await api.put(`/api/feedback/${feedbackId}`, body);
      const updated = res?.data || res;

      setFeedback(updated);
      setEditContent(updated.content);
      setEditRating(updated.rating);
      setIsEditing(false);
    } catch (err) {
      console.error("피드백 수정 실패:", err);
      alert("피드백 수정에 실패했습니다.");
    }
  };

  // 피드백 삭제
  const handleDelete = async () => {
    if (!window.confirm("피드백을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/feedback/${feedbackId}`);
      alert("피드백이 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("피드백 삭제 실패:", err);
      alert("피드백 삭제에 실패했습니다.");
    }
  };

  // 댓글 작성
  const handleSendReply = async () => {
    if (!isAuthed) {
      navigate("/sign-in", { state: { from: location.pathname } });
      return;
    }
    
    const text = replyInput.trim();
    if (!text) return;
    try {
      const res = await api.post(`/api/feedback/${feedbackId}/comment`, {
        content: text,
      });
      const c = res?.data || res;

      const name = c.userName || "익명";
      const newReply = {
        id: c.commentId,
        author: name,
        avatarInitial: name.charAt(0).toUpperCase(),
        timeAgo: c.createdAt?.slice(0, 10),
        content: c.content,
        likes: 0,
      };

      setReplies((prev) => [...prev, newReply]);
      setReplyLikeState((prev) => ({
        ...prev,
        [newReply.id]: { liked: false, count: 0 },
      }));
      setReplyInput("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  // ===================================================
  // 3. 로딩 / 예외 처리
  // ===================================================
  if (loading) {
    return <Loading message="피드백을 불러오는 중입니다..." />;
  }

  if (!post || !feedback) {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <p>데이터를 불러올 수 없습니다.</p>
        </div>
    );
  }

  const replyCount = replies.length;
  const ratingToShow = isEditing ? editRating : feedback.rating;

  // 라인 피드백 -> FeedbackReadonlyCodeEditor 형식으로 변환
  const lineFeedbacks = (feedback.lineFeedbacks || []).map((lf) => ({
    start: lf.lineNumber,
    end: lf.endLineNumber || lf.lineNumber,
    text: lf.content,
    createdAt: lf.createdAt,
  }));

  // ===================================================
  // 4. 렌더링 (기존 UI 최대한 유지)
  // ===================================================
  return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs text-gray-500 mb-4 hover:text-gray-700"
          >
            <FiChevronLeft className="text-gray-400" />
            <span>피드백으로 돌아가기</span>
          </button>

          {/* 요약 */}
          <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  {post.avatar || "👤"}
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {post.title}
                  </h1>
                  <div className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
                    {post.author} · {post.timeAgo}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                    <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100"
                    >
                  {tag}
                </span>
                ))}
              </div>
            </div>
          </section>

          {/* 상세 내용 */}
          <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            {/* 작성자 + 수정/삭제 버튼 */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
                {feedback.avatarInitial || "👤"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {feedback.userName || "작성자"}
                  </span>
                    <span>·</span>
                    <span>{feedback.createdAt?.slice(0, 10) || ""}</span>
                  </div>
                  {/* 채택되지 않은 경우에만 수정/삭제 노출 (작성자 체크는 백에서 처리) */}
                  <div className="flex gap-2 text-xs text-gray-500">
                    {!feedback.adoptedTF && !isEditing && (
                        <>
                          <button
                              type="button"
                              className="px-2 py-1 border rounded-md hover:bg-gray-50"
                              onClick={() => setIsEditing(true)}
                          >
                            수정
                          </button>
                          <button
                              type="button"
                              className="px-2 py-1 border rounded-md hover:bg-gray-50"
                              onClick={handleDelete}
                          >
                            삭제
                          </button>
                        </>
                    )}
                    {isEditing && (
                        <>
                          <button
                              type="button"
                              className="px-2 py-1 border rounded-md bg-green-600 text-white hover:bg-green-700"
                              onClick={handleSaveEdit}
                          >
                            저장
                          </button>
                          <button
                              type="button"
                              className="px-2 py-1 border rounded-md hover:bg-gray-50"
                              onClick={() => {
                                setIsEditing(false);
                                setEditContent(feedback.content);
                                setEditRating(feedback.rating);
                              }}
                          >
                            취소
                          </button>
                        </>
                    )}
                  </div>
                </div>

                {/* 별점 */}
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                          key={star}
                          className={`cursor-pointer ${
                              star <= ratingToShow ? "text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => {
                            if (isEditing) setEditRating(star);
                          }}
                      />
                  ))}
                </div>
              </div>
            </div>

            {/* 본문 */}
            <div className="text-sm text-gray-700 leading-6 whitespace-pre-line">
              {isEditing ? (
                  <textarea
                      className="w-full border rounded-md p-2 text-sm"
                      rows={6}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                  />
              ) : (
                  feedback.content || "상세 내용 본문이 들어갑니다."
              )}
            </div>

            {/* 관련 코드 + 라인 피드백 */}
            <div className="mt-5">
              <div className="text-sm font-semibold text-gray-800 mb-2">
                관련 코드
              </div>
              <div className="rounded-md overflow-hidden">
                <FeedbackReadonlyCodeEditor
                    value={post.code}
                    language="javascript"
                    title="JAVASCRIPT - 피드백된 코드"
                    feedbacks={lineFeedbacks}
                />
              </div>
            </div>

            {/* 피드백 유형 태그 (일단 고정) */}
            <div className="mt-3 mb-1 flex flex-wrap gap-2">
              {["개선 제안"].map((type) => (
                  <span
                      key={type}
                      className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100"
                  >
                {type}
              </span>
              ))}
            </div>

            {/* 좋아요, 답글 수 */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
              <button
                  type="button"
                  onClick={toggleDetailLike}
                  className="inline-flex items-center gap-1 hover:opacity-90"
              >
                {detailLiked ? (
                    <FaHeart className="text-red-500" />
                ) : (
                    <FaRegHeart />
                )}
                <span className="text-sm font-medium">{detailLikes}</span>
              </button>
              <div className="inline-flex items-center gap-1">
                <FaComment /> {replyCount}
              </div>
            </div>
          </section>

          {/* 코드에디터 (읽기 전용 원본 코드) + 댓글 */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
              <ReadonlyCodeEditor
                  value={post.code}
                  language="javascript"
                  title="JAVASCRIPT - 읽기 전용"
              />
            </div>

            {/* 답글 영역 */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                답글 ({replyCount}개)
              </h2>
              {/* 답글 목록 */}
              <div className="mb-4">
                <div className="space-y-4">
                  {replies.slice(0, displayedRepliesCount).map((fb, idx) => (
                      <div
                          key={fb.id}
                          className={`py-4 ${
                              idx !== replies.slice(0, displayedRepliesCount).length - 1
                                  ? "border-b border-gray-200"
                                  : ""
                          }`}
                      >
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold mr-3">
                            {fb.avatarInitial}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-900">
                            {fb.author}
                          </span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500">{fb.timeAgo}</span>
                            </div>
                            <div className="mt-2 max-h-[200px] overflow-y-auto pr-2">
                              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {fb.content}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                              <button
                                  type="button"
                                  onClick={() => toggleReplyLike(fb.id)}
                                  className="inline-flex items-center gap-1 hover:opacity-90"
                              >
                                {replyLikeState[fb.id]?.liked ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart />
                                )}
                                <span className="text-sm font-medium">
                              {replyLikeState[fb.id]?.count ?? fb.likes ?? 0}
                            </span>
                              </button>
                              <button
                                  type="button"
                                  className="text-gray-500 hover:text-gray-700"
                              >
                                답글
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
                
                {replies.length > displayedRepliesCount && (
                    <button
                        type="button"
                        onClick={() => setDisplayedRepliesCount(prev => prev + 5)}
                        className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      더보기 ({replies.length - displayedRepliesCount}개 더)
                    </button>
                )}
              </div>

              {/* 입력 박스 */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
                      👤
                    </div>
                    <div className="w-full">
                      <div className="border border-gray-300 rounded-lg p-3">
                      <textarea
                          rows={5}
                          placeholder="이 피드백에 대한 의견을 남겨주세요..."
                          className="w-full min-h-28 outline-none focus:ring-0 resize-none border-0 p-0"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                      />
                        <div className="flex justify-end mt-2">
                          <button
                              type="button"
                              onClick={handleSendReply}
                              className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
                          >
                            <BsSend />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </section>
          </section>
        </div>
      </div>
  );
}

export default FeedbackDetail;
