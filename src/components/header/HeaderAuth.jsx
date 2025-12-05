import React from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

// 로그인/회원가입 화면용 헤더
const HeaderAuth = () => {
  return (
    <nav className="flex items-center justify-between w-full h-[60px] bg-transparent px-4 sm:px-6 md:px-8 lg:px-12">
      <Link className="flex items-center space-x-2 shrink-0" to="/landing">
        <img src={logo} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px]" />
        <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Code Gardener</div>
      </Link>

      <div className="flex items-center space-x-3 shrink-0">
        <Link
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-green-600 transition-colors"
          to="/sign-in"
        >
          로그인
        </Link>
        <Link
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#4D4D4D] hover:bg-[#212121] rounded-lg transition-colors"
          to="/sign-up"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
};

export default HeaderAuth;
