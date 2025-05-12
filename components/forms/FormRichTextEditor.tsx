import React, { useEffect, useState } from "react";
import {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";

// ─────────────────────────────────────────────
// ToolbarButton component
// ─────────────────────────────────────────────
const ToolbarButton = ({
  isActive,
  onClick,
  title,
  children,
}: {
  isActive?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-1 py-1 transition-colors ${
      isActive ? "text-black" : "text-gray-500"
    }`}
    title={title}
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────
// Main Form Wrapper
// ─────────────────────────────────────────────
interface FormRichTextEditorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  className?: string;
  placeholder?: string;
}

export function FormRichTextEditor<T extends FieldValues>({
  name,
  control,
  label,
  description,
  className = "",
  placeholder,
}: FormRichTextEditorProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <TiptapEditor<T> field={field} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─────────────────────────────────────────────
// Tiptap Editor & Toolbar
// ─────────────────────────────────────────────
function TiptapEditor<T extends FieldValues>({
  field,
  placeholder,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: "max-w-full rounded" },
      }),
    ],
    content: field.value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (field.value !== html) field.onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[100px]",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value || "");
    }
  }, [field.value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[150px] bg-white border border-gray-300 rounded-md p-2" />
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="p-3 relative z-0" style={{ overflow: 'visible' }}>
        <EditorContent
          editor={editor}
          className="min-h-[150px]"
          style={{ overflow: "visible" }}
        />
        <style>{`
          .ProseMirror img {
            display: block;
            max-width: 100%;
            height: auto;
            margin: 0.5em 0;
            border-radius: 0.5em;
          }
          .ProseMirror a {
            color: #2563eb;
            text-decoration: underline;
            cursor: pointer;
            word-break: break-word;
          }
        `}</style>
      </div>
      <TiptapToolbar editor={editor} />
    </div>
  );
}

function TiptapToolbar({ editor }: { editor: Editor | null }) {
  const [openDropdown, setOpenDropdown] = useState<null | 'fontSize' | 'textStyle' | 'color'>(null);

  const COLORS = [
    "#000000",
    "#FF0000",
    "#0000FF",
    "#008000",
    "#FFA500",
    "#800080",
  ];
  const FONT_SIZES = [12, 14, 16, 18, 24, 32];
  const TEXT_STYLES = [
    { label: "Normal", value: "paragraph" },
    { label: "Heading 1", value: "heading1" },
    { label: "Heading 2", value: "heading2" },
    { label: "Heading 3", value: "heading3" },
  ];

  if (!editor) return null;

  const setTextStyle = (style: string) => {
    const chain = editor.chain().focus();
    if (style === "paragraph") chain.setParagraph().run();
    else if (style.startsWith("heading")) {
      const level = Math.max(1, Math.min(6, parseInt(style.replace("heading", "")))) as 1 | 2 | 3 | 4 | 5 | 6;
      chain.toggleHeading({ level }).run();
    }
  };

  return (
    <div className="relative z-50 flex items-center justify-center mx-2 mb-2 flex-nowrap space-x-0.5 bg-[#F0F1F2] overflow-visible">
      {/* Font Size Selector */}
      <div className="relative mr-1">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'fontSize' ? null : 'fontSize')}
          className="text-xs px-1 text-gray-500"
          title="Font Size"
        >
          {parseInt(editor.getAttributes("textStyle").fontSize) || 14}
        </button>
        {openDropdown === 'fontSize' && (
          <div className="absolute bottom-full left-0 mb-1 p-2 bg-white rounded shadow-lg border z-50 flex flex-col gap-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className="text-xs   py-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setMark("textStyle", { fontSize: `${size}px` })
                    .run();
                  setOpenDropdown(null);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Style Selector */}
      <div className="relative mr-1">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'textStyle' ? null : 'textStyle')}
          className="text-base ms-1   py-1 text-gray-700 "
          title="Text Style"
        >
          T
        </button>
        {openDropdown === 'textStyle' && (
          <div className="absolute bottom-full left-0 mb-1 p-2 bg-white rounded shadow-lg border z-50 flex flex-col gap-1 min-w-[100px]">
            {TEXT_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                className="text-xs  py-1 hover:bg-gray-100 rounded text-left"
                onClick={() => {
                  setTextStyle(style.value);
                  setOpenDropdown(null);
                }}
              >
                {style.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="relative mr-.5 ">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{
            backgroundColor: editor.getAttributes("textStyle").color || "#000",
          }}
          title="Text Color"
        />
        {openDropdown === 'color' && (
          <div className="absolute bottom-full left-0 mb-1 p-2 bg-white rounded shadow-lg border z-50 flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="w-5 h-5 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setOpenDropdown(null);
                }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Formatting buttons - Lucide icons */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      {/* Insert Image */}
      <ToolbarButton
        onClick={() => {
          const url = window.prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        title="Insert Image"
      >
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      {/* Insert Link */}
      <ToolbarButton
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            const formattedUrl = url.startsWith("http")
              ? url
              : `https://${url}`;
            editor.chain().focus().setLink({ href: formattedUrl }).run();
          }
        }}
        isActive={editor.isActive("link")}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}
