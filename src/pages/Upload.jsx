import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { BsSend } from "react-icons/bs"
import { FaGithub } from "react-icons/fa"
import Header from '../components/header/Header'
import language from '../components/filter/language'
import stacks from '../components/filter/stacks'
import CollapsibleFilter from '../components/filter/CollapsibleFilter'
import WriteCodeEditor from '../components/WriteCodeEditor'
import { createPost, updatePost, getPostDetail, regenerateAiFeedback } from '../api/postApi'

const getLanguageCode = (languageName) => {
  if (!languageName) return "javascript";

  const key = String(languageName).toLowerCase();

  if (key.includes("typescript") || key === "ts") return "typescript";
  if (key.includes("javascript") || key === "js") return "javascript";
  if (key.includes("python") || key === "py") return "python";
  if (key === "java") return "java";
  if (key === "c++" || key === "cpp") return "cpp";
  if (key === "c#") return "csharp";
  if (key === "c") return "c";
  if (key.includes("ruby")) return "ruby";
  if (key.includes("go")) return "go";
  if (key.includes("php")) return "php";
  if (key.includes("swift")) return "swift";
  if (key.includes("kotlin")) return "kotlin";

  return "javascript";
};

function Upload() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit');
  const isEditMode = !!editPostId;
  const isAuthed = Boolean(localStorage.getItem('accessToken'));
  
  const [activeTab, setActiveTab] = useState('개발')
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript')
  const [selectedStacks, setSelectedStacks] = useState([])
  
  // 개발 탭 상태
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [code, setCode] = useState('// 예시 코드를 자유롭게 수정하세요\nconst numbers = [1,2,3,4,5];\nconst doubled = numbers.map(x => x * 2);\nconsole.log(doubled);')
  const [feedbackRequests, setFeedbackRequests] = useState(['', '', ''])
  const [githubUrl, setGithubUrl] = useState('')
  
  // 코딩테스트 탭 상태
  const [codingTitle, setCodingTitle] = useState('')
  const [problem, setProblem] = useState('')
  const [codingCode, setCodingCode] = useState('// 코딩테스트 코드를 입력하세요\nfunction solution() {\n  // 여기에 코드를 작성하세요\n  return;\n}')
  const [codingFeedbackRequests, setCodingFeedbackRequests] = useState(['', '', ''])
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 접근 권한 체크: 로그인 필수
  useEffect(() => {
    if (!isAuthed) {
      alert('로그인이 필요합니다.');
      navigate('/sign-in', { state: { from: location.pathname + location.search } });
    }
  }, [isAuthed, navigate, location.pathname, location.search]);

  // 수정 모드 - 기존 게시글 데이터 불러오기
  useEffect(() => {
    const loadPostData = async () => {
      if (!isEditMode || !editPostId) return;
      
      try {
        if (location.state?.post) {
          const post = location.state.post;
          setTitle(post.title || '');
          setContent(post.content || '');
          setCode(post.code || '');
          setGithubUrl(post.githubRepoUrl || '');
          
          // 언어 설정
          if (post.languages) {
            setSelectedLanguage(post.languages);
          }
          
          // 스택 설정
          if (post.stacks) {
            const stacksArray = typeof post.stacks === 'string' 
              ? post.stacks.split(',').map(s => s.trim()).filter(Boolean)
              : Array.isArray(post.stacks) ? post.stacks : [];
            setSelectedStacks(stacksArray);
          }
          
          // 탭 설정
          if (post.contentsType === false) {
            setActiveTab('코딩테스트');
            setCodingTitle(post.title || '');
            setProblem(post.problemStatement || post.content || '');
            setCodingCode(post.code || '');
          } else {
            setActiveTab('개발');
            if (post.summary) {
              const requests = post.summary.split(',').map(s => s.trim()).filter(Boolean);
              setFeedbackRequests(requests.length > 0 ? requests : ['', '', '']);
            }
          }
        } else {
          // location.state가 없으면 API로 데이터 불러오기
          const res = await getPostDetail(editPostId);
          const postData = res.data;
          
          setTitle(postData.title || '');
          setContent(postData.content || '');
          setCode(postData.code || '');
          setGithubUrl(postData.githubRepoUrl || '');
          
          if (postData.languages) {
            setSelectedLanguage(postData.languages);
          }
          
          if (postData.stacks) {
            const stacksArray = typeof postData.stacks === 'string' 
              ? postData.stacks.split(',').map(s => s.trim()).filter(Boolean)
              : Array.isArray(postData.stacks) ? postData.stacks : [];
            setSelectedStacks(stacksArray);
          }
          
          if (postData.contentsType === false) {
            setActiveTab('코딩테스트');
            setCodingTitle(postData.title || '');
            setProblem(postData.problemStatement || postData.content || '');
            setCodingCode(postData.code || '');
          } else {
            setActiveTab('개발');
            if (postData.summary) {
              const requests = postData.summary.split(',').map(s => s.trim()).filter(Boolean);
              setFeedbackRequests(requests.length > 0 ? requests : ['', '', '']);
            }
          }
        }
      } catch (err) {
        console.error('게시글 데이터 불러오기 실패:', err);
        alert('게시글 데이터를 불러오는데 실패했습니다.');
      }
    };

    loadPostData();
  }, [isEditMode, editPostId, location.state]);

  const handleFeedbackRequestChange = (index, value) => {
    const newRequests = [...feedbackRequests]
    newRequests[index] = value
    setFeedbackRequests(newRequests)
  }

  const handleCodingFeedbackRequestChange = (index, value) => {
    const newRequests = [...codingFeedbackRequests]
    newRequests[index] = value
    setCodingFeedbackRequests(newRequests)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // 필수 항목 검증
      if (activeTab === '개발') {
        if (!title.trim() || !content.trim() || !code.trim()) {
          alert('필수 항목을 모두 입력해주세요.')
          setIsSubmitting(false)
          return
        }
      } else {
        if (!codingTitle.trim() || !problem.trim() || !codingCode.trim()) {
          alert('필수 항목을 모두 입력해주세요.')
          setIsSubmitting(false)
          return
        }
      }

      // summary 생성 (피드백 요청 필드들을 합쳐서)
      const summary = activeTab === '개발' 
        ? feedbackRequests.filter(f => f.trim()).join(', ') || '전반적인 피드백'
        : codingFeedbackRequests.filter(f => f.trim()).join(', ') || '전반적인 피드백'

      // JSON 객체로 변경 (백엔드는 @RequestBody로 JSON을 기대함)
      const postData = {
        title: activeTab === '개발' ? title : codingTitle,
        content: activeTab === '개발' ? content : problem,
        code: activeTab === '개발' ? code : codingCode,
        languages: selectedLanguage,
        stacks: selectedStacks.length > 0 ? selectedStacks.join(',') : null,
        summary: summary,
        contentsType: activeTab === '개발' ? true : false, // Boolean: true=개발, false=코딩테스트
        githubRepoUrl: activeTab === '개발' ? (githubUrl.trim() || null) : null,
        problemStatement: activeTab === '코딩테스트' ? problem : null
      }

      if (isEditMode && editPostId) {
        // 수정 모드
        await updatePost(editPostId, postData);
        alert('게시물이 수정되었습니다!');
        navigate(`/posts/${editPostId}`);
      } else {
        // 생성 모드
        const response = await createPost(postData);
        const createdPostId = response?.data?.postId || response?.data?.id;
        
        // 게시물 생성 후 AI 피드백 자동 생성
        if (createdPostId) {
          try {
            await regenerateAiFeedback(createdPostId);
            console.log('AI 피드백이 자동으로 생성되었습니다.');
          } catch (aiError) {
            console.error('AI 피드백 생성 실패:', aiError);
          }
        }
        
        alert('게시물이 업로드되었습니다!');
        navigate('/posts');
      }
    } catch (err) {
      console.error('업로드 실패:', err)
      alert('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">  
      <Header/>
      <div className="flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
            {isEditMode ? '게시글 수정' : '코드 심기'}
          </h1>
          
          {/* 탭 메뉴 */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex border-b border-gray-200 w-full sm:w-auto">
              <button 
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 font-medium text-sm sm:text-base ${
                  activeTab === '개발' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('개발')}
              >
                개발
              </button>
              <button 
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 font-medium text-sm sm:text-base ${
                  activeTab === '코딩테스트' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('코딩테스트')}
              >
                코딩테스트
              </button>
            </div>
          </div>

          {/* 개발 탭 내용 */}
          {activeTab === '개발' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">필수 항목</h2>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                    selectedOptions={[selectedLanguage]}
                    onSelectionChange={(selection) => {
                      if (selection.length > 0) {
                        setSelectedLanguage(selection[0]);
                      }
                    }}
                    singleSelect={true}
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
                    selectedOptions={selectedStacks}
                    onSelectionChange={setSelectedStacks}
                  />
                </div>

                {/* 코드 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">코드 입력 *</label>
                  <WriteCodeEditor
                    language={getLanguageCode(selectedLanguage)}
                    title={`${selectedLanguage.toUpperCase()} - 작성 모드`}
                    value={code}
                    onChange={setCode}
                  />
                </div>

                
                {/* 피드백 요청 */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    총점적으로 받고싶은 피드백이 있다면 그 부분에 대해서 피드백 요청 *
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={feedbackRequests[0]}
                      onChange={(e) => handleFeedbackRequestChange(0, e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={feedbackRequests[1]}
                      onChange={(e) => handleFeedbackRequestChange(1, e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={feedbackRequests[2]}
                      onChange={(e) => handleFeedbackRequestChange(2, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 코딩테스트 탭 내용 */}
          {activeTab === '코딩테스트' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
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
                    placeholder="코딩 테스트 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    value={codingTitle}
                    onChange={(e) => setCodingTitle(e.target.value)}
                  />
                </div>

                {/* 문제 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문제 *
                  </label>
                  <textarea 
                    placeholder="코딩 테스트 문제를 입력하세요"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
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
                    selectedOptions={[selectedLanguage]}
                    onSelectionChange={(selection) => {
                      if (selection.length > 0) {
                        setSelectedLanguage(selection[0]);
                      }
                    }}
                    singleSelect={true}
                  />
                </div>

                {/* 코드 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    코드 입력 *
                  </label>
                  <WriteCodeEditor
                    language={getLanguageCode(selectedLanguage)}
                    title={`${selectedLanguage.toUpperCase()} - 작성 모드`}
                    value={codingCode}
                    onChange={setCodingCode}
                  />
                </div>

                {/* 피드백 요청 */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    총점적으로 받고싶은 피드백이 있다면 그 부분에 대해서 피드백 요청
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={codingFeedbackRequests[0]}
                      onChange={(e) => handleCodingFeedbackRequestChange(0, e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={codingFeedbackRequests[1]}
                      onChange={(e) => handleCodingFeedbackRequestChange(1, e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="예: 성능 최적화, 코드 구조, 보안, 가독성 등 특별히 피드백받고 싶은 부분을 명시해주세요"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                      value={codingFeedbackRequests[2]}
                      onChange={(e) => handleCodingFeedbackRequestChange(2, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* 선택사항 - 개발 탭에서만 표시 */}
          {activeTab === '개발' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-800">선택사항</h2>
                <span className="text-sm text-gray-500 ml-2">(필요한 경우에만 입력하세요)</span>
              </div>
              
              <div className="space-y-6">
                {/* GitHub 레포지토리 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub 레포지토리 주소
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGithub className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="https://github.com/username/repository"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-5 px-4 sm:px-5 bg-white border border-gray-200 rounded-lg mb-4 sm:mb-6">
            <div className="text-xs sm:text-sm text-gray-500">
              • 표시된 항목은 필수 입력 사항입니다.
            </div>
            <button 
              className='w-full sm:w-auto px-4 py-2 rounded-md bg-[#16A34A] text-white flex items-center justify-center gap-2 hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <BsSend />
              {isSubmitting ? '업로드 중...' : '코드 업로드'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
