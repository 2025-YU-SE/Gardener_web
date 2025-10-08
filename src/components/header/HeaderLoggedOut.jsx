import React from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

// 비로그인 사용자용 헤더
const HeaderLoggedOut = () => {
  return (
    <div className="flex items-center justify-between w-full h-[60px]">
      <Link className="flex items-center space-x-1 pl-[80px]" to="/landing">
        <img src={logo} alt="logo" className="w-[60px] h-[60px]" />
        <div className="text-[20px] font-semibold">Code Gardener</div>
      </Link>

      <div className="flex-1 pl-[280px] flex items-center space-x-20 text-[14px] font-medium">
        <Link to="/posts">코드 정원</Link>
        <Link to="/upload">코드 심기</Link>
        <Link to="/leader-board">리더보드</Link>
        <Link to="*">메뉴4</Link> {/*추후 메뉴 수정*/}
      </div>

      <div className="flex space-x-8 pr-28">
        <Link
          className="flex justify-center items-center text-[12px]"
          to="/sign-in"
        >
          로그인
        </Link>
        <Link
          className="flex justify-center items-center w-[73px] h-[32px] bg-[#4D4D4D] hover:bg-[#212121] text-[12px] text-white rounded-[6px]"
          to="/sign-up"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default HeaderLoggedOut;
