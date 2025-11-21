import { useEffect, useMemo, useRef, useState } from "react";
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
  const monacoRef = useRef(null);
  const containerHeight = useMemo(() => `${height}px`, [height]);

  // ----- 에디터 mount 완료 여부 -----
  const [isEditorReady, setIsEditorReady] = useState(false);

  function handleMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.updateOptions({ readOnly: true });

    setIsEditorReady(true); // 에디터 로드 완료
  }

  // ----- 라인 피드백 하이라이트 적용 -----
  const applyFeedbackHighlights = () => {
    const editor = editorRef.current;
    if (!editor || !feedbacks || feedbacks.length === 0) return;

    const decorations = feedbacks.map((fb) => ({
      range: {
        startLineNumber: fb.start,
        startColumn: 1,
        endLineNumber: fb.end,
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
  };

  // ----- 에디터 준비 + feedbacks 변경 시 하이라이트 갱신 -----
  useEffect(() => {
    if (isEditorReady) {
      applyFeedbackHighlights();
    }
  }, [isEditorReady, feedbacks]);

  return (
      <div className={`rounded-lg overflow-hidden border border-blue-300 bg-blue-50 ${className}`}>
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

        {feedbacks.length > 0 ? (
            <div className="bg-blue-50 border-t border-blue-200 p-4">
              <div className="text-sm font-semibold text-blue-800 mb-3">
                피드백 코멘트 ({feedbacks.length}개)
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {feedbacks.map((fb, idx) => (
                    <div key={idx} className="feedback-comment">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        라인 {fb.start}–{fb.end}
                      </div>
                      <div className="feedback-comment-text">{fb.text}</div>
                      {fb.createdAt && (
                          <div className="feedback-comment-meta">
                            {new Date(fb.createdAt).toLocaleString("ko-KR")}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
        ) : (
            <div className="bg-blue-50 border-t border-blue-200 p-4">
              <div className="text-center text-sm text-blue-600">
                아직 피드백이 없습니다.
              </div>
            </div>
        )}
      </div>
  );
}
