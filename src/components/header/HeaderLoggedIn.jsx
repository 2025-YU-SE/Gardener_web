import React from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";

// 로그인한 사용자용 헤더
const HeaderLoggedIn = () => {
  return (
    <div className="flex items-center justify-between w-full h-[60px]">
      <Link className="flex items-center space-x-1 pl-[80px]" to="/landing">
        <img src={logo} alt="logo" className="w-[60px] h-[60px]" />
        <div className="text-[20px] font-semibold">Code Gardener</div>
      </Link>

      <div className="flex-1 pl-[250px] flex items-center space-x-20 text-[14px] font-medium">
        <Link to="/posts">코드 정원</Link>
        <Link to="/upload">코드 심기</Link>
        <Link to="/leader-board">리더보드</Link>
        <Link to="*">메뉴4</Link> {/*추후 메뉴 수정*/}
      </div>

      <div className="flex space-x-8 pr-[120px]">
        {/* 추후 로그아웃 버튼 클릭 시 로그아웃 모달창 구현 */}
        <button className="flex justify-center items-center text-[12px] cursor-pointer">
          로그아웃
        </button>
        {/* 추후 사용자 실제 프로필 연동 */}
        <IoPersonCircle className="text-[#B9B9B9] w-[32px] h-[32px] cursor-pointer" />
      </div>
    </div>
  );
};

export default HeaderLoggedIn;
