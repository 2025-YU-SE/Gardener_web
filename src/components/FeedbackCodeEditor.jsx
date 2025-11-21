import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function FeedbackCodeEditor({
                                             value,
                                             language = "javascript",
                                             height = 420,
                                             title = "JAVASCRIPT - 피드백 모드",
                                             onAddFeedbackRange,
                                             onSaveFeedback,
                                             initialFeedbacks = [],
                                           }) {
  const editorRef = useRef(null);
  const idRef = useRef(0);
  const [ranges, setRanges] = useState([]);
  const [dragStart, setDragStart] = useState(null);

  const containerHeight = useMemo(() => `${height}px`, [height]);

  // 기본 스타일 삽입
  useEffect(() => {
    const styleId = "line-feedback-style";
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;

    let isDragging = false;
    let startLine = null;

    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const line = e.target.position?.lineNumber;
        if (!line) return;

        isDragging = true;
        startLine = line;
        setDragStart(line);
        decorateTempRange(line, line);
      }
    });

    editor.onMouseMove((e) => {
      if (!isDragging || !startLine) return;
      const curr = e.target.position?.lineNumber;
      if (!curr) return;
      const start = Math.min(startLine, curr);
      const end = Math.max(startLine, curr);
      decorateTempRange(start, end);
    });

    editor.onMouseUp((e) => {
      if (!isDragging) return;
      const endLine = e.target.position?.lineNumber || startLine;
      const start = Math.min(startLine, endLine);
      const end = Math.max(startLine, endLine);

      addRange(start, end);

      isDragging = false;
      startLine = null;
      clearTempDecorations();
    });

    editor.onMouseLeave(() => {
      isDragging = false;
      startLine = null;
      clearTempDecorations();
    });
  };

  const addRange = (start, end) => {
    idRef.current += 1;
    const id = `r-${idRef.current}-${Date.now()}`;
    const newItem = {
      id,
      start,
      end,
      text: "",
      editing: true,
      createdAt: new Date(),
    };

    setRanges((prev) => {
      const next = [...prev, newItem];
      applyHighlights(next);
      return next;
    });

    onAddFeedbackRange?.(newItem);
  };

  const saveComment = (id, text) => {
    let updated = null;

    setRanges((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          updated = { ...r, text, editing: false };
          return updated;
        }
        return r;
      });
      return next;
    });

    if (updated) onSaveFeedback?.(updated);
  };

  const editComment = (id) => {
    setRanges((prev) =>
        prev.map((r) => (r.id === id ? { ...r, editing: true } : r))
    );
  };

  const removeRange = (id) => {
    setRanges((prev) => {
      const next = prev.filter((r) => r.id !== id);
      applyHighlights(next);
      return next;
    });
  };

  // 하이라이트 적용
  const applyHighlights = (list) => {
    const editor = editorRef.current;
    if (!editor) return;

    const decos = list.map((r) => ({
      range: {
        startLineNumber: r.start,
        startColumn: 1,
        endLineNumber: r.end,
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
        decos
    );
  };

  const decorateTempRange = (start, end) => {
    const editor = editorRef.current;
    if (!editor) return;

    const decos = [
      {
        range: {
          startLineNumber: start,
          startColumn: 1,
          endLineNumber: end,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "lineHighlightFeedback",
          marginClassName: "lineHighlightGutter",
        },
      },
    ];

    editor.__tempDecorations = editor.deltaDecorations(
        editor.__tempDecorations || [],
        decos
    );
  };

  const clearTempDecorations = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.__tempDecorations = editor.deltaDecorations(
        editor.__tempDecorations || [],
        []
    );
  };

  return (
      <div className="border border-green-300 rounded-lg overflow-hidden bg-green-50">
        <div className="px-4 py-2 bg-green-100 border-b border-green-300 text-sm font-semibold text-green-700">
          {title}
        </div>

        <div style={{ height: containerHeight }}>
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
                automaticLayout: true,
                padding: { top: 8, bottom: 8 },
              }}
          />
        </div>

        {/* 피드백 목록 */}
        <div className="p-3 bg-green-50 border-t border-green-200">
          <div className="text-sm font-semibold text-green-800 mb-2">피드백 목록</div>

          {ranges.length === 0 && (
              <div className="text-xs text-green-700">라인을 드래그해 피드백 범위를 추가하세요.</div>
          )}

          <div className="space-y-2">
            {ranges.map((r) => (
                <div key={r.id} className="bg-white border border-green-200 p-3 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium text-sm text-green-700">
                      라인 {r.start}–{r.end}
                    </div>
                    <div className="flex gap-3 text-xs">
                      {!r.editing && (
                          <button onClick={() => editComment(r.id)} className="text-green-700">
                            편집
                          </button>
                      )}
                      <button onClick={() => removeRange(r.id)} className="text-green-700">
                        삭제
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    {r.editing ? (
                        <InlineEditor
                            initialValue={r.text}
                            onSave={(t) => saveComment(r.id, t)}
                        />
                    ) : (
                        <div className="text-gray-700 whitespace-pre-wrap text-sm">
                          {r.text || "코멘트 없음"}
                        </div>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

function InlineEditor({ initialValue, onSave }) {
  const [text, setText] = useState(initialValue || "");

  return (
      <div>
      <textarea
          className="w-full border border-green-200 rounded-md p-2 text-sm"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
      />
        <div className="flex justify-end mt-2">
          <button
              onClick={() => onSave(text.trim())}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-xs"
          >
            저장
          </button>
        </div>
      </div>
  );
}
