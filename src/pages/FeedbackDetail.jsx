// src/pages/FeedbackDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/header/Header";
import Loading from "../components/Loading";
import { FiChevronLeft } from "react-icons/fi";
import { FaHeart, FaRegHeart, FaComment, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { BsSend } from "react-icons/bs";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ReadonlyCodeEditor from "../components/ReadonlyCodeEditor";
import FeedbackReadonlyCodeEditor from "../components/FeedbackReadonlyCodeEditor";
import FeedbackCodeEditor from "../components/FeedbackCodeEditor";

import { getPostDetail } from "../api/postApi";
import { getFeedbackDetail, getLineFeedbacks } from "../api/feedbackApi";
import api from "../api/axiosInterceptor";
import { makeAbsoluteImageUrl } from "../utils/imageHelper";
import { getCurrentUsername, isAdmin } from "../utils/jwtHelper";
import baseProfile from "../assets/baseProfile.png";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editLineFeedbacks, setEditLineFeedbacks] = useState([]);

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
          avatar: makeAbsoluteImageUrl(p.userPicture) || baseProfile,
          timeAgo: p.createdAt?.slice(0, 10),
          tags: [p.languages, p.stacks].filter(Boolean),
          code: p.code || p.codeContent || p.content || "// 코드가 없습니다.",
          languages: p.languages,
        });

        // 피드백
        const fbRes = await getFeedbackDetail(feedbackId);
        const f = fbRes?.data || fbRes;
        
        // 라인 피드백을 별도로 조회
        let lineFeedbacksData = [];
        try {
          const lineFbRes = await getLineFeedbacks(feedbackId);
          lineFeedbacksData = Array.isArray(lineFbRes) ? lineFbRes : (lineFbRes?.data || []);
          
          // 상세 조회에 포함된 라인 피드백과 별도 조회한 것을 병합
          if (f.lineFeedbacks && f.lineFeedbacks.length > 0) {
            // 별도 조회한 것이 더 최신이므로 우선 사용
            const existingLineNumbers = new Set(lineFeedbacksData.map(lf => lf.lineFeedbackId));
            const additionalFromDetail = f.lineFeedbacks.filter(lf => 
              !existingLineNumbers.has(lf.lineFeedbackId)
            );
            lineFeedbacksData = [...lineFeedbacksData, ...additionalFromDetail];
          }
        } catch {
          // 실패 시 상세 조회에 포함된 것 사용
          lineFeedbacksData = f.lineFeedbacks || [];
        }
        
        // 최종 라인 피드백 데이터 설정
        f.lineFeedbacks = lineFeedbacksData;

        setFeedback(f);
        setEditContent(f.content);
        setEditRating(f.rating);
        
        // 라인 피드백을 수정용 형식으로 변환
        const mappedLineFeedbacks = lineFeedbacksData.map((lf) => ({
          id: lf.lineFeedbackId,
          start: Number(lf.lineNumber) || 0,
          end: Number(lf.endLineNumber) || Number(lf.lineNumber) || 0,
          text: lf.content || "",
          editing: false,
          createdAt: lf.createdAt,
          lineFeedbackId: lf.lineFeedbackId,
        }));
        setEditLineFeedbacks(mappedLineFeedbacks);

        // 댓글(=replies) 매핑
        const mappedReplies = (f.comments || []).map((c) => {
          const name = c.userName || "익명";
          return {
            id: c.commentId,
            author: name,
            avatar: makeAbsoluteImageUrl(c.userPicture) || baseProfile,
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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".feedback-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ===================================================
  // 2. 좋아요 / 수정 / 삭제 / 댓글 CRUD
  // ===================================================

  const baseLikes = feedback?.likesCount ?? 0;
  const detailLikes = baseLikes + (detailLiked ? 1 : 0);

  // ===================================================
  // 피드백 수정/삭제 권한 체크
  // ===================================================
  const canEditOrDelete = () => {
    if (!isAuthed || !feedback) return false;
    
    const currentUsername = getCurrentUsername();
    if (!currentUsername) return false;
    
    // 관리자는 항상 수정/삭제 가능
    if (isAdmin()) return true;
    
    // 피드백 작성자만 수정/삭제 가능
    return feedback.userName === currentUsername;
  };

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
      // 1. 피드백 본문 수정
      const body = {
        postId: feedback.postId,
        content: editContent,
        rating: editRating,
      };
      const res = await api.put(`/api/feedback/${feedbackId}`, body);
      const updated = res?.data || res; // eslint-disable-line no-unused-vars

      // 2. 라인 피드백 변경사항 저장
      // 기존 라인 피드백 ID 목록
      const existingLineFeedbackIds = new Set(
        (feedback.lineFeedbacks || []).map(lf => lf.lineFeedbackId)
      );
      
      // 현재 편집 중인 라인 피드백 ID 목록
      const currentLineFeedbackIds = new Set(
        editLineFeedbacks.map(lf => lf.lineFeedbackId).filter(Boolean)
      );
      
      // 삭제할 라인 피드백 (기존에 있던 것 중 현재 없는 것)
      const toDelete = Array.from(existingLineFeedbackIds).filter(
        id => !currentLineFeedbackIds.has(id)
      );
      
      // 수정할 라인 피드백 (기존 ID가 있는 것)
      const toUpdate = editLineFeedbacks.filter(lf => lf.lineFeedbackId);
      
      // 추가할 라인 피드백 (기존 ID가 없는 것)
      const toAdd = editLineFeedbacks.filter(lf => !lf.lineFeedbackId);
      
      // 삭제
      for (const lineFeedbackId of toDelete) {
        try {
          await api.delete(`/api/feedback/${feedbackId}/line/${lineFeedbackId}`);
        } catch (err) {
          console.error(`라인 피드백 삭제 실패 (ID: ${lineFeedbackId}):`, err);
        }
      }
      
      // 수정
      for (const lf of toUpdate) {
        try {
          await api.put(`/api/feedback/${feedbackId}/line/${lf.lineFeedbackId}`, {
            lineNumber: lf.start,
            endLineNumber: lf.end,
            content: lf.text || "",
          });
        } catch (err) {
          console.error(`라인 피드백 수정 실패 (ID: ${lf.lineFeedbackId}):`, err);
        }
      }
      
      // 추가
      for (const lf of toAdd) {
        try {
          await api.post(`/api/feedback/${feedbackId}/line`, {
            lineNumber: lf.start,
            endLineNumber: lf.end,
            content: lf.text || "",
          });
        } catch (err) {
          console.error("라인 피드백 추가 실패:", err);
        }
      }

      // 3. 데이터 다시 불러오기
      const fbRes = await getFeedbackDetail(feedbackId);
      const f = fbRes?.data || fbRes;
      
      let lineFeedbacksData = [];
      try {
        const lineFbRes = await getLineFeedbacks(feedbackId);
        lineFeedbacksData = Array.isArray(lineFbRes) ? lineFbRes : (lineFbRes?.data || []);
      } catch {
        lineFeedbacksData = f.lineFeedbacks || [];
      }
      f.lineFeedbacks = lineFeedbacksData;
      
      setFeedback(f);
      setEditContent(f.content);
      setEditRating(f.rating);
      
      // 라인 피드백 업데이트
      const mappedLineFeedbacks = lineFeedbacksData.map((lf) => ({
        id: lf.lineFeedbackId,
        start: Number(lf.lineNumber) || 0,
        end: Number(lf.endLineNumber) || Number(lf.lineNumber) || 0,
        text: lf.content || "",
        editing: false,
        createdAt: lf.createdAt,
        lineFeedbackId: lf.lineFeedbackId,
      }));
      setEditLineFeedbacks(mappedLineFeedbacks);
      
      setIsEditing(false);
      alert("피드백이 수정되었습니다.");
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
        avatar: makeAbsoluteImageUrl(c.userPicture) || baseProfile,
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
  const lineFeedbacks = (feedback.lineFeedbacks || []).map((lf) => {
    // content 필드가 명시적으로 있는지 확인
    const content = lf.content !== null && lf.content !== undefined 
      ? String(lf.content) 
      : "";
    
    const result = {
      start: Number(lf.lineNumber) || 0,
      end: Number(lf.endLineNumber) || Number(lf.lineNumber) || 0,
      text: content.trim(),
      createdAt: lf.createdAt,
    };
    
    return result;
  }).filter((lf) => lf.start > 0);

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
                <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-green-100 border border-gray-300">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = baseProfile;
                    }}
                  />
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
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-300">
                <img
                  src={makeAbsoluteImageUrl(feedback.userPicture) || baseProfile}
                  alt={feedback.userName || "작성자"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = baseProfile;
                  }}
                />
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
                  {/* 채택되지 않은 경우에만 수정/삭제 노출 (작성자만 보이도록) */}
                  {!feedback.adoptedTF && !isEditing && canEditOrDelete() && (
                    <div className="relative feedback-menu-container ml-4">
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
                            setIsEditing(true);
                            // 수정 모드 진입 시 현재 라인 피드백을 편집용으로 설정
                            const mapped = (feedback.lineFeedbacks || []).map((lf) => ({
                              id: lf.lineFeedbackId,
                              start: Number(lf.lineNumber) || 0,
                              end: Number(lf.endLineNumber) || Number(lf.lineNumber) || 0,
                              text: lf.content || "",
                              editing: false,
                              createdAt: lf.createdAt,
                              lineFeedbackId: lf.lineFeedbackId,
                            }));
                            setEditLineFeedbacks(mapped);
                          }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <FaEdit className="text-blue-600" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleDelete();
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
                  {isEditing && (
                    <div className="flex gap-2 text-xs text-gray-500">
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
                            // 취소 시 원래 라인 피드백으로 복원
                            const mapped = (feedback.lineFeedbacks || []).map((lf) => ({
                              id: lf.lineFeedbackId,
                              start: Number(lf.lineNumber) || 0,
                              end: Number(lf.endLineNumber) || Number(lf.lineNumber) || 0,
                              text: lf.content || "",
                              editing: false,
                              createdAt: lf.createdAt,
                              lineFeedbackId: lf.lineFeedbackId,
                            }));
                            setEditLineFeedbacks(mapped);
                          }}
                      >
                        취소
                      </button>
                    </div>
                  )}
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
                {isEditing ? (
                  <FeedbackCodeEditor
                    value={post.code}
                    language={editorLanguage}
                    title="피드백 수정 모드"
                    initialFeedbacks={editLineFeedbacks}
                    onRangesChange={(ranges) => {
                      // FeedbackCodeEditor의 ranges와 editLineFeedbacks 동기화
                      setEditLineFeedbacks((prev) => {
                        // 기존 lineFeedbackId 유지하면서 업데이트
                        return ranges.map((range) => {
                          const existing = prev.find((p) => p.id === range.id);
                          return {
                            ...range,
                            lineFeedbackId: existing?.lineFeedbackId || null,
                          };
                        });
                      });
                    }}
                    onAddFeedbackRange={(range) => {
                      setEditLineFeedbacks((prev) => [...prev, {
                        ...range,
                        lineFeedbackId: null, // 새로 추가되는 것
                      }]);
                    }}
                    onSaveFeedback={(item) => {
                      setEditLineFeedbacks((prev) => {
                        const exists = prev.some((r) => r.id === item.id);
                        if (exists) {
                          return prev.map((r) => (r.id === item.id ? {
                            ...item,
                            lineFeedbackId: r.lineFeedbackId, // 기존 ID 유지
                          } : r));
                        } else {
                          return [...prev, {
                            ...item,
                            lineFeedbackId: null,
                          }];
                        }
                      });
                    }}
                    onRemoveFeedback={(removed) => {
                      setEditLineFeedbacks((prev) => 
                        prev.filter((r) => r.id !== removed.id)
                      );
                    }}
                  />
                ) : (
                  <FeedbackReadonlyCodeEditor
                    value={post.code}
                    language={editorLanguage}
                    title="피드백된 코드"
                    feedbacks={lineFeedbacks}
                  />
                )}
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
                language={editorLanguage}
                title="읽기 전용"
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
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-300 mr-3">
                            <img
                              src={fb.avatar}
                              alt={fb.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = baseProfile;
                              }}
                            />
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
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-300">
                      <img
                        src={baseProfile}
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
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
