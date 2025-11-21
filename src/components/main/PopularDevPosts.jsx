import React from "react";
import PostCard from "../PostCard";

export default function PopularDevPosts() {
  // 임시 데이터
  const posts = [
    {
      id: 1,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "24분 전",
      title: "Tensorflow Lite와 Scikit-learn을 이용한 모바일 추천 시스템 구축",
      content:
        "사용자 행동 데이터를 기반으로 Scikit-learn으로 모델을 구현하고, Tensorflow Lite로 변환하여 모바일 단말기에서 경량 추론을 구현합니다.",
      tags: ["Python", "MySQL", "SpringBoot"],
      likes: 23,
      comments: 9,
      views: 237,
    },
    {
      id: 2,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "2시간 전",
      title: "추천 시스템 성능 개선을 위한 피처 엔지니어링 전략",
      content:
        "카테고리 인코딩, 로그 변환, 정규화 등 다양한 피처 엔지니어링 방법을 적용해 추천 모델의 성능을 끌어올리는 과정을 공유합니다.",
      tags: ["Python", "PostgreSQL", "Docker"],
      likes: 17,
      comments: 5,
      views: 180,
    },
    {
      id: 3,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "어제",
      title: "실시간 로그 기반 개인화 추천 파이프라인 구축기",
      content:
        "Kafka와 Spark Streaming을 활용해 실시간 로그를 수집·처리하고, 개인화 추천 피드를 생성하는 시스템을 설계합니다.",
      tags: ["Kafka", "Spark", "Realtime"],
      likes: 32,
      comments: 12,
      views: 402,
    },
    {
      id: 4,
      avatar: "🌱",
      author: "닉네임농부곰",
      timeAgo: "2일 전",
      title: "AB 테스트로 보는 추천 알고리즘 실험 방법론",
      content:
        "AB 테스트 설계부터 지표 정의, 통계적 유의성 검정까지 실제 서비스에 적용 가능한 실험 방법론을 정리했습니다.",
      tags: ["AB Test", "Statistics", "Data"],
      likes: 11,
      comments: 3,
      views: 129,
    },
  ];

  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-semibold mb-4">인기 개발 게시글</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => {
              // 상세 페이지 이동 로직 추가해야 함!!
            }}
          />
        ))}
      </div>
    </section>
  );
}
