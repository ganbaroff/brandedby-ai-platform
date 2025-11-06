import { Template as BaseTemplate } from "@/shared/types";
import { Sparkles } from "lucide-react";
import { useState } from "react";


type TemplateWithEmoji = BaseTemplate & { emoji: string };

interface TemplateModalProps {
  open: boolean;
  template: TemplateWithEmoji | null;
  onClose: () => void;
  onSave: (fields: { [key: string]: string }) => void;
}

const DEFAULT_FIELDS: { [key: string]: string[] } = {
  Birthday: ["Recipient Name", "Personal Message"],
  Holiday: ["Recipient Name", "Holiday Wish"],
  Business: ["Company Name", "Offer", "Call to Action"],
  Sales: ["Product Name", "Discount", "Promo Code"],
  Personal: ["Recipient Name", "Occasion", "Message"],
  Entertainment: ["Video Idea", "Special Request"],
  Greeting: ["Recipient Name", "Greeting Message"],
  Education: ["Topic", "Key Points"],
};

export default function TemplateModal({ open, template, onClose, onSave }: TemplateModalProps) {
  const [fields, setFields] = useState<{ [key: string]: string }>({});

  if (!open || !template) return null;

  const categoryFields = DEFAULT_FIELDS[template.category] || ["Message"];

  const handleChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(fields);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>{template.emoji}</span> {template.name} Template
        </h2>
        <div className="space-y-4">
          {categoryFields.map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-1">{field}</label>
              <input
                type="text"
                value={fields[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-auto flex items-center gap-1 text-purple-600 hover:text-purple-800"
            onClick={() => {
              // AI suggestion example
              setFields((prev) => {
                const newFields = { ...prev };
                categoryFields.forEach((f) => {
                  newFields[f] = `AI suggestion for ${f}`;
                });
                return newFields;
              });
            }}
          >
            <Sparkles className="w-4 h-4" /> AI Suggest
          </button>
        </div>
      </div>
    </div>
  );
}
