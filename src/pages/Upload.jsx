import React from 'react'
import Header from '../components/header/Header'

function Upload() {
  return (
    <div>  
      <Header/>
      <div className="flex flex-col gap-10 mt-10 items-center">
        <div className="font-bold text-2xl">코드 심기</div>
        <div className='flex gap-10'>
          <div className="hover:font-bold border-b-2 border-transparent hover:border-black">개발</div>
          <div className="hover:font-bold border-b-2 border-transparent hover:border-black">코딩 테스트</div>
        </div>
        <div className="border border-gray-300 w-3/5 h-96 flex flex-col gap-5 p-5">
          <div className="border border-gray-300 h-10">  
            <div className="font-bold">
              필수항목
            </div>  
            <div className="text-sm text-gray-500">  
              *표시는 필수 입력 사항입니다.
            </div>
          </div>
          <div className="border border-gray-300 flex-col items-center">
            <div className="flex gap-2">  
              <div className="font-bold">*선택사항</div>
              <div className="text-sm text-gray-500">(필요한 경우에만 입력하세요)</div>
            </div>
            <div>
              <h3>사진 피드백 업로드</h3>
              <input type="file"  className="border border-gray-300 p-2" />
            </div>
            <div>
              <h3>GitHub 레포지토리 주소</h3>
              <input type="text" className="border border-gray-300 p-2" />
            </div>
          </div>
          <div className="border border-gray-300 h-10 flex justify-between items-center px-5">
            <div className="text-sm text-gray-500">  
            *표시는 필수 입력 사항입니다.
            </div>
            <button className='m-2 px-4 py-1 rounded-md bg-[#16A34A] text-white'>코드 업로드</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload


