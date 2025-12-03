import React, { useState } from "react";
import HeaderAuth from "../components/header/HeaderAuth";
import illustration from "../assets/illustration.png";
import { signup, checkUsername, checkEmail } from "../api/userApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// 유효성 검사 함수
const validateUsername = (value) => {
  const trimmed = value.trim();

  if (trimmed.length < 5 || trimmed.length > 12) {
    return {
      ok: false,
      message: "아이디는 5~12자 이내로 입력해주세요.",
    };
  }

  if (!/[A-Za-z]/.test(trimmed) || !/\d/.test(trimmed)) {
    return {
      ok: false,
      message: "아이디에는 영문과 숫자가 모두 포함되어야 합니다.",
    };
  }

  return { ok: true, message: "" };
};

const validateEmail = (value) => {
  const trimmed = value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      ok: false,
      message: "올바른 이메일 형식이 아닙니다.",
    };
  }

  return { ok: true, message: "" };
};

const validatePassword = (value) => {
  const trimmed = value;

  if (trimmed.length < 8 || trimmed.length > 12) {
    return { ok: false, message: "비밀번호 규칙을 확인하세요" };
  }

  if (!/[A-Za-z]/.test(trimmed) || !/\d/.test(trimmed)) {
    return { ok: false, message: "비밀번호 규칙을 확인하세요" };
  }

  return { ok: true, message: "" };
};

function SignUp() {
  // 입력값 상태 관리
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 에러 메시지 상태
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");

  // 아이디 중복 확인 상태
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  // 이메일 중복 확인 상태
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // 아이디 중복 확인
  const handleCheckUsername = async () => {
    if (!userName.trim()) {
      setUsernameError("아이디를 입력해 주세요.");
      setIsUsernameAvailable(false);
      return;
    }

    const { ok, message } = validateUsername(userName);
    if (!ok) {
      setUsernameError(message);
      setIsUsernameAvailable(false);
      return;
    }
    setUsernameError("");

    try {
      setIsCheckingUsername(true);
      setUsernameCheckMessage("");
      setIsUsernameAvailable(null);

      const res = await checkUsername(userName);
      const available = res.data === true;

      if (available) {
        setUsernameCheckMessage("사용 가능한 아이디입니다.");
        setIsUsernameAvailable(true);
      } else {
        setUsernameCheckMessage("이미 사용 중인 아이디입니다.");
        setIsUsernameAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setUsernameCheckMessage("아이디 확인 중 오류가 발생했습니다.");
      setIsUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      setIsEmailAvailable(false);
      return;
    }

    const { ok, message } = validateEmail(email);
    if (!ok) {
      setEmailError(message);
      setIsEmailAvailable(false);
      return;
    }
    setEmailError("");

    try {
      setIsCheckingEmail(true);
      setEmailCheckMessage("");
      setIsEmailAvailable(null);

      const res = await checkEmail(email);
      const available = res.data === true;

      if (available) {
        setEmailCheckMessage("사용 가능한 이메일입니다.");
        setIsEmailAvailable(true);
      } else {
        setEmailCheckMessage("이미 사용 중인 이메일입니다.");
        setIsEmailAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
      setIsEmailAvailable(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    // 아이디 유효성 검사
    const usernameResult = validateUsername(userName);
    if (!usernameResult.ok) {
      setUsernameError(usernameResult.message);
      return;
    } else {
      setUsernameError("");
    }

    // 이메일 유효성 검사
    const emailResult = validateEmail(email);
    if (!emailResult.ok) {
      setEmailError(emailResult.message);
      return;
    } else {
      setEmailError("");
    }

    // 비밀번호 유효성 검사
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) {
      setPasswordError(passwordResult.message);
      return;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 일치 여부
    if (password !== passwordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setPasswordCheckError("");
    }

    // 중복 확인 강제
    if (isUsernameAvailable !== true) {
      alert("아이디 중복 확인을 완료해 주세요.");
      return;
    }
    if (isEmailAvailable !== true) {
      alert("이메일 중복 확인을 완료해 주세요.");
      return;
    }

    try {
      const res = await signup({
        userName,
        email,
        password,
      });

      alert("회원가입 성공!");
      window.location.href = "/sign-in";
    } catch (err) {
      console.error(err);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#F0FDF4] to-[#BDF7D1]">
      <HeaderAuth />
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

        <div className="flex flex-col items-center w-[499px] h-[580px] bg-white rounded-[16px] border border-[#B8B8B8] mt-12">
          <h2 className="text-[30px] font-semibold mt-16 mb-6">회원가입</h2>
          <div className="flex flex-col items-center">
            {/* 아이디 */}
            <div className="flex flex-col mb-4">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                아이디 <p className="text-[#00C839]">*</p>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="아이디를 입력해 주세요 (5~12자, 영문+숫자)"
                  className="w-[280px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px]"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setUsernameError("");
                    setUsernameCheckMessage("");
                    setIsUsernameAvailable(null);
                  }}
                />
                <button
                  type="button"
                  className="w-[69px] h-[40px] rounded-[6px] 
             bg-[#4D4D4D] text-white text-[12px]
             disabled:bg-[#CFCFCF] disabled:cursor-not-allowed"
                  onClick={handleCheckUsername}
                  disabled={isCheckingUsername || isUsernameAvailable === true}
                >
                  {isCheckingUsername ? "확인중" : "중복확인"}
                </button>
              </div>
              {/* 아이디 규칙/에러 */}
              {usernameError && (
                <p className="mt-1 ml-1 text-[10px] text-[#FF4D4F]">
                  {usernameError}
                </p>
              )}
              {/* 아이디 중복 확인 결과 */}
              {usernameCheckMessage && (
                <p
                  className={`mt-1 ml-1 text-[10px] ${
                    isUsernameAvailable ? "text-[#00C839]" : "text-[#FF4D4F]"
                  }`}
                >
                  {usernameCheckMessage}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div className="flex flex-col mb-4">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                이메일 <p className="text-[#00C839]">*</p>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="이메일을 입력해 주세요"
                  className="w-[280px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setEmailCheckMessage("");
                    setIsEmailAvailable(null);
                  }}
                />
                <button
                  type="button"
                  className="w-[69px] h-[40px] rounded-[6px] 
             bg-[#4D4D4D] text-white text-[12px]
             disabled:bg-[#CFCFCF] disabled:cursor-not-allowed"
                  onClick={handleCheckEmail}
                  disabled={isCheckingEmail || isEmailAvailable === true}
                >
                  {isCheckingEmail ? "확인중" : "중복확인"}
                </button>
              </div>
              {/* 이메일 형식 에러 */}
              {emailError && (
                <p className="mt-1 ml-1 text-[10px] text-[#FF4D4F]">
                  {emailError}
                </p>
              )}
              {/* 이메일 중복 확인 결과 */}
              {emailCheckMessage && (
                <p
                  className={`mt-1 ml-1 text-[10px] ${
                    isEmailAvailable ? "text-[#00C839]" : "text-[#FF4D4F]"
                  }`}
                >
                  {emailCheckMessage}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col mb-3">
              <label className="flex items-center text-[12px] font-medium text-[#4D4D4D] ml-1 mb-1">
                비밀번호 <p className="text-[#00C839]">*</p>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="영문자, 숫자 포함 8~12자"
                  className="w-[360px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] pr-10"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    setPasswordError("");

                    // 비밀번호 확인 값이 이미 있는 경우, 일치 여부 다시 체크
                    if (passwordCheck) {
                      if (value !== passwordCheck) {
                        setPasswordCheckError("비밀번호가 일치하지 않습니다.");
                      } else {
                        setPasswordCheckError("");
                      }
                    }
                  }}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4D4D4D]"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 ml-1 text-[10px] text-[#FF4D4F]">
                  {passwordError}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col mb-7">
              <div className="relative">
                <input
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호를 확인해주세요"
                  className="w-[360px] h-[40px] border border-[#B8B8B8] rounded-[6px] px-4 py-3 text-[12px] pr-10"
                  value={passwordCheck}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordCheck(value);

                    if (value && value !== password) {
                      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
                    } else {
                      setPasswordCheckError("");
                    }
                  }}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4D4D4D]"
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                >
                  {showPasswordCheck ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {passwordCheckError && (
                <p className="mt-1 ml-1 text-[10px] text-[#FF4D4F]">
                  {passwordCheckError}
                </p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              className="w-[160px] h-[40px] bg-[#00C839] text-white text-[16px] py-2 rounded-[6px]"
              onClick={handleSignup}
            >
              회원가입
            </button>

            {/* 로그인 이동 */}
            <p className="text-[10px] text-[#B8B8B8] mt-4">
              이미 계정이 있으신가요?{" "}
              <a
                href="/sign-in"
                className="text-[#00C839] font-semibold hover:underline"
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
