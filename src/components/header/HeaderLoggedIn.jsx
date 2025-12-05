import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import baseProfile from "../../assets/baseProfile.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa";
import { getUserProfile } from "../../api/userApi";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";

// 로그인한 사용자용 헤더
const HeaderLoggedIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const menuItems = [
    { path: "/posts", label: "코드 정원" },
    { path: "/upload", label: "코드 심기" },
    { path: "/leader-board", label: "리더보드" },
  ];

  const isActive = (path) => location.pathname === path;

  // 사용자 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          const response = await getUserProfile(loggedInUserId);
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("프로필 정보 가져오기 실패:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // 프로필 이미지 URL
  const profileImg = userProfile?.userPicture 
    ? makeAbsoluteImageUrl(userProfile.userPicture) || baseProfile
    : baseProfile;

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/sign-in", { replace: true });
  };

  return (
    <nav className="relative w-full bg-white border-b-2 border-gray-200">
      <div className="flex items-center justify-between w-full h-[60px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* 로고 */}
        <Link 
          className="flex items-center space-x-1 sm:space-x-2 shrink-0" 
          to="/main"
          onClick={() => setIsMenuOpen(false)}
        >
          <img 
            src={logo} 
            alt="logo" 
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[60px] lg:h-[60px]" 
          />
          <div className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold text-gray-800 whitespace-nowrap">
            Code Gardener
          </div>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-colors whitespace-nowrap ${
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
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 shrink-0">
          {/* 데스크톱: 로그아웃 + 마이페이지 */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={handleLogout}
              className="flex justify-center items-center text-sm cursor-pointer hover:text-green-600 transition whitespace-nowrap"
            >
              로그아웃
            </button>
            <img
              src={profileImg}
              alt="프로필"
              className="w-[32px] h-[32px] rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/my-paged")}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = baseProfile;
              }}
            />
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
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-4 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              >
                로그아웃
              </button>
              <div
                onClick={() => {
                  navigate("/my-paged");
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <img
                  src={profileImg}
                  alt="프로필"
                  className="w-[32px] h-[32px] rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = baseProfile;
                  }}
                />
                마이페이지
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderLoggedIn;
