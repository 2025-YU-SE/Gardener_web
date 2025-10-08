import React from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const HeaderAuth = () => {
  return (
    <div className="flex items-center justify-between w-full h-[60px] bg-[#E8FCEF]">
      <Link className="flex items-center space-x-1 pl-[100px]" to="/landing">
        <img src={logo} alt="logo" className="w-[60px] h-[60px]" />
        <div className="text-[20px] font-semibold">Code Gardener</div>
      </Link>
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

export default HeaderAuth;
