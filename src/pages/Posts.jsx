import React from 'react'
import { FaSearch } from "react-icons/fa";
import HeaderLoggedIn from '../components/header/HeaderLoggedIn'
import CollapsibleFilter from '../components/filter/CollapsibleFilter';
import language from '../components/filter/language';
import stacks from '../components/filter/stacks';

function Posts() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <HeaderLoggedIn />
      <div className="flex items-center justify-center p-10 space-x-10">

        {/* 사이드바 */}
        <div className="space-y-10">
          {/* 검색창 */}
          <div className='flex space-x-2 px-5 py-3 bg-white border border-gray-300 rounded-2xl'>
            <input
              type="text"
              placeholder="제목, 내용, 아이디로 검색"
            />
            <button >
              <FaSearch color="#00C839" size={20}/>
            </button>
          </div>
          {/* 프로그래밍 언어 필터 */}
          <CollapsibleFilter title="프로그래밍 언어" options={language} />
          {/* 기술 스택 필터 */}
          <CollapsibleFilter title="기술 스택" options={stacks} />
        </div>

        {/* 게시물 목록 */}
        <div>
          {/* 필터 */}
          <div className="flex border p-4 rounded-lg shadow-md">
            <div className='flex space-x-4'>
              <h1 className="text-xl font-semibold">개발</h1>
              <h1 className="text-xl font-semibold">코딩테스트</h1>
            </div>
            <select className="p-2 bg-[#f9f9f9]">
              <option value="category1">최신순</option>
              <option value="category2">조회순</option>
              <option value="category3">피드백 많은 순</option>
            </select>
          </div>
          {/* 게시물 */}
          <div>
            <div className="bg-white border p-4 rounded-lg">
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