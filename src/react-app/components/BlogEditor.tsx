/**
 * Enhanced Blog Editor Component
 * Complete blog post editor with live preview, category management, and SEO fields
 */

import { Eye, EyeOff, Save } from "lucide-react";
import { useCallback, useState } from "react";
import RichTextEditor from "./RichTextEditor";

export interface BlogEditorData {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  image_url: string;
}

interface BlogEditorProps {
  initialData?: BlogEditorData;
  onSave: (data: Omit<BlogEditorData, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: string[];
}

const PRESET_CATEGORIES = [
  'Technology',
  'Tutorial',
  'AI',
  'Entertainment',
  'Business',
  'News',
  'Opinion',
  'Guide'
];

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  categories = PRESET_CATEGORIES
}) => {
  const [data, setData] = useState<BlogEditorData>(
    initialData || {
      title: '',
      excerpt: '',
      content: '',
      category: 'Technology',
      author: '',
      publishedAt: new Date().toISOString().split('T')[0],
      image_url: ''
    }
  );

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!data.title.trim()) newErrors.title = 'Title is required';
    if (!data.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!data.content.trim()) newErrors.content = 'Content is required';
    if (!data.author.trim()) newErrors.author = 'Author is required';
    if (!data.category) newErrors.category = 'Category is required';
    if (!data.publishedAt) newErrors.publishedAt = 'Publish date is required';

    if (data.title.length > 200) newErrors.title = 'Title must be less than 200 characters';
    if (data.excerpt.length > 500) newErrors.excerpt = 'Excerpt must be less than 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...dataWithoutId } = data;
      onSave(dataWithoutId);
    }
  }, [data, validateForm, onSave]);

  const handleChange = useCallback((field: keyof BlogEditorData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.innerText || temp.textContent || '';
  };

  const wordCount = stripHtml(data.content).split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData?.id ? 'Edit Post' : 'New Blog Post'}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter an engaging title"
              maxLength={200}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${errors.title ? 'text-red-500' : 'text-gray-500'}`}>
                {errors.title || `${data.title.length}/200`}
              </span>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Excerpt (Summary) *
            </label>
            <textarea
              value={data.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief summary that appears in listings"
              maxLength={500}
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${errors.excerpt ? 'text-red-500' : 'text-gray-500'}`}>
                {errors.excerpt || `${data.excerpt.length}/500`}
              </span>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                value={data.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Your name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.author && <span className="text-xs text-red-500 mt-1 block">{errors.author}</span>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={data.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="text-xs text-red-500 mt-1 block">{errors.category}</span>}
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publish Date *
              </label>
              <input
                type="date"
                value={data.publishedAt}
                onChange={(e) => handleChange('publishedAt', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.publishedAt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.publishedAt && <span className="text-xs text-red-500 mt-1 block">{errors.publishedAt}</span>}
            </div>

            {/* Featured Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="url"
                value={data.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image Preview */}
          {data.image_url && (
            <div className="bg-gray-50 rounded-lg p-4">
              <img
                src={data.image_url}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Image+Error';
                }}
              />
            </div>
          )}

          {/* Content Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Post Content *
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[400px] prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
                <p className="text-xs text-gray-500 mt-4 pt-4 border-t">
                  Word count: {wordCount}
                </p>
              </div>
            ) : (
              <div>
                <RichTextEditor
                  value={data.content}
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Write your post content here..."
                  height="400px"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Word count: {wordCount}
                </p>
                {errors.content && <span className="text-xs text-red-500 block mt-1">{errors.content}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
  );
};

export default BlogEditor;
