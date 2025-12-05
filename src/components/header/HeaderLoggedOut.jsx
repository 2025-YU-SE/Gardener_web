import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

// 비로그인 사용자용 헤더
const HeaderLoggedOut = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: "/posts", label: "코드 정원" },
    { path: "/upload", label: "코드 심기" },
    { path: "/leader-board", label: "리더보드" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative w-full bg-white border-b-2 border-gray-200">
      <div className="flex items-center justify-between w-full h-[60px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* 로고 */}
        <Link 
          className="flex items-center space-x-2 shrink-0" 
          to="/landing"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={logo} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px]" />
          <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Code Gardener</div>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex items-center space-x-8 xl:space-x-12 flex-1 justify-center">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive(item.path)
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 우측 영역 */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* 데스크톱: 로그인 + 회원가입 */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/sign-in"
              className="px-4 py-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-[#4D4D4D] hover:bg-[#212121] rounded-lg transition-colors"
            >
              회원가입
            </Link>
          </div>

          {/* 모바일: 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
            aria-label="메뉴"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex flex-col py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-4 text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-green-600 bg-green-50 border-l-4 border-green-600"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                to="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-4 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/sign-up"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-4 text-base font-medium text-white bg-[#4D4D4D] hover:bg-[#212121] transition-colors mx-4 rounded-lg text-center mt-2"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderLoggedOut;
