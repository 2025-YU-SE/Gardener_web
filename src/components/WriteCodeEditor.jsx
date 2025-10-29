import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function WriteCodeEditor({
  value = "",
  onChange,
  language = "javascript",
  height = 420,
  minHeight = 240,
  maxHeight = 680,
  title = "JAVASCRIPT - 작성 모드",
  className = "",
}) {
  const editorRef = useRef(null);
  const [code, setCode] = useState(value);
  const containerHeight = useMemo(() => `${height}px`, [height]);

  useEffect(() => {
    setCode(value);
  }, [value]);

  function handleMount(editor) {
    editorRef.current = editor;
  }

  function handleChange(v) {
    setCode(v ?? "");
    onChange?.(v ?? "");
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
        <span className="ml-auto text-xs text-green-700">작성 전용</span>
      </div>

      <div style={{ height: containerHeight }} className="bg-[#1e1e1e]">
        <Editor
          value={code}
          onChange={handleChange}
          language={language}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            readOnly: false,
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


