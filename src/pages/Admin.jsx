import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import Header from "../components/header/Header";
import WriteCodeEditor from "../components/WriteCodeEditor";
import CollapsibleFilter from "../components/filter/CollapsibleFilter";
import language from "../components/filter/language";
import stacks from "../components/filter/stacks";
import { getPosts, updatePost, deletePost } from "../api/postApi";
import { getAllFeedbacks, updateFeedback, deleteFeedback } from "../api/feedbackApi";

const getLanguageCode = (languageName) => {
  const languageMap = {
    'JavaScript': 'javascript',
    'Python': 'python',
    'Java': 'java',
    'C': 'c',
    'C++': 'cpp',
    'C#': 'csharp',
    'Ruby': 'ruby',
    'Go': 'go',
    'PHP': 'php',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'TypeScript': 'typescript',
  };
  return languageMap[languageName] || 'javascript';
};

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "feedbacks"
  
  const [posts, setPosts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingPost, setEditingPost] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "posts") {
        const res = await getPosts();
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
        const data = await getAllFeedbacks();
        const list = Array.isArray(data) ? data : data?.content || data || [];
        const mapped = list.map((fb) => ({
          id: fb.feedbackId,
          postId: fb.postId,
          author: fb.userName || "익명",
          title: fb.title || "",
          content: fb.content || "",
          rating: fb.rating || 0,
          timeAgo: fb.createdAt ? fb.createdAt.slice(0, 10) : "",
          likes: fb.likesCount || 0,
        }));
        setFeedbacks(mapped);
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      languages: post.languages || "JavaScript",
      stacks: post.stacks ? [post.stacks] : [],
      category: post.category || "개발",
      code: post.code || "",
    });
  };

  const handleSavePost = async (postId) => {
    try {
      await updatePost(postId, editForm);
      alert("게시물이 수정되었습니다.");
      setEditingPost(null);
      loadData();
    } catch (err) {
      console.error("게시물 수정 실패:", err);
      alert("게시물 수정에 실패했습니다.");
    }
  };

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

  // 피드백 수정/삭제
  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback.id);
    setEditForm({
      title: feedback.title || "",
      content: feedback.content || "",
      rating: feedback.rating || 0,
    });
  };

  const handleSaveFeedback = async (feedbackId) => {
    try {
      await updateFeedback(feedbackId, editForm);
      alert("피드백이 수정되었습니다.");
      setEditingFeedback(null);
      loadData();
    } catch (err) {
      console.error("피드백 수정 실패:", err);
      alert("피드백 수정에 실패했습니다.");
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
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

        {/* 탭 */}
        <div className="flex space-x-4 mb-6 border-b">
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
                  className="bg-white border border-gray-300 p-6 rounded-xl"
                >
                  {editingPost === post.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">제목</label>
                        <input
                          type="text"
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">내용</label>
                        <textarea
                          className="w-full border rounded-md px-3 py-2"
                          rows="4"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({ ...editForm, content: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">언어</label>
                          <CollapsibleFilter
                            title="프로그래밍 언어"
                            options={language}
                            showSelected={true}
                            selectedOptions={[editForm.languages]}
                            onSelectionChange={(selection) => {
                              if (selection.length > 0) {
                                setEditForm({ ...editForm, languages: selection[0] });
                              }
                            }}
                            singleSelect={true}
                            roundedClass="rounded-lg"
                            titleClass="font-normal text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">스택</label>
                          <CollapsibleFilter
                            title="기술 스택"
                            options={stacks}
                            showSelected={true}
                            selectedOptions={Array.isArray(editForm.stacks) ? editForm.stacks : (editForm.stacks ? [editForm.stacks] : [])}
                            onSelectionChange={(selection) => {
                              setEditForm({ ...editForm, stacks: selection });
                            }}
                            singleSelect={false}
                            roundedClass="rounded-lg"
                            titleClass="font-normal text-gray-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">카테고리</label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value })
                          }
                        >
                          <option value="개발">개발</option>
                          <option value="코딩테스트">코딩테스트</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">코드</label>
                        <WriteCodeEditor
                          value={editForm.code || ""}
                          onChange={(value) =>
                            setEditForm({ ...editForm, code: value })
                          }
                          language={getLanguageCode(editForm.languages)}
                          height={400}
                          title={`${editForm.languages?.toUpperCase() || "JAVASCRIPT"} - 수정 모드`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSavePost(post.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="수정"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="삭제"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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
                  className="bg-white border border-gray-300 p-6 rounded-xl"
                >
                  {editingFeedback === feedback.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">제목</label>
                        <input
                          type="text"
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">내용</label>
                        <textarea
                          className="w-full border rounded-md px-3 py-2"
                          rows="6"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({ ...editForm, content: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">평점</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.rating}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              rating: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveFeedback(feedback.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingFeedback(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {feedback.title || "제목 없음"}
                          </h3>
                          <div className="max-h-[200px] overflow-y-auto pr-2 mb-2">
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {feedback.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
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
                            onClick={() => handleEditFeedback(feedback)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="수정"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(feedback.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="삭제"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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

