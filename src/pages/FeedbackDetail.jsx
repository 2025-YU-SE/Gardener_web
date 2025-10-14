import React, { useState } from 'react'
import Header from '../components/header/Header'
import { FiChevronLeft } from 'react-icons/fi'
import { FaHeart, FaRegHeart, FaComment, FaStar } from 'react-icons/fa'
import { AiFillStar } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { samplePosts } from '../components/postcontext'
import { sampleFeedbacks } from '../components/feedbackContext'

function FeedbackDetail() {
  const { postId } = useParams()
  const idNum = Number(postId)
  const post = (Number.isNaN(idNum)
    ? samplePosts[0]
    : samplePosts.find(p => p.id === idNum)) || samplePosts[0]
  const mainFeedback = (sampleFeedbacks.find(f => f.postId === post.id) || sampleFeedbacks[0])
  const replyCount = sampleFeedbacks.filter(f => f.postId === post.id).length
  const [detailLiked, setDetailLiked] = useState(false)
  const baseLikes = mainFeedback?.likes ?? 0
  const detailLikes = baseLikes + (detailLiked ? 1 : 0)
  const toggleDetailLike = () => setDetailLiked(v => !v)
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <FiChevronLeft className="text-gray-400" />
          <span>피드백으로 돌아가기</span>
        </div>

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
            <div className="rounded-md overflow-hidden bg-[#0B1221] border border-[#0F172A]">
              .
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
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">코드 에디터</div>
        {/* 답글 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">답글</section>
        </section>
      </div>
    </div>
  )
}

export default FeedbackDetail


