import React from 'react'
import Header from '../components/header/Header'
import { FiChevronLeft } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { samplePosts } from '../components/postcontext'

function FeedbackDetail() {
  const { postId } = useParams()
  const idNum = Number(postId)
  const post = (Number.isNaN(idNum)
    ? samplePosts[0]
    : samplePosts.find(p => p.id === idNum)) || samplePosts[0]
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
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">상세 내용</section>

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


