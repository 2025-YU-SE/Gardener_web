import { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function FeedbackReadonlyCodeEditor({
  value,
  language = "javascript",
  height = 420,
  title = "JAVASCRIPT - 피드백된 코드",
  feedbacks = [],
  className = "",
}) {
  const editorRef = useRef(null);
  const containerHeight = useMemo(() => `${height}px`, [height]);

  useEffect(() => {
    const styleId = "feedback-readonly-editor-inline-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .lineHighlightFeedback { 
          background-color: rgba(74, 222, 128, 0.18); 
          outline: 1px solid rgba(74, 222, 128, 0.35); 
        }
        .lineHighlightGutter { 
          background-color: rgba(74, 222, 128, 0.35); 
        }
        .feedback-comment {
          background-color: rgba(59, 130, 246, 0.1);
          border-left: 3px solid rgba(59, 130, 246, 0.6);
          padding: 8px 12px;
          margin: 4px 0;
          border-radius: 4px;
        }
        .feedback-comment-text {
          color: #1f2937;
          font-size: 13px;
          line-height: 1.4;
        }
        .feedback-comment-meta {
          color: #6b7280;
          font-size: 11px;
          margin-top: 4px;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  function handleMount(editor) {
    editorRef.current = editor;

    // 읽기 전용
    editor.updateOptions({ readOnly: true });
    
    // 피드백 범위 하이라이트
    applyFeedbackHighlights(feedbacks);
  }

  function applyFeedbackHighlights(feedbackList) {
    const editor = editorRef.current;
    if (!editor || !feedbackList || feedbackList.length === 0) return;

    const decorations = feedbackList.map((feedback) => ({
      range: {
        startLineNumber: feedback.start,
        startColumn: 1,
        endLineNumber: feedback.end,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: "lineHighlightFeedback",
        marginClassName: "lineHighlightGutter",
      },
    }));

    editor.__feedbackDecorations = editor.deltaDecorations(
      editor.__feedbackDecorations || [],
      decorations
    );
  }

  // 하이라이트 업데이트
  useEffect(() => {
    if (editorRef.current) {
      applyFeedbackHighlights(feedbacks);
    }
  }, [feedbacks]);

  return (
    <div className={`rounded-lg overflow-hidden border border-blue-300 bg-blue-50 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 border-b border-blue-300">
        <div className="flex items-center gap-1 text-blue-700 text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="ml-2">{title}</span>
        </div>
        <span className="ml-auto text-xs text-blue-700">
          피드백 {feedbacks.length}개
        </span>
      </div>

      {/* 에디터 영역 */}
      <div style={{ height: containerHeight }} className="bg-[#1e1e1e]">
        <Editor
          value={value}
          language={language}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            lineNumbersMinChars: 3,
            contextmenu: false, 
            selectOnLineNumbers: false,
          }}
        />
      </div>

      {/* 피드백 코멘트 목록 */}
      {feedbacks.length > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="text-sm font-semibold text-blue-800 mb-3">
            피드백 코멘트 ({feedbacks.length}개)
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="feedback-comment">
                <div className="text-xs font-medium text-blue-700 mb-1">
                  라인 {feedback.start}–{feedback.end}
                </div>
                <div className="feedback-comment-text">
                  {feedback.text || '피드백 내용이 없습니다.'}
                </div>
                {feedback.createdAt && (
                  <div className="feedback-comment-meta">
                    {new Date(feedback.createdAt).toLocaleString('ko-KR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 피드백이 없는 경우 */}
      {feedbacks.length === 0 && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <div className="text-center text-sm text-blue-600">
            아직 피드백이 없습니다.
          </div>
        </div>
      )}
    </div>
  );
}
