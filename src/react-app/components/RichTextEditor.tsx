/**
 * Rich Text Editor Component
 * Modern WYSIWYG editor for blog posts and content creation
 */

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Eye,
    Image,
    Italic,
    Link,
    List,
    ListOrdered,
    Redo,
    Underline,
    Undo
} from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

const RichTextEditor = memo(function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  height = "400px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Execute formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Insert link
  const insertLink = useCallback(() => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl("");
    }
  }, [linkUrl, execCommand]);

  // Insert image
  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Bold,
      command: 'bold',
      tooltip: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      command: 'italic',
      tooltip: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      command: 'underline',
      tooltip: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    { divider: true },
    {
      icon: List,
      command: 'insertUnorderedList',
      tooltip: 'Bullet List'
    },
    {
      icon: ListOrdered,
      command: 'insertOrderedList',
      tooltip: 'Numbered List'
    },
    { divider: true },
    {
      icon: AlignLeft,
      command: 'justifyLeft',
      tooltip: 'Align Left'
    },
    {
      icon: AlignCenter,
      command: 'justifyCenter',
      tooltip: 'Align Center'
    },
    {
      icon: AlignRight,
      command: 'justifyRight',
      tooltip: 'Align Right'
    },
    { divider: true },
    {
      icon: Link,
      onClick: () => setShowLinkDialog(true),
      tooltip: 'Insert Link'
    },
    {
      icon: Image,
      onClick: insertImage,
      tooltip: 'Insert Image'
    },
    { divider: true },
    {
      icon: Undo,
      command: 'undo',
      tooltip: 'Undo (Ctrl+Z)'
    },
    {
      icon: Redo,
      command: 'redo',
      tooltip: 'Redo (Ctrl+Y)'
    }
  ];

  return (
    <div className={`border border-neutral-300 rounded-2xl overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-neutral-200 p-4 bg-neutral-50">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            if ('divider' in button) {
              return <div key={index} className="w-px h-6 bg-neutral-300 mx-2" />;
            }

            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.onClick || (() => execCommand(button.command!))}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors group relative"
                title={button.tooltip}
              >
                <Icon className="w-4 h-4 text-neutral-700" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {button.tooltip}
                </div>
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-6 bg-neutral-300 mx-2" />

          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isPreviewMode 
                ? 'bg-primary-100 text-primary-700' 
                : 'hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isPreviewMode ? 'Edit' : 'Preview'}
            </span>
          </button>

          {/* HTML View */}
          <button
            type="button"
            onClick={() => alert(editorRef.current?.innerHTML)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
            title="View HTML"
          >
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {isPreviewMode ? (
          /* Preview Mode */
          <div 
            className="p-6 prose prose-neutral max-w-none"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: value || `<p class="text-neutral-500">${placeholder}</p>` }}
          />
        ) : (
          /* Edit Mode */
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className="p-6 focus:outline-none"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: value }}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}

        {/* Placeholder */}
        {!isPreviewMode && !value && (
          <div 
            className="absolute top-6 left-6 text-neutral-500 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={insertLink}
                  disabled={!linkUrl}
                  className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert Link
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="flex-1 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="border-t border-neutral-200 px-4 py-2 bg-neutral-50 text-xs text-neutral-500 flex items-center justify-between">
        <div>
          {value.length} characters | {value.split(' ').filter(word => word.length > 0).length} words
        </div>
        <div className="flex items-center gap-4">
          <span>Ctrl+B: Bold</span>
          <span>Ctrl+I: Italic</span>
          <span>Ctrl+U: Underline</span>
        </div>
      </div>
    </div>
  );
});

export default RichTextEditor;