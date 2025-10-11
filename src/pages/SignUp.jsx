import React from "react";
import Header from "../components/header/Header";
import illustration from "../assets/illustration.png";

function SignUp() {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1]">
      <Header />
      <div className="flex justify-center">
        <div className="mt-20">
          <div className="text-[30px] font-semibold">
            <h3 className="text-[#4D4D4D]">
              안녕하세요, 코드와 피드백이 자라는 정원
            </h3>
            <span className="text-[#00C839]">Code Gardener</span>
            <span className="text-[#4D4D4D]">입니다.</span>
          </div>
          <img
            src={illustration}
            alt="illust"
            className="w-[673px] h-[449px]"
          />
        </div>

        <div className="flex flex-col items-center w-[499px] h-[562px] bg-white rounded-[16px] border border-[#B8B8B8] mt-12">
          <h2 className="text-[30px] font-semibold mt-16 mb-12">회원가입</h2>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
