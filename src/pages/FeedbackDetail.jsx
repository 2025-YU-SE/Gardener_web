import React from 'react'
import Header from '../components/header/Header'
import { FiChevronLeft } from 'react-icons/fi'

function FeedbackDetail() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <FiChevronLeft className="text-gray-400" />
          <span>피드백으로 돌아가기</span>
        </div>

        {/* 요약 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">요약</section>

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


