import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function FeedbackCodeEditor({
  value,
  language = "javascript",
  height = 420,
  title = "JAVASCRIPT - 피드백 모드",
  className = "",
  onAddFeedbackRange,
  onSaveFeedback,
  initialFeedbacks = [],
}) {
  const editorRef = useRef(null);
  const idCounterRef = useRef(0);
  const [ranges, setRanges] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const containerHeight = useMemo(() => `${height}px`, [height]);

  useEffect(() => {
    const styleId = "feedback-editor-inline-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .lineHighlightFeedback { background-color: rgba(74, 222, 128, 0.18); outline: 1px solid rgba(74, 222, 128, 0.35); }
        .lineHighlightGutter { background-color: rgba(74, 222, 128, 0.35); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  function handleMount(editor, monaco) {
    editorRef.current = editor;

    let isDragging = false;
    let startLine = null;

    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const line = e.target.position?.lineNumber;
        if (line) {
          startLine = line;
          isDragging = true;
          setDragStart(line);
          // 해당 라인 하이라이트
          decorateTempRange(line, line);
        }
      }
    });

    editor.onMouseMove((e) => {
      if (isDragging && startLine && e.target.position?.lineNumber) {
        const currentLine = e.target.position.lineNumber;
        const start = Math.min(startLine, currentLine);
        const end = Math.max(startLine, currentLine);
        decorateTempRange(start, end);
      }
    });

    editor.onMouseUp((e) => {
      if (isDragging && startLine) {
        const endLine = e.target.position?.lineNumber || startLine;
        const start = Math.min(startLine, endLine);
        const end = Math.max(startLine, endLine);
        
        // 여러 줄줄
        if (end > start) {
          addRange(start, end);
        } else {
          // 단일 라인 
          addRange(start, start);
        }
        
        isDragging = false;
        startLine = null;
        setDragStart(null);
        clearTempDecorations();
      }
    });

    // 예외처리리
    editor.onMouseLeave(() => {
      if (isDragging) {
        isDragging = false;
        startLine = null;
        setDragStart(null);
        clearTempDecorations();
      }
    });
  }

  function addRange(start, end) {
    idCounterRef.current += 1;
    const id = `${start}-${end}-${Date.now()}-${idCounterRef.current}`;
    const createdAt = new Date();
    const item = { id, start, end, createdAt, text: "", editing: true };
    setRanges((prev) => {
      const next = [...prev, item];
      applyLineHighlights(next);
      return next;
    });
    onAddFeedbackRange?.({ start, end, createdAt });
  }

  function removeRange(id) {
    setRanges((prev) => {
      const next = prev.filter((r) => r.id !== id);
      applyLineHighlights(next);
      return next;
    });
  }

  function clearTempDecorations() {
    const editor = editorRef.current;
    if (!editor) return;
    editor.__tempDecorations = editor.deltaDecorations(editor.__tempDecorations || [], []);
  }

  function decorateTempRange(start, end) {
    const editor = editorRef.current;
    if (!editor) return;
    const decorations = [
      {
        range: { startLineNumber: start, startColumn: 1, endLineNumber: end, endColumn: 1 },
        options: { isWholeLine: true, className: "lineHighlightFeedback", marginClassName: "lineHighlightGutter" },
      },
    ];
    editor.__tempDecorations = editor.deltaDecorations(editor.__tempDecorations || [], decorations);
  }

  function applyLineHighlights(rangeList) {
    const editor = editorRef.current;
    if (!editor) return;
    const decorations = rangeList.map((r) => ({
      range: { startLineNumber: r.start, startColumn: 1, endLineNumber: r.end, endColumn: 1 },
      options: { isWholeLine: true, className: "lineHighlightFeedback", marginClassName: "lineHighlightGutter" },
    }));
    editor.__feedbackDecorations = editor.deltaDecorations(editor.__feedbackDecorations || [], decorations);
  }

  function saveComment(id, text) {
    let saved;
    setRanges((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          saved = { ...r, text, editing: false };
          return saved;
        }
        return r;
      });
      return next;
    });
    if (saved) onSaveFeedback?.(saved);
  }

  function editComment(id) {
    setRanges((prev) => prev.map((r) => (r.id === id ? { ...r, editing: true } : r)));
  }

  // 초기 예시 피드백이 전달되면 한 번만 주입
  useEffect(() => {
    if (!initialFeedbacks || initialFeedbacks.length === 0) return;
    const seed = initialFeedbacks.map((f, idx) => ({
      id: `${f.start}-${f.end}-seed-${idx}`,
      start: f.start,
      end: f.end,
      text: f.text || "",
      editing: false,
      createdAt: new Date(),
    }));
    setRanges(seed);
    applyLineHighlights(seed);

  }, []);

  return (
    <div className={`rounded-lg overflow-hidden border border-green-300 bg-green-50 ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-b border-green-300">
        <div className="flex items-center gap-1 text-green-700 text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="ml-2">{title}</span>
        </div>
        <span className="ml-auto text-xs text-green-700">줄 번호를 드래그해 범위 선택</span>
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
          }}
        />
      </div>

      {/* 피드백 범위 목록 */}
      <div className="bg-green-50 border-t border-green-200 p-3">
        <div className="text-sm font-semibold text-green-800 mb-2">피드백 목록</div>
        <div className="space-y-2">
          {ranges.length === 0 && (
            <div className="text-xs text-green-700">라인 번호를 드래그해 범위를 추가하세요.</div>
          )}
          {ranges.map((r) => (
            <div key={r.id} className="text-sm bg-white border border-green-200 rounded-md px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="text-green-700 font-medium">라인 {r.start}–{r.end}</div>
                <div className="flex items-center gap-3">
                  {!r.editing && (
                    <button onClick={() => editComment(r.id)} className="text-green-700 hover:underline text-xs">편집</button>
                  )}
                  <button onClick={() => removeRange(r.id)} className="text-green-700 hover:underline text-xs">삭제</button>
                </div>
              </div>
              <div className="mt-2">
                {r.editing ? (
                  <FeedbackInlineEditor
                    initialValue={r.text}
                    onSave={(text) => saveComment(r.id, text)}
                  />
                ) : (
                  <div className="text-gray-700 whitespace-pre-wrap leading-6">{r.text || '코멘트가 없습니다.'}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedbackInlineEditor({ initialValue = "", onSave }) {
  const [text, setText] = useState(initialValue);
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="이 범위에 대한 구체적인 피드백을 입력하세요. 예: 성능, 가독성, 버그 지점 등"
        className="w-full px-3 py-2 border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-500 text-sm"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onSave?.(text.trim())}
          className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs hover:bg-green-700"
        >
          저장
        </button>
      </div>
    </div>
  );
}


