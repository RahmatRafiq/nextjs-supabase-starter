'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import { cn } from '@/shared/utils/cn';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  FileText,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  showPreview?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  height = '500px',
  readOnly = false,
  showPreview = false,
}: RichTextEditorProps): React.ReactElement {
  const [previewMarkdown, setPreviewMarkdown] = useState(value);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border p-3',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-bold p-3 border',
        },
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: false,
        linkify: false,
        breaks: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 no-underline hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full',
        },
      }),
    ],
    content: value,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-none prose-lg',
          'prose-headings:font-bold prose-headings:text-gray-900',
          'prose-p:text-gray-700 prose-p:leading-relaxed',
          'prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-gray-900 prose-strong:font-bold',
          'prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
          'prose-pre:bg-gray-900 prose-pre:text-gray-100',
          'prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic',
          'prose-ul:list-disc prose-ol:list-decimal',
          'prose-li:text-gray-700',
          'prose-table:border-collapse prose-th:bg-gray-100 prose-th:font-bold prose-th:p-3 prose-td:p-3 prose-td:border',
          'prose-img:rounded-lg prose-img:shadow-md',
          'focus:outline-none p-4'
        ),
      },
      handlePaste: (_view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          // Let Tiptap handle markdown conversion automatically
          return false;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // Get markdown from storage if available, otherwise get HTML
      const markdown = (editor.storage as { markdown?: { getMarkdown?: () => string } }).markdown?.getMarkdown?.() ?? editor.getHTML();
      setPreviewMarkdown(markdown);
      onChange(markdown);
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== (editor.storage as { markdown?: { getMarkdown?: () => string } }).markdown?.getMarkdown?.()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) {
      return;
    }

    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) {
      return;
    }

    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const pasteMarkdown = useCallback(async () => {
    if (!editor) {
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Clear current content and set markdown directly
        editor.commands.setContent(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      // Fallback: prompt user to paste manually
      const text = window.prompt('Paste your markdown here:');
      if (text) {
        editor.commands.setContent(text);
      }
    }
  }, [editor]);

  if (!editor) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <div className={cn(
      "border border-gray-300 rounded-lg overflow-hidden",
      showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-0" : ""
    )}>
      {/* Editor Section */}
      <div className="flex flex-col">
        {/* Toolbar */}
        <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-300 px-2 py-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('bold') ? 'bg-gray-200' : ''
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('italic') ? 'bg-gray-200' : ''
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('strike') ? 'bg-gray-200' : ''
          )}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          )}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          )}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
          )}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          )}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('blockquote') ? 'bg-gray-200' : ''
          )}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('codeBlock') ? 'bg-gray-200' : ''
          )}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Insert */}
        <button
          type="button"
          onClick={setLink}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('link') ? 'bg-gray-200' : ''
          )}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addTable}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={pasteMarkdown}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Paste Markdown (from clipboard)"
        >
          <FileText className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

        {/* Editor Content */}
        <div style={{ height }} className="overflow-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="flex flex-col border-l border-gray-300">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>
          <div
            style={{ height }}
            className="overflow-auto p-4 prose prose-lg max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {previewMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
