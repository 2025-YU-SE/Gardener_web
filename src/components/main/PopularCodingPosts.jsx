import React from "react";
import PostCard from "../PostCard";

export default function MainPopularCodingTests() {
  // 임시 데이터
  const posts = [
    {
      id: 1,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "24분 전",
      title: "백준 DP 기초 개념 총정리 & 실전 문제풀이",
      content:
        "DP 점화식 세우는 방법과 예제 문제를 기반으로 실제 적용법을 정리합니다.",
      tags: ["DP", "Python", "Algorithm"],
      likes: 17,
      comments: 4,
      views: 310,
    },
    {
      id: 2,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "1시간 전",
      title: "그리디 알고리즘 필수 유형 10선",
      content: "정렬 기반 그리디, 선택 기준, 자주 나오는 패턴을 정리했습니다.",
      tags: ["Greedy", "CodingTest"],
      likes: 22,
      comments: 8,
      views: 402,
    },
    {
      id: 3,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "어제",
      title: "프로그래머스 lv2 고득점 키트 정복기",
      content:
        "프로그래머스에서 자주 출제되는 유형을 하나씩 실전 풀이로 정리했습니다.",
      tags: ["Programmers", "JavaScript"],
      likes: 15,
      comments: 3,
      views: 188,
    },
    {
      id: 4,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "2일 전",
      title: "자료구조 문제풀이 패턴 총정리",
      content:
        "스택, 큐, 해시, 우선순위 큐 문제를 효율적으로 푸는 핵심 전략 모음.",
      tags: ["DataStructure", "CS"],
      likes: 19,
      comments: 6,
      views: 250,
    },
  ];

  return (
    <section className="mt-14 mb-10">
      <h2 className="text-[20px] font-semibold mb-4">인기 코테 게시글</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => {
              // 상세 페이지 이동 로직 추가해야함!!!
            }}
          />
        ))}
      </div>
    </section>
  );
}
