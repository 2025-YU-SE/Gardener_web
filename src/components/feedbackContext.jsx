// 피드백 샘플 데이터

export const sampleFeedbacks = [
  {
    id: 101,
    postId: 1,
    author: '농담곰',
    avatarInitial: '농',
    timeAgo: '3시간 전',
    rating: 5,
    content:
      '성능 최적화 측면에서 몇 가지 개선점이 있습니다. filteredTodos 계산을 useMemo로 감싸고, 이벤트 핸들러들을 useCallback으로 최적화하면 리렌더링을 줄일 수 있을 것 같습니다.',
    likes: 23,
    comments: 13,
    views: 237,
  },
  {
    id: 102,
    postId: 1,
    author: '농담곰',
    avatarInitial: '농',
    timeAgo: '5시간 전',
    rating: 5,
    content:
      '상태 업데이트 로직에서 불변성을 지키도록 도우미 함수를 분리해두면 가독성이 좋아집니다. reducer를 사용할 경우 action 타입을 상수로 관리해보세요.',
    likes: 19,
    comments: 8,
    views: 180,
  },
  {
    id: 103,
    postId: 1,
    author: '코드리뷰어',
    avatarInitial: '코',
    timeAgo: '7시간 전',
    rating: 4,
    content:
      '컴포넌트 분리를 통해 책임을 줄이고 테스트 가능성을 높이면 유지보수가 쉬워집니다. 특히 리스트/아이템을 분리해보세요.',
    likes: 12,
    comments: 3,
    views: 120,
  },
  {
    id: 104,
    postId: 1,
    author: '프런트J',
    avatarInitial: '프',
    timeAgo: '8시간 전',
    rating: 3,
    content:
      'CSS가 전역에 퍼져 있어 예상치 못한 사이드이펙트가 있습니다. Tailwind 프리셋을 통일하거나 CSS Module을 고려해 보세요.',
    likes: 7,
    comments: 1,
    views: 88,
  },
  {
    id: 105,
    postId: 1,
    author: '테스트러',
    avatarInitial: '테',
    timeAgo: '어제',
    rating: 5,
    content:
      '중요 훅에 대한 단위 테스트를 추가하면 리팩토링 시 안정성이 커집니다. react-testing-library 예제가 있으면 더 좋겠어요.',
    likes: 15,
    comments: 5,
    views: 140,
  },
  {
    id: 106,
    postId: 1,
    author: 'UX연구원',
    avatarInitial: 'UX',
    timeAgo: '2일 전',
    rating: 4,
    content:
      '폼 에러 메시지의 접근성 레이블이 부족합니다. aria-describedby로 연결하면 스크린리더 호환성이 좋아집니다.',
    likes: 10,
    comments: 2,
    views: 101,
  },
  {
    id: 201,
    postId: 2,
    author: '리액트팬',
    avatarInitial: '리',
    timeAgo: '1일 전',
    rating: 4,
    content: '네이티브 모듈 브리징 관련해서 샘플 코드가 있으면 더 좋겠습니다.',
    likes: 11,
    comments: 2,
    views: 95,
  },
]

export default sampleFeedbacks


