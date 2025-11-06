
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import TemplateModal from "@/react-app/components/TemplateModal";
import { useFileUpload } from "@/react-app/hooks/useFileUpload";
import templatesData from "@/shared/templates.json";
import { Template as BaseTemplate } from "@/shared/types";
import { useAuth } from "@getmocha/users-service/react";
import { Image as ImageIcon, Loader, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type Template = BaseTemplate & { emoji: string };

export default function SelfieUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploading, progress, error: uploadError, uploadFile } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  const [showDowngradeWarning, setShowDowngradeWarning] = useState(false);
  // Modal state for template editing
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<Template | null>(null);

  // Automatic package upgrade logic
  const handlePackageLogic = (templateId: string, formatId: string) => {
    // Example: if Holiday or Business template is selected — Pro, if both — Premium
    const template = templates.find((t) => t.id === Number(templateId));
    let autoPackage = 'Standard';
    if (template) {
      if (template.category === 'Business' || template.category === 'Holiday') autoPackage = 'Pro';
      if (template.category === 'Business' && formatId === 'advertisement') autoPackage = 'Premium';
    }
    if (selectedPackage !== autoPackage) {
      setSelectedPackage(autoPackage);
      setShowDowngradeWarning(false);
    }
  };

  // Auto-upgrade when template or format is selected
  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    handlePackageLogic(id, selectedFormat);
  };

  // Open modal for editing template fields
  const handleEditTemplate = (template: Template) => {
    setModalTemplate(template);
    setModalOpen(true);
  };

  // Save modal fields to description
  const handleSaveTemplateFields = (fields: { [key: string]: string }) => {
    // Compose description from fields
    const desc = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    setDescription(desc);
  };
  const handleFormatSelect = (id: string) => {
    setSelectedFormat(id);
    handlePackageLogic(selectedTemplate, id);
  };

  // Show warning when manually downgrading package
  const handlePackageSelect = (pkg: string) => {
  // Determine recommended package
  if (selectedPackage === 'Premium' && pkg !== 'Premium') setShowDowngradeWarning(true);
  else setShowDowngradeWarning(false);
  setSelectedPackage(pkg);
  };

  const templates = templatesData;

  const videoFormats = [
    { id: 'greeting', name: 'Personal Greeting', icon: '👋' },
    { id: 'advertisement', name: 'Advertisement', icon: '📺' },
    { id: 'announcement', name: 'Announcement', icon: '📢' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' }
  ];

  // Colors for template categories
  const categoryColors: Record<string, string> = {
    Birthday: 'bg-pink-100 text-pink-800',
    Holiday: 'bg-blue-100 text-blue-800',
    Business: 'bg-green-100 text-green-800',
    Sales: 'bg-yellow-100 text-yellow-800',
    Personal: 'bg-purple-100 text-purple-800',
    Entertainment: 'bg-orange-100 text-orange-800',
    Greeting: 'bg-indigo-100 text-indigo-800',
    Education: 'bg-cyan-100 text-cyan-800',
  };

  // AI suggestions by template
  const getAISuggestion = (templateName: string) => {
  if (templateName.includes('Birthday')) return 'Congratulate them on their birthday in a special way! Specify the name and your wishes.';
  if (templateName.includes('Novruz')) return 'Use traditional Novruz greetings and wishes for prosperity.';
  if (templateName.includes('Business')) return 'Describe your product or service, add a call to action.';
  if (templateName.includes('Wedding')) return 'Congratulate the newlyweds, add a personal message.';
  if (templateName.includes('Comedy')) return 'Add a joke or a funny situation for maximum effect.';
  if (templateName.includes('Educational')) return 'Describe the lesson topic or useful information for the viewer.';
  return 'Describe what should be in the video and who it is for.';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Upload file immediately if user is authenticated
      if (user) {
        const fileUrl = await uploadFile(file, 'selfie');
        if (fileUrl) {
          setUploadedFileUrl(fileUrl);
        }
      }
    }
  };

  const handleContinue = async () => {
    if (!user) {
      // Store project data in session storage and redirect to login
      sessionStorage.setItem('pendingProject', JSON.stringify({
        type: 'selfie',
        template_id: selectedTemplate,
        video_format: selectedFormat,
        description,
        package_type: selectedPackage,
      }));
      navigate('/');
      return;
    }

    if (!uploadedFileUrl && selectedFile) {
      const fileUrl = await uploadFile(selectedFile, 'selfie');
      if (!fileUrl) {
        return;
      }
      setUploadedFileUrl(fileUrl);
    }

    // Store data for payment page
    sessionStorage.setItem('projectData', JSON.stringify({
      selfie_url: uploadedFileUrl,
      template_id: selectedTemplate,
      video_format: selectedFormat,
      description,
      package_type: selectedPackage,
    }));

    navigate('/payment');
  };

  const packages = [
    { 
      name: 'Standard', 
      price: 6, 
      features: ['30-second video', 'Basic templates', 'With watermark'],
      recommended: false 
    },
    { 
      name: 'Pro', 
      price: 19, 
      features: ['60-second video', 'Custom location', 'HD quality', 'No watermark'],
      recommended: true 
    },
    { 
      name: 'Premium', 
      price: 49, 
      features: ['90-second video', 'Unlimited locations', '4K quality', 'Multiple characters'],
      recommended: false 
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Upload Your Selfie</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Become the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Star</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your photo and create personalized videos where you're the celebrity. 
              Choose from 30+ professional templates.
            </p>
          </div>
        </div>
      </section>

      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">

            {/* File Upload */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Photo</h2>
              
              {!selectedFile ? (
                <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 transition-colors cursor-pointer">
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-500 hover:text-purple-600 transition-colors">
                    <Upload className="w-12 h-12" />
                    <div className="text-center">
                      <p className="text-lg font-medium">Click to upload your selfie</p>
                      <p className="text-sm">PNG, JPG, or JPEG (max 10MB)</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    className="hidden" 
                  />
                </label>
              ) : (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <button 
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-sm font-medium flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>{selectedFile.name}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Template</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template: Template) => (
                  <div key={template.id} className="relative group">
                    <button
                      onClick={() => handleTemplateSelect(template.id.toString())}
                      className={`w-full p-6 rounded-2xl border-2 text-center transition-all hover:scale-105 ${
                        selectedTemplate === template.id.toString()
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-4xl mb-3">{template.emoji}</div>
                      <h3 className="font-semibold text-lg mb-1">
                        {template.name}
                        {template.is_azeri && <span className="ml-2">🇦🇿</span>}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${categoryColors[template.category] || 'bg-gray-100 text-gray-800'}`}>{template.category}</span>
                    </button>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-purple-100 text-purple-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit template fields"
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
      {/* Template Modal for editing fields */}
      <TemplateModal
        open={modalOpen}
        template={modalTemplate}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTemplateFields}
      />
              </div>
            </div>

            {/* Video Format */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Format</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videoFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handleFormatSelect(format.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedFormat === format.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <p className="font-medium">{format.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Video Description</h2>
                <button
                  className="flex items-center space-x-1 text-purple-600 text-sm hover:text-purple-700"
                  type="button"
                  onClick={() => {
                    if (selectedTemplate) setDescription(getAISuggestion(templates.find((t) => t.id === Number(selectedTemplate))?.name || ''));
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Suggestions</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video concept, target audience, or special requirements..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Package Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <button
                    key={pkg.name}
                    onClick={() => handlePackageSelect(pkg.name)}
                    className={`relative p-6 rounded-2xl border-2 text-left ${
                      selectedPackage === pkg.name
                        ? 'border-purple-500 bg-purple-50' 
                        : pkg.recommended
                        ? 'border-purple-300 bg-purple-50/50'
                        : 'border-gray-200'
                    } hover:border-purple-300 transition-all`}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Recommended
                        </div>
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-purple-600">${pkg.price}</div>
                      
                      <ul className="space-y-2 text-sm">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </button>
                ))}
                {showDowngradeWarning && (
                  <div className="col-span-full text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4 text-center">
                    <b>Warning:</b> You are selecting a lower package than recommended for your options. Some features may be unavailable.
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center space-y-3">
              {uploadError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                  {uploadError}
                </div>
              )}
              
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-purple-600">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading... {progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleContinue}
                disabled={!selectedFile || !selectedTemplate || !selectedFormat || uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {user ? 'Continue to Payment' : 'Sign In to Continue'}
              </button>
              
              {(!selectedFile || !selectedTemplate || !selectedFormat) && (
                <p className="text-sm text-gray-500 mt-3">
                  Please complete all fields to continue
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
