import React from "react";
import Header from "../components/header/Header";
import illustration from "../assets/illustration.png";

function SignIn() {
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
          <h2 className="text-[30px] font-semibold mt-16 mb-12">로그인</h2>
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="아이디를 입력해 주세요"
              className="w-[360px] h-[48px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[14px] focus:outline-none mb-4 placeholder:text-[#B8B8B8]"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              className="w-[360px] h-[48px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[14px] focus:outline-none mb-8 placeholder:text-[#B8B8B8]"
            />
            <button className="w-[160px] h-[40px] bg-[#00C839] text-white text-[16px] py-2 rounded-[6px] font-medium hover:bg-[#0bdd47]">
              로그인
            </button>
          </div>

          <p className="text-[10px] text-[#B8B8B8] mt-4">
            계정이 없으신가요?{" "}
            <a
              href="/sign-up"
              className="text-[#00C839] font-semibold hover:underline"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
