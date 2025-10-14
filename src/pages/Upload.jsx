import React from 'react'
import Header from '../components/header/Header'
import language from '../components/filter/language'
import stacks from '../components/filter/stacks'
import CollapsibleFilter from '../components/filter/CollapsibleFilter'

function Upload() {

  return (
    <div className="min-h-screen bg-[#F9FAFB]">  
      <Header/>
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">코드 심기</h1>
          
          {/* 탭 메뉴 */}
          <div className="flex justify-center mb-8">
            <div className="flex border-b border-gray-200">
              <button className="px-6 py-3 font-medium text-green-600 border-b-2 border-green-600">
                개발
              </button>
              <button className="px-6 py-3 font-medium text-gray-500 hover:text-gray-700">
                코딩테스트
              </button>
            </div>
          </div>

          {/* 필수 항목 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800">필수 항목</h2>
            </div>
            
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input 
                  type="text" 
                  placeholder="코드 제목을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 *
                </label>
                <textarea 
                  placeholder="코드에 대한 간단한 설명을 입력하세요"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              {/* 프로그래밍 언어 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로그래밍 언어 *
                </label>
                <CollapsibleFilter 
                  title="언어를 선택하세요" 
                  options={language}
                  roundedClass="rounded-lg"
                  titleClass="font-normal text-gray-600"
                  showSelected={true}
                />
              </div>

              {/* 기술 스택/프레임워크 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기술 스택/프레임워크
                </label>
                <CollapsibleFilter 
                  title="기술 스택을 선택하세요" 
                  options={stacks}
                  roundedClass="rounded-lg"
                  titleClass="font-normal text-gray-600"
                  showSelected={true}
                />
              </div>

              {/* 코드 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드 입력 *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center">
                    <span className="text-sm text-gray-600">JavaScript</span>
                  </div>
                  <textarea 
                    placeholder="코드를 입력하거나 위에서 파일을 업로드하세요..."
                    rows="10"
                    className="w-full px-4 py-3 border-0 focus:ring-0 outline-none resize-none font-mono text-sm"
                  ></textarea>
                </div>
              </div>

              {/* 코드 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드를 설명하는 창 (간단한 설명, 구현 의도 등) *
                </label>
                <textarea 
                  placeholder="코드의 목적, 구현 방식, 특별한 고려사항 등을 설명해주세요"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              {/* 피드백 요청 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  총점적으로 받고싶은 피드백이 있다면 그 부분에 대해서 피드백 요청 *
                </label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 선택사항 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-gray-800">선택사항</h2>
              <span className="text-sm text-gray-500 ml-2">(필요한 경우에만 입력하세요)</span>
            </div>
            
            <div className="space-y-6">
              {/* 사진 피드백 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 피드백 업로드
                </label>
                <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                  <span className="text-gray-600">이미지 추가</span>
                </button>
              </div>

              {/* GitHub 레포지토리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub 레포지토리 주소
                </label>
                <input 
                  type="text" 
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between items-center px-5 bg-white border border-gray-200 rounded-lg p-3 mb-6">
            <div className="text-sm text-gray-500">
              • 표시된 항목은 필수 입력 사항입니다.
            </div>
            <button className='m-2 px-4 py-1 rounded-md bg-[#16A34A] text-white'>코드 업로드</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
