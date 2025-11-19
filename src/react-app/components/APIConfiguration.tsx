/**
 * API Configuration Management Component
 * Provides interface for managing external API integrations
 */

import { APIConfig, API_TEMPLATES, apiConfigManager } from "@/shared/api-config";
import {
    CheckCircle,
    Copy,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    Key,
    Plus,
    Save,
    Settings,
    TestTube,
    Trash2,
    Upload,
    X,
    XCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface APIConfigurationProps {
  className?: string;
}

export default function APIConfiguration({ className = "" }: APIConfigurationProps) {
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof API_TEMPLATES[0] | null>(null);
  const [editingConfig, setEditingConfig] = useState<APIConfig | null>(null);
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Map<string, { success: boolean; message: string }>>(new Map());

  const loadConfigs = useCallback(() => {
    const allConfigs = apiConfigManager.getAllConfigs();
    setConfigs(allConfigs);
  }, []);

  // Load configurations on mount
  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleAddConfig = (template: typeof API_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setShowAddModal(true);
  };

  const handleSaveConfig = (configData: Omit<APIConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingConfig) {
      apiConfigManager.updateConfig(editingConfig.id, configData);
    } else {
      apiConfigManager.setConfig(configData);
    }
    loadConfigs();
    setShowAddModal(false);
    setEditingConfig(null);
    setSelectedTemplate(null);
  };

  const handleDeleteConfig = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      apiConfigManager.removeConfig(id);
      loadConfigs();
    }
  };

  const handleToggleStatus = (config: APIConfig) => {
    const newStatus = config.status === 'active' ? 'inactive' : 'active';
    apiConfigManager.updateConfig(config.id, { status: newStatus });
    loadConfigs();
  };

  const handleTestConfig = async (config: APIConfig) => {
    const result = await apiConfigManager.testConfig(config.id);
    setTestResults(prev => new Map(prev).set(config.id, result));
  };

  const toggleSecretVisibility = (configId: string) => {
    setShowSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(configId)) {
        newSet.delete(configId);
      } else {
        newSet.add(configId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportConfigs = () => {
    const data = apiConfigManager.exportConfigs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-configs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const result = apiConfigManager.importConfigs(data);
        if (result.success) {
          loadConfigs();
          alert(`Successfully imported ${result.imported} configurations`);
        } else {
          alert(`Import failed: ${result.message}`);
        }
      } catch (error) {
        alert(`Import failed: ${error}`);
      }
    };
    reader.readAsText(file);
  };

  const maskSecret = (value: string): string => {
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.slice(0, 4) + '*'.repeat(value.length - 8) + value.slice(-4);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Configuration</h2>
          <p className="text-gray-600 mt-1">
            Manage integrations with tracking and analytics services
          </p>
        </div>
        
        <div className="flex space-x-3">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importConfigs}
              className="hidden"
            />
          </label>
          
          <button
            onClick={exportConfigs}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Available Templates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {API_TEMPLATES.map((template, index) => {
            const isConfigured = configs.some(c => c.name === template.name);
            
            return (
              <div
                key={index}
                className={`p-4 border-2 rounded-xl transition-all ${
                  isConfigured 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.type === 'analytics' ? 'bg-blue-100 text-blue-700' :
                    template.type === 'social' ? 'bg-purple-100 text-purple-700' :
                    template.type === 'payment' ? 'bg-green-100 text-green-700' :
                    template.type === 'email' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {template.type}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{template.metadata.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isConfigured && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {template.metadata.documentation && (
                      <a
                        href={template.metadata.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddConfig(template)}
                    disabled={isConfigured}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      isConfigured
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isConfigured ? 'Configured' : 'Add'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configured APIs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configured APIs ({configs.length})
        </h3>
        
        {configs.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No API configurations yet. Add one from the available integrations above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => {
              const testResult = testResults.get(config.id);
              
              return (
                <div
                  key={config.id}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    config.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{config.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        config.status === 'active' ? 'bg-green-100 text-green-700' :
                        config.status === 'testing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {config.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestConfig(config)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Test Configuration"
                      >
                        <TestTube className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(config)}
                        className={`p-1 rounded ${
                          config.status === 'active' 
                            ? 'text-red-600 hover:bg-red-100' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={config.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {config.status === 'active' ? 
                          <XCircle className="w-4 h-4" /> : 
                          <CheckCircle className="w-4 h-4" />
                        }
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingConfig(config);
                          setShowAddModal(true);
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit Configuration"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteConfig(config.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Configuration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{config.metadata.description}</p>
                  
                  {/* Configuration Details */}
                  <div className="space-y-2">
                    {Object.entries(config.config).map(([key, value]) => {
                      if (!value) return null;
                      const isSecret = key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('id');
                      const shouldHide = isSecret && !showSecrets.has(config.id);
                      
                      return (
                        <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center space-x-2">
                            {isSecret && <Key className="w-3 h-3 text-gray-400" />}
                            <span className="text-sm font-medium text-gray-700">{key}:</span>
                            <span className="text-sm text-gray-600 font-mono">
                              {shouldHide ? maskSecret(String(value)) : String(value)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {isSecret && (
                              <button
                                onClick={() => toggleSecretVisibility(config.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title={shouldHide ? 'Show' : 'Hide'}
                              >
                                {shouldHide ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                            )}
                            
                            <button
                              onClick={() => copyToClipboard(String(value))}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Test Results */}
                  {testResult && (
                    <div className={`mt-3 p-2 rounded-lg text-sm ${
                      testResult.success 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      <strong>Test Result:</strong> {testResult.message}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(config.createdAt).toLocaleDateString()} • 
                    Updated: {new Date(config.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ConfigModal
          template={selectedTemplate}
          editingConfig={editingConfig}
          onSave={handleSaveConfig}
          onClose={() => {
            setShowAddModal(false);
            setSelectedTemplate(null);
            setEditingConfig(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component for Adding/Editing Configurations
function ConfigModal({
  template,
  editingConfig,
  onSave,
  onClose
}: {
  template: typeof API_TEMPLATES[0] | null;
  editingConfig: APIConfig | null;
  onSave: (config: Omit<APIConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    type: APIConfig['type'];
    status: APIConfig['status'];
    config: Record<string, string>;
    metadata: APIConfig['metadata'];
  }>({
    name: editingConfig?.name || template?.name || '',
    type: editingConfig?.type || template?.type || 'analytics',
    status: editingConfig?.status || 'inactive',
    config: Object.fromEntries(
      Object.entries(editingConfig?.config || {}).map(([k, v]) => [k, String(v || '')])
    ),
    metadata: editingConfig?.metadata || template?.metadata || {
      description: '',
      requiredFields: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateConfig = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {editingConfig ? 'Edit' : 'Add'} {formData.name}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as APIConfig['status'] }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="inactive">Inactive</option>
              <option value="testing">Testing</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* Dynamic Configuration Fields */}
          {formData.metadata.requiredFields.map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field} *
              </label>
              <input
                type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('key') ? 'password' : 'text'}
                value={formData.config[field] || ''}
                onChange={(e) => updateConfig(field, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder={`Enter ${field}`}
                required
              />
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}