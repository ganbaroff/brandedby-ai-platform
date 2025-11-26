import { Template } from '@/shared/admin-data-utils';
import { Check, X } from 'lucide-react';
import React, { useState } from 'react';

interface TemplateEditorProps {
  initialData?: Template;
  isLoading?: boolean;
  onSave: (data: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Birthday',
  'Holiday',
  'Business',
  'Sales',
  'Personal',
  'Entertainment',
  'Greeting',
  'Education'
];

const COMMON_EMOJIS = [
  '🎂', '🎉', '🎊', '🎁', '🎈', // Birthday/Celebration
  '🎄', '🎃', '🕌', '🇦🇿', '🎆', // Holiday
  '💼', '🏢', '🚀', '📈', '📢', // Business
  '🛍️', '💸', '🏷️', '💰', '🎯', // Sales
  '💍', '🎓', '💖', '🌷', '👔', // Personal
  '🎬', '🔥', '😂', '🕺', '🎵', // Entertainment
  '👋', '🙏', '💑', '🧒', '🏖️', // Greeting/Personal
  '📚', '✏️', '🎓', '📖', '🧠'  // Education
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  initialData,
  isLoading = false,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'created_at' | 'updated_at'>>({
    name: initialData?.name || '',
    category: initialData?.category || 'Birthday',
    description: initialData?.description || '',
    is_azeri: initialData?.is_azeri || false,
    preview_url: initialData?.preview_url || '',
    emoji: initialData?.emoji || '🎂',
    status: initialData?.status || 'active',
    usage_count: initialData?.usage_count || 0,
    tags: initialData?.tags || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.emoji.trim()) {
      newErrors.emoji = 'Emoji is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      handleChange('tags', [...(formData.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Template' : 'Create New Template'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isLoading}
          title="Close"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Happy Birthday 2026"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Category and Emoji Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              title="Select Category"
              aria-label="Select Category"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emoji *
            </label>
            <input
              type="text"
              value={formData.emoji}
              onChange={(e) => handleChange('emoji', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl text-center ${
                errors.emoji ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="🎂"
              maxLength={2}
              disabled={isLoading}
            />
            {errors.emoji && (
              <p className="mt-1 text-sm text-red-600">{errors.emoji}</p>
            )}
          </div>
        </div>

        {/* Emoji Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Emoji Selection
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleChange('emoji', emoji)}
                className={`w-10 h-10 text-2xl rounded-lg border-2 transition-all ${
                  formData.emoji === emoji
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Brief description of this template..."
            disabled={isLoading}
          />
        </div>

        {/* Preview URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview URL
          </label>
          <input
            type="url"
            value={formData.preview_url || ''}
            onChange={(e) => handleChange('preview_url', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/preview.mp4"
            disabled={isLoading}
          />
        </div>

        {/* Status and Azeri Flag Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'active' | 'draft' | 'archived')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              title="Select Status"
              aria-label="Select Status"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Azeri Flag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <label className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.is_azeri}
                onChange={(e) => handleChange('is_azeri', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-gray-700">Azeri Language 🇦🇿</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag..."
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !tagInput.trim()}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  disabled={isLoading}
                  title="Remove tag"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Template
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateEditor;
