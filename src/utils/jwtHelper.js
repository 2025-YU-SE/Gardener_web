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
  // 백엔드 토큰마다 role 표현 방식이 다를 수 있으므로 가변적으로 파싱
  const role =
    decoded?.role ||
    decoded?.roles ||
    decoded?.authorities ||
    decoded?.auth ||
    null;
  return role;
};

// 현재 사용자가 관리자인지 확인
export const isAdmin = () => {
  const role = getCurrentUserRole();
  
  // 문자열 단일 역할
  if (typeof role === 'string') {
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }
  
  // 배열 형태의 권한
  if (Array.isArray(role)) {
    return role.includes('ADMIN') || role.includes('ROLE_ADMIN');
  }

  // 객체(예: { role: 'ADMIN' }) 형태
  if (role && typeof role === 'object') {
    const values = Object.values(role);
    return values.includes('ADMIN') || values.includes('ROLE_ADMIN');
  }
  
  return false;
};

