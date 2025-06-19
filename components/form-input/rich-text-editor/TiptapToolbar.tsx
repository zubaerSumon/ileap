import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
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
import { ToolbarButton } from "./ToolbarButton";

const COLORS = [
  "#000000",
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFA500",
  "#800080",
];

const FONT_SIZES = ["12", "14", "16", "18", "24", "32"];

const TEXT_STYLES = [
  { label: "Normal", value: "paragraph" },
  { label: "Heading 1", value: "heading1" },
  { label: "Heading 2", value: "heading2" },
  { label: "Heading 3", value: "heading3" },
];

interface TiptapToolbarProps {
  editor: Editor | null;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<null | 'fontSize' | 'textStyle' | 'color'>(null);
  const [currentFontSize, setCurrentFontSize] = useState("14");

  useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const { fontSize } = editor.getAttributes('textStyle');
      if (fontSize) {
        const size = fontSize.replace('px', '');
        setCurrentFontSize(size);
      } else {
        setCurrentFontSize("14"); // Default size
      }
    };

    editor.on('selectionUpdate', updateFontSize);
    editor.on('update', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('update', updateFontSize);
    };
  }, [editor]);

  if (!editor) return null;

  const setTextStyle = (style: string) => {
    const chain = editor.chain().focus();
    if (style === "paragraph") {
      chain.setParagraph().run();
    } else if (style.startsWith("heading")) {
      const level = parseInt(style.replace("heading", "")) as 1 | 2 | 3;
      chain.setHeading({ level }).run();
    }
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { 
      fontSize: `${size}px`
    }).run();
    setCurrentFontSize(size);
  };

  return (
    <div className="relative z-50 flex items-center w-full  px-2 bg-[#F0F1F2]  mb-2 flex-nowrap space-x-0.5 overflow-visible">
      {/* Font Size Selector */}
      <div className="relative mr-1">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'fontSize' ? null : 'fontSize')}
          className="text-xs px-1 text-gray-500"
          title="Font Size"
        >
          {currentFontSize}
        </button>
        {openDropdown === 'fontSize' && (
          <div className="absolute bottom-full left-0 mb-1 p-2 bg-white rounded shadow-lg border z-50 flex flex-col gap-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className="text-xs py-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  setFontSize(size);
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
          className="text-base ms-1 py-1 text-gray-700"
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
                className="text-xs py-1 hover:bg-gray-100 rounded text-left"
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

      {/* Formatting buttons */}
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