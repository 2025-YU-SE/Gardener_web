import { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";


export default function ReadonlyCodeEditor({
  value,
  language = "javascript",
  height = 380,
  // 고정 높이 모드로 사용
  title = "JAVASCRIPT - 읽기 전용",
  highlightLines = [],
  className = "",
}) {
  const editorRef = useRef(null);
  const containerHeight = useMemo(() => `${height}px`, [height]);

  useEffect(() => {
    const styleId = "readonly-editor-inline-style";
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

  function handleMount(editor) {
    editorRef.current = editor;

    // 읽기 전용 명시 및 라인 하이라이트 적용
    editor.updateOptions({ readOnly: true });
    applyLineHighlights(highlightLines);
  }

  function applyLineHighlights(lines) {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    const decorations = lines.map((lineNumber) => ({
      range: {
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
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

  return (
    <div className={`rounded-lg overflow-hidden border border-green-300 bg-green-50 ${className}`}> 
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-b border-green-300">
        <div className="flex items-center gap-1 text-green-700 text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="ml-2">{title}</span>
        </div>
        <span className="ml-auto text-xs text-green-700">읽기 전용</span>
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
    </div>
  );
}


