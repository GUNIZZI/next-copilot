'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  ImageIcon,
  Link as LinkIcon,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import './editor.css';

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-lg bg-slate-900 p-4 text-slate-100',
          },
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: '굵게',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: '기울임',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: '코드',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: '제목 2',
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: '제목 3',
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: '글머리 목록',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: '번호 목록',
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-900">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-800">
        {toolbarButtons.map((btn, idx) => (
          <Button
            key={idx}
            onClick={btn.action}
            variant={btn.isActive ? 'default' : 'outline'}
            size="sm"
            title={btn.title}
            className="h-9 w-9 p-0"
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <Button
          onClick={addImage}
          variant="outline"
          size="sm"
          title="이미지 추가"
          className="h-9 w-9 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          onClick={addLink}
          variant="outline"
          size="sm"
          title="링크 추가"
          className="h-9 w-9 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* 에디터 */}
      <div className="prose prose-sm dark:prose-invert max-w-none p-4">
        <EditorContent
          editor={editor}
          className="min-h-96 focus:outline-none"
        />
      </div>
    </div>
  );
}
