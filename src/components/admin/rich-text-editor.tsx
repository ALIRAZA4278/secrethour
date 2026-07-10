'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'w-full px-4 py-3 text-gray-900 focus:outline-none min-h-[320px] max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const buttonClass =
    'px-2.5 py-1.5 text-xs rounded hover:bg-gray-200 transition text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-[0.05em] border border-gray-300 hover:border-gray-400';
  const separatorClass = 'w-px bg-gray-300 h-5 mx-1';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-300 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${buttonClass} ${editor.isActive('bold') ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${buttonClass} italic ${editor.isActive('italic') ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <div className={separatorClass} />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${buttonClass} font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${buttonClass} font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Heading 2"
        >
          H2
        </button>

        <div className={separatorClass} />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${buttonClass} ${editor.isActive('bulletList') ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${buttonClass} ${editor.isActive('orderedList') ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Ordered List"
        >
          1. List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${buttonClass} ${editor.isActive('blockquote') ? 'bg-gray-200 border-gray-400' : ''}`}
          title="Quote"
        >
          "
        </button>

        <div className={separatorClass} />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={buttonClass}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={buttonClass}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
