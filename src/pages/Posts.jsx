import React, { useState } from 'react'
import { FaSearch, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaEye, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoMdMore, IoMdTime } from "react-icons/io";
import Header from '../components/header/Header';
import CollapsibleFilter from '../components/filter/CollapsibleFilter';
import language from '../components/filter/language';
import stacks from '../components/filter/stacks';
import { samplePosts } from '../components/postcontext';
import { 
  getCurrentPageData, 
  getTotalPages, 
  getPrevPage, 
  getNextPage,
  isValidPageNumber 
} from '../utils/pagination';

function Posts() {
  const [selectedCategory, setSelectedCategory] = useState('개발');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4); // 페이지당 4개 게시물
  
  const [posts, setPosts] = useState(samplePosts);

  // 좋아요
  const toggleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  // 북마크
  const toggleBookmark = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isBookmarked: !post.isBookmarked,
              bookmarks: post.isBookmarked ? post.bookmarks - 1 : post.bookmarks + 1
            }
          : post
      )
    );
  };

  const totalPages = getTotalPages(posts, postsPerPage);
  const currentPosts = getCurrentPageData(posts, currentPage, postsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(getPrevPage(currentPage));
  const goToNextPage = () => setCurrentPage(getNextPage(currentPage, totalPages));
  const goToPage = (pageNumber) => {
    if (isValidPageNumber(pageNumber, totalPages)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <div className="flex max-w-7xl mx-auto px-6 py-10  gap-8">

        {/* 사이드바 */}
        <div className="space-y-10 py-8">
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
        <div className='flex flex-col flex-1 min-w-0 py-4 max-w-4xl'>
          {/* 필터 */}
          <div className="flex justify-between items-center p-4">
            <div className='flex space-x-8'>
              <button 
                onClick={() => setSelectedCategory('개발')}
                className={`text-2xl font-semibold pb-2 border-b-2 transition-colors ${
                  selectedCategory === '개발' 
                    ? 'text-black border-black' 
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                개발
              </button>
              <button 
                onClick={() => setSelectedCategory('코딩테스트')}
                className={`text-2xl font-semibold pb-2 border-b-2 transition-colors ${
                  selectedCategory === '코딩테스트' 
                    ? 'text-black border-black' 
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                코딩테스트
              </button>
            </div>
            <select className="p-2 w-[80px] bg-[#f9f9f9]">
              <option value="category1">최신순</option>
              <option value="category2">조회순</option>
              <option value="category3">피드백 많은 순</option>
            </select>
          </div>
          {/* 게시물 */}
          <div className="space-y-6 my-6" >
            {currentPosts.map(post => (
              <div key={post.id} className="bg-white border border-gray-300 p-6 rounded-xl hover:shadow-md transition-shadow">
                {/* 사용자 정보 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-gray-300 border">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{post.author}</div>
                      <div className="text-sm text-gray-500"><IoMdTime className="inline-block mr-1" /> {post.timeAgo}</div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <IoMdMore size={24} />
                  </button>
                </div>
                {/* 게시물 내용 */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed line-clamp-2 min-h-[3rem] max-h-[3rem]">
                    {post.content}
                  </p>
                </div>
                {/* 태그들 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        index === 0 ? 'bg-[#E9FFEA] text-[#00B834]' :
                        'bg-[#00B834] text-white'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* 하단 액션 바 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    {/* 좋아요 */}
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      {post.isLiked ? 
                        <FaHeart className="text-red-500" /> : 
                        <FaRegHeart />
                      }
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    {/* 스크랩 */}
                    <button 
                      onClick={() => toggleBookmark(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      {post.isBookmarked ? 
                        <FaBookmark className="text-blue-500" /> : 
                        <FaRegBookmark />
                      }
                      <span className="text-sm font-medium">{post.bookmarks}</span>
                    </button>
                    {/* 댓글수 */}
                    <button className="flex items-center space-x-2 text-gray-600">
                      <FaComment />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    {/* 조회수 */}
                    <div className="flex items-center space-x-1 text-gray-500">
                      <FaEye />
                      <span className="text-sm">{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 페이지네이션 */}
          <div className="flex justify-center items-center mt-8">
            <div className="flex items-center space-x-1">
              {/* 맨 앞으로 */}
              <button 
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaAngleDoubleLeft />
              </button>

              {/* 이전 페이지 */}
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaAngleLeft />
              </button>

              {/* 페이지 번호 */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      pageNumber === currentPage
                        ? 'text-black font-extrabold'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* 다음 페이지 */}
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaAngleRight />
              </button>

              {/* 맨 뒤로 */}
              <button 
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Posts