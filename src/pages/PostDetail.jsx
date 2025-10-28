import React, { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaEye, FaStar } from 'react-icons/fa'
import Header from '../components/header/Header'
import { useParams, useNavigate } from 'react-router-dom'
import { samplePosts } from '../components/postcontext'
import { sampleFeedbacks } from '../components/feedbackContext'
import ReadonlyCodeEditor from '../components/ReadonlyCodeEditor'
import FeedbackCodeEditor from '../components/FeedbackCodeEditor'

function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const idNum = Number(postId)
  const post = (Number.isNaN(idNum)
    ? samplePosts[0]
    : samplePosts.find(p => p.id === idNum)) || samplePosts[0]
  const [selectedFeedbackType, setSelectedFeedbackType] = useState('일반 피드백')
  const [rating, setRating] = useState(5)
  const [feedbackContent, setFeedbackContent] = useState('')
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false)
  const [feedbackSort, setFeedbackSort] = useState('latest')
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false)
  const [isAIFeedbackOpen, setIsAIFeedbackOpen] = useState(false)

  const [postLiked, setPostLiked] = useState(Boolean(post.isLiked))
  const [postBookmarked, setPostBookmarked] = useState(Boolean(post.isBookmarked))
  const [likeBusy, setLikeBusy] = useState(false)
  const [bookmarkBusy, setBookmarkBusy] = useState(false)

  const togglePostLike = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (likeBusy) return
    setLikeBusy(true)
    setPostLiked(prev => !prev)
    setTimeout(() => setLikeBusy(false), 200)
  }

  const togglePostBookmark = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (bookmarkBusy) return
    setBookmarkBusy(true)
    setPostBookmarked(prev => !prev)
    setTimeout(() => setBookmarkBusy(false), 200)
  }

  const [feedbackLikeState, setFeedbackLikeState] = useState({})
  const [feedbackRanges, setFeedbackRanges] = useState([])
  const [isWritingFeedback, setIsWritingFeedback] = useState(false)

  useEffect(() => {
    const init = {}
    sampleFeedbacks
      .filter(f => f.postId === post.id)
      .forEach(f => {
        init[f.id] = { liked: false, count: f.likes ?? 0 }
      })
    setFeedbackLikeState(init)
  }, [post.id])

  const toggleFeedbackLike = (feedbackId) => {
    setFeedbackLikeState(prev => {
      const curr = prev[feedbackId] || { liked: false, count: 0 }
      const nextLiked = !curr.liked
      const nextCount = Math.max(0, curr.count + (nextLiked ? 1 : -1))
      return { ...prev, [feedbackId]: { liked: nextLiked, count: nextCount } }
    })
  }

  const feedbackTypes = ['일반 피드백', '개선 제안', '버그 신고']

  // 피드백 작성
  const startWritingFeedback = () => {
    setIsWritingFeedback(true)
    setIsFeedbackFormOpen(true)
  }

  // 피드백 작성 취소
  const cancelWritingFeedback = () => {
    setIsWritingFeedback(false)
    setIsFeedbackFormOpen(false)
    setFeedbackRanges([])
    setFeedbackContent('')
    setRating(5)
    setSelectedFeedbackType('일반 피드백')
  }

  const handleAddFeedbackRange = (range) => {
    setFeedbackRanges(prev => [...prev, range])
  }

  const handleSaveFeedback = (feedback) => {
    setFeedbackRanges(prev => prev.map(r => 
      r.id === feedback.id ? feedback : r
    ))
  }

  const handleSubmitFeedback = () => {
    console.log('피드백 제출:', {
      content: feedbackContent,
      rating,
      type: selectedFeedbackType,
      ranges: feedbackRanges
    })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 게시물 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* 게시물 제목 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          {/* 게시물 설명 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {post.content}
          </p>
          {/* 작성자 정보 */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {post.avatar || '👤'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{post.timeAgo}</p>
            </div>
          </div>
          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* 통계 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 mb-0">
              {/* 좋아요 */}
               <button
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   e.nativeEvent?.stopImmediatePropagation?.();
                   togglePostLike(e);
                 }}
                 className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                 aria-pressed={postLiked}
               >
                 {postLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                 <span>{postLiked ? (post.likes ?? 0) + 1 : (post.likes ?? 0)}</span>
               </button>
              {/* 스크랩 */}
               <button
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   e.nativeEvent?.stopImmediatePropagation?.();
                   togglePostBookmark(e);
                 }}
                 className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                 aria-pressed={postBookmarked}
               >
                 {postBookmarked ? <FaBookmark className="text-blue-500" /> : <FaRegBookmark />}
                 <span>{postBookmarked ? (post.bookmarks ?? 0) + 1 : (post.bookmarks ?? 0)}</span>
               </button>
              {/* 댓글 */}
              <div className="flex items-center space-x-2 text-gray-600">
                <FaComment />
                <span>{post.comments}</span>
              </div>
              {/* 조회수 */}
              <div className="flex items-center space-x-2 text-gray-600">
                <FaEye className="text-gray-500" />
                <span>{post.views}</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsAIFeedbackOpen((v) => !v)}
                className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'
              >
                AI 피드백
              </button>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*코드 에디터 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {isWritingFeedback ? (
                <FeedbackCodeEditor
                  value={`// 샘플 코드\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst result = fibonacci(10);\nconsole.log('피보나치 수열 10번째:', result);`}
                  language="javascript"
                  title="JAVASCRIPT - 피드백 모드"
                  onAddFeedbackRange={handleAddFeedbackRange}
                  onSaveFeedback={handleSaveFeedback}
                  initialFeedbacks={feedbackRanges}
                />
              ) : (
                <ReadonlyCodeEditor
                  value={`// 샘플 코드\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst result = fibonacci(10);\nconsole.log('피보나치 수열 10번째:', result);`}
                  language="javascript"
                  title="JAVASCRIPT - 읽기 전용"
                />
              )}
            </div>
            {isAIFeedbackOpen && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI 피드백</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {`코드 전반에서 변수 네이밍이 일관적이며 가독성이 좋습니다.\n\n개선 제안:\n- 불변성 보장을 위해 배열/객체 업데이트 시 전개 연산자를 사용하세요.\n- 연산이 잦은 파생 값은 useMemo로 감싸면 리렌더링 비용을 줄일 수 있습니다.\n- 이벤트 핸들러는 useCallback으로 메모이제이션하면 자식 컴포넌트 재렌더를 방지합니다.`}
                </div>
              </div>
            )}
          </div>

          {/* 피드백 요청 + 작성 + 기존 피드백 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 피드백 요청 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">피드백 요청</h3>
                <div className="space-y-2">
                  {[
                    '성능 최적화에 대한 피드백을 원합니다',
                    '코드 구조 개선 방안을 알고 싶습니다',
                    '접근성(Accessibility) 개선 제안을 받고 싶습니다'
                  ].map((request, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                    >
                      {request}
                    </div>
                  ))}
                </div>
              </div>

              {/* 피드백 작성 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">피드백 작성</h3>
                {!isFeedbackFormOpen ? (
                  <button
                    type="button"
                    onClick={startWritingFeedback}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    피드백 작성하기
                  </button>
                ) : (
                  <div>
                    {/* 피드백 유형 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">피드백 유형</label>
                      <div className="flex space-x-2">
                        {feedbackTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedFeedbackType(type)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              selectedFeedbackType === type
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* 평점 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-2xl transition-colors"
                          >
                            <FaStar 
                              className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* 피드백 내용 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">피드백 내용</label>
                      <textarea
                        value={feedbackContent}
                        onChange={(e) => setFeedbackContent(e.target.value)}
                        placeholder="새싹에 대한 피드백을 작성해주세요. 구체적이고 건설적인 피드백이 도움이 됩니다."
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-1">{feedbackContent.length}/1000자</p>
                    </div>
                    {/* 제출/취소 */}
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSubmitFeedback}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        피드백 제출
                      </button>
                      <button
                        type="button"
                        onClick={cancelWritingFeedback}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>

          {/* 기존 피드백 댓글 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">기존 피드백</h3>
            {/* 정렬 옵션 */}
            <div className="mb-3 flex items-center gap-2">
              {[
                { key: 'latest', label: '최신순' },
                { key: 'recommended', label: '추천순' },
                { key: 'detail', label: '상세 피드백 라인 순' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFeedbackSort(opt.key)}
                  className={`px-3 py-1 rounded border text-sm ${
                    feedbackSort === opt.key
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(() => {
                const all = sampleFeedbacks.filter(f => f.postId === post.id)
                const INITIAL_COUNT = 4
                const list = showAllFeedbacks ? all : all.slice(0, INITIAL_COUNT)
                return list.map((fb) => (
                  <div key={fb.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div
                      className="rounded-md p-3 transition-all hover:bg-gray-50 hover:ring-1 hover:ring-gray-200 cursor-pointer"
                      onClick={() => navigate(`/posts/${post.id}/${fb.id}`)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-2">
                          {fb.avatarInitial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{fb.author}</p>
                          <p className="text-xs text-gray-500">{fb.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className={`text-sm ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {fb.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleFeedbackLike(fb.id) }}
                          className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                          aria-pressed={feedbackLikeState[fb.id]?.liked}
                        >
                          {feedbackLikeState[fb.id]?.liked ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span className="text-sm font-medium">{feedbackLikeState[fb.id]?.count ?? fb.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <FaComment className="text-gray-500" />
                          <span>{fb.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaEye className="text-gray-500" />
                          <span>{fb.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
            {(() => {
              const total = sampleFeedbacks.filter(f => f.postId === post.id).length
              const INITIAL_COUNT = 4
              if (showAllFeedbacks || total <= INITIAL_COUNT) return null
              return (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAllFeedbacks(true)}
                    className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    더보기
                  </button>
                </div>
              )
            })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail


