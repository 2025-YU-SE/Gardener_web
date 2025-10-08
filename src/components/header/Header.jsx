import React from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderAuth from "./HeaderAuth";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  // 임시 상태 (나중에 백엔드 연동 시 대체)
  const isLoggedIn = false; // 로그인한 사용자 화면 헤더를 보고싶으면 true로 변경해서 테스트
  const isAuthPage =
    location.pathname.includes("/sign-in") ||
    location.pathname.includes("/sign-up");

  if (isAuthPage) return <HeaderAuth />;
  if (isLoggedIn) return <HeaderLoggedIn />;
  return <HeaderLoggedOut />;
}
