import React from "react";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderAuth from "./HeaderAuth";

const Header = () => {
  // 🔐 JWT 로그인 여부 체크
  const token = localStorage.getItem("accessToken");

  return token ? <HeaderLoggedIn /> : <HeaderLoggedOut />;
};

export default Header;
