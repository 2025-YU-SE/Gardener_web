import React, { useEffect, useState } from 'react'
import Header from '../components/header/Header'
import { FiChevronLeft } from 'react-icons/fi'
import { FaHeart, FaRegHeart, FaComment, FaStar } from 'react-icons/fa'
import { BsSend } from 'react-icons/bs'
import { useParams, useNavigate } from 'react-router-dom'
import { samplePosts } from '../components/postcontext'
import { sampleFeedbacks } from '../components/feedbackContext'
import { sampleReplies } from '../components/replyContext'
import FeedbackCodeEditor from '../components/FeedbackCodeEditor'
import ReadonlyCodeEditor from '../components/ReadonlyCodeEditor'
import FeedbackReadonlyCodeEditor from '../components/FeedbackReadonlyCodeEditor'

function FeedbackDetail() {
  const navigate = useNavigate()
  const { postId, feedbackId } = useParams()
  const idNum = Number(postId)
  const post = (Number.isNaN(idNum)
    ? samplePosts[0]
    : samplePosts.find(p => p.id === idNum)) || samplePosts[0]
  const feedbackIdNum = Number(feedbackId)
  const mainFeedback = (
    (!Number.isNaN(feedbackIdNum) && sampleFeedbacks.find(f => f.id === feedbackIdNum && f.postId === post.id)) ||
    sampleFeedbacks.find(f => f.postId === post.id) ||
    sampleFeedbacks[0]
  )
  const replies = sampleReplies.filter(r => r.postId === post.id && r.parentFeedbackId === mainFeedback?.id)
  const replyCount = replies.length
  const [detailLiked, setDetailLiked] = useState(false)
  const baseLikes = mainFeedback?.likes ?? 0
  const detailLikes = baseLikes + (detailLiked ? 1 : 0)
  const toggleDetailLike = () => setDetailLiked(v => !v)
  const [replyLikeState, setReplyLikeState] = useState({})
  useEffect(() => {
    const init = {}
    replies.forEach(f => {
      init[f.id] = { liked: false, count: f.likes ?? 0 }
    })
    setReplyLikeState(init)
  }, [post.id, mainFeedback?.id])
  const toggleReplyLike = (id) => {
    setReplyLikeState(prev => {
      const curr = prev[id] || { liked: false, count: 0 }
      const nextLiked = !curr.liked
      const nextCount = Math.max(0, curr.count + (nextLiked ? 1 : -1))
      return { ...prev, [id]: { liked: nextLiked, count: nextCount } }
    })
  }
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-gray-500 mb-4 hover:text-gray-700">
          <FiChevronLeft className="text-gray-400" />
          <span>피드백으로 돌아가기</span>
        </button>

        {/* 요약 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center">{post.avatar || '👤'}</div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{post.title}</h1>
                <div className="mt-0.5 text-[11px] sm:text-xs text-gray-500">{post.author} · {post.timeAgo}</div>
              </div>
            </div>
            <div className="ml-4 flex flex-wrap gap-2">
              {(post.tags || []).map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 상세 내용 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          {/* 작성자 */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
              {mainFeedback?.avatarInitial || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{mainFeedback?.author || '작성자'}</span>
                <span>·</span>
                <span>{mainFeedback?.timeAgo || ''}</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className={`${star <= (mainFeedback?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="text-sm text-gray-700 leading-6 whitespace-pre-line">
            {mainFeedback?.content || '상세 내용 본문이 들어갑니다.'}
          </div>

          {/* 관련 코드 */}
          <div className="mt-5">
            <div className="text-sm font-semibold text-gray-800 mb-2">관련 코드</div>
            <div className="rounded-md overflow-hidden">
              <FeedbackReadonlyCodeEditor
                value={`// 사용자 인증 및 데이터 처리 함수들
function validateUser(user) {
  if (!user.email || !user.password) {
    return false;
  }
  return true;
}

function processUserData(users) {
  const validUsers = [];
  for (let i = 0; i < users.length; i++) {
    if (validateUser(users[i])) {
      validUsers.push(users[i]);
    }
  }
  return validUsers;
}

// API 호출 함수
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

// 데이터 변환 및 필터링
function transformUserData(rawData) {
  const processed = rawData.map(user => ({
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    email: user.email.toLowerCase(),
    isActive: user.status === 'active'
  }));
  
  return processed.filter(user => user.isActive);
}`}
                language="javascript"
                title="JAVASCRIPT - 피드백된 코드"
                feedbacks={[
                  {
                    start: 2,
                    end: 6,
                    text: `🔍 **유효성 검사 개선 필요**\n\n현재 검사가 너무 단순합니다. 다음을 고려해보세요:\n• 이메일 형식 검증 (정규식 사용)\n• 비밀번호 강도 검사\n• 에러 메시지 반환으로 디버깅 개선`,
                    createdAt: new Date('2024-01-15T10:30:00')
                  },
                  {
                    start: 8,
                    end: 16,
                    text: `⚡ **성능 최적화 제안**\n\nfor 루프 대신 함수형 프로그래밍을 사용하면 더 읽기 쉽습니다:\n\`\`\`javascript\nconst validUsers = users.filter(validateUser);\n\`\`\`\n• 코드가 더 간결해집니다\n• 함수형 프로그래밍 패턴 활용`,
                    createdAt: new Date('2024-01-15T10:35:00')
                  },
                  {
                    start: 19,
                    end: 28,
                    text: `🛡️ **에러 처리 개선**\n\n현재 에러 처리가 부족합니다:\n• 구체적인 에러 타입별 처리\n• 사용자에게 친화적인 에러 메시지\n• 로깅 시스템 연동 고려\n• 재시도 로직 추가 검토`,
                    createdAt: new Date('2024-01-15T10:40:00')
                  },
                  {
                    start: 32,
                    end: 39,
                    text: `📝 **코드 가독성 향상**\n\n변수명과 구조를 개선해보세요:\n• \`processed\` → \`transformedUsers\`\n• \`isActive\` → \`isUserActive\`\n• 중첩된 객체 구조 분해 할당 사용\n• 함수 분리로 단일 책임 원칙 적용`,
                    createdAt: new Date('2024-01-15T10:45:00')
                  },
                  {
                    start: 41,
                    end: 41,
                    text: `💡 **추가 개선사항**\n\n• TypeScript 도입으로 타입 안정성 확보\n• 단위 테스트 작성\n• JSDoc 주석 추가\n• ESLint 규칙 적용`,
                    createdAt: new Date('2024-01-15T10:50:00')
                  }
                ]}
              />
            </div>
          </div>

          {/* 피드백 유형 태그 */}
          <div className="mt-3 mb-1 flex flex-wrap gap-2">
            {['개선 제안'].map((type) => (
              <span key={type} className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">{type}</span>
            ))}
          </div>

          {/* 좋아요, 답글 수 */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <button type="button" onClick={toggleDetailLike} className="inline-flex items-center gap-1 hover:opacity-90">
              {detailLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span className="text-sm font-medium">{detailLikes}</span>
            </button>
            <div className="inline-flex items-center gap-1"><FaComment /> {replyCount}</div>
          </div>
        </section>

        {/* 코드에디터 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <ReadonlyCodeEditor
                  value={`// 샘플 코드\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst result = fibonacci(10);\nconsole.log('피보나치 수열 10번째:', result);`}
                  language="javascript"
                  title="JAVASCRIPT - 읽기 전용"
                />
          </div>
          {/* 답글 */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">답글 ({replyCount}개)</h2>
            <div className="space-y-4">
              {replies.map((fb, idx) => (
                <div key={fb.id} className={`py-4 ${idx !== replies.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold mr-3">{fb.avatarInitial}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900">{fb.author}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500">{fb.timeAgo}</span>
                      </div>
                      <p className="mt-2 text-gray-700 text-sm leading-relaxed">{fb.content}</p>
                      <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                        <button type="button" onClick={() => toggleReplyLike(fb.id)} className="inline-flex items-center gap-1 hover:opacity-90">
                          {replyLikeState[fb.id]?.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                          <span className="text-sm font-medium">{replyLikeState[fb.id]?.count ?? fb.likes ?? 0}</span>
                        </button>
                        <button type="button" className="text-gray-500 hover:text-gray-700">답글</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 입력 박스 */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">👤</div>
                  <div className="w-full">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <textarea rows={5} placeholder="이 피드백에 대한 의견을 남겨주세요..."
                        className="w-full min-h-28 outline-none focus:ring-0 resize-none border-0 p-0" />
                      <div className="flex justify-end mt-2">
                        <button className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700">
                          <BsSend />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

export default FeedbackDetail


