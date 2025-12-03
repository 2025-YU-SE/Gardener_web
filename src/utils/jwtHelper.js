export const decodeJWT = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // payload 디코딩
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};


// 현재 사용자의 username 반환
export const getCurrentUsername = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.sub || decoded?.subject || null;
};


// 현재 사용자의 role 반환
export const getCurrentUserRole = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.role || null;
};

// 현재 사용자가 관리자인지 확인
export const isAdmin = () => {
  const role = getCurrentUserRole();
  return role === 'ADMIN';
};

