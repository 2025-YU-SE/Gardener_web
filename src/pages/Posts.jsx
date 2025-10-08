import React from 'react'
import HeaderLoggedIn from '../components/header/HeaderLoggedIn'

function Posts() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <HeaderLoggedIn />
      <div className="flex items-center justify-center p-10 space-x-10">

        {/* 사이드바 */}
        <div className="border border-black">
          {/* 검색창 */}
          <div>
            <input
              type="text"
              placeholder="제목, 내용, 아이디로 검색"
              className="border p-2 rounded-lg w-full"
            />
            <button className="border border-black p-2 rounded-lg">검색</button>
          </div>
          {/* 프로그래밍 언어 필터 */}
          <div>
            <select className="border p-2 rounded-lg w-full">
              <option value="all">프로그래밍 언어</option>
              <option value="category1">카테고리 1</option>
              <option value="category2">카테고리 2</option>
              <option value="category3">카테고리 3</option>
            </select>
          </div>
          {/* 기술 스택 필터 */}
          <div>
            <select className="border p-2 rounded-lg w-full">
              <option value="all">태그</option>
              <option value="tag1">태그 1</option>
              <option value="tag2">태그 2</option>
              <option value="tag3">태그 3</option>
            </select>
          </div>
        </div>

        {/* 게시물 목록 */}
        <div>
          {/* 필터 */}
          <div className="border p-4 rounded-lg shadow-md">
            <h1 className="text-xl font-semibold">개발</h1>
            <h1 className="text-xl font-semibold">코딩테스트</h1>
              <select className="border p-2 rounded-lg w-full">
              <option value="all">프로그래밍 언어</option>
              <option value="category1">카테고리 1</option>
              <option value="category2">카테고리 2</option>
              <option value="category3">카테고리 3</option>
            </select>
          </div>
          {/* 게시물 */}
          <div>
            <div className="border p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">게시물 제목</h2>
              <p>게시물 내용 요약...</p>
              <p className="text-sm text-gray-500">작성자: 사용자1</p>
            </div>
          </div>
          {/* 페이지네이션 */}
          <div>
            <div className="flex justify-center space-x-2">
              <button className="border border-black p-2 rounded-lg">1</button>
              <button className="border border-black p-2 rounded-lg">2</button>
              <button className="border border-black p-2 rounded-lg">3</button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default Posts