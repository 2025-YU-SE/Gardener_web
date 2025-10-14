// 피드백 답글 샘플 데이터 

export const sampleReplies = [
  // postId: 1, parent: 103
  {
    id: 3001,
    postId: 1,
    parentFeedbackId: 103,
    author: '프런트J',
    avatarInitial: '프',
    timeAgo: '2시간 전',
    content: '리스트/아이템 분리는 동의합니다. 특히 데이터 fetch와 표시 로직을 분리하면 테스트가 쉬워져요.',
    likes: 4,
  },
  {
    id: 3002,
    postId: 1,
    parentFeedbackId: 103,
    author: '테스트러',
    avatarInitial: '테',
    timeAgo: '1시간 전',
    content: 'unit test 추가 시 store를 mock 하는 패턴 추천드립니다.',
    likes: 2,
  },

  // postId: 1, parent: 101
  {
    id: 3010,
    postId: 1,
    parentFeedbackId: 101,
    author: 'UX연구원',
    avatarInitial: 'UX',
    timeAgo: '어제',
    content: 'useMemo 최적화 이후에도 UX 성능지표 FID/INP 확인해보면 좋아요.',
    likes: 1,
  },

  // postId: 2, parent: 201
  {
    id: 4001,
    postId: 2,
    parentFeedbackId: 201,
    author: '리액트팬',
    avatarInitial: '리',
    timeAgo: '3시간 전',
    content: '브리징 샘플은 RN 문서 예제가 좋아요. 링크 정리해드릴게요.',
    likes: 3,
  },
]

export default sampleReplies


