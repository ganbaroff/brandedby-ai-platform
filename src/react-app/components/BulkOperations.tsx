/**
 * Bulk Operations Component
 * Advanced bulk operations for admin data management
 */

import {
    AlertTriangle,
    Check,
    CheckSquare,
    Download,
    Edit,
    MoreHorizontal,
    Square,
    Trash2,
    Upload
} from "lucide-react";
import { memo, useCallback, useState } from "react";

interface BulkOperationsProps<T> {
  items: T[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  onBulkDelete?: (items: T[]) => void;
  onBulkEdit?: (items: T[]) => void;
  onExport?: (items: T[]) => void;
  onImport?: (data: T[]) => void;
  getItemId: (item: T) => string | number;
  getItemTitle: (item: T) => string;
  customActions?: {
    label: string;
    icon: React.ReactNode;
    onClick: (items: T[]) => void;
    variant?: 'default' | 'danger' | 'success';
  }[];
  className?: string;
}

const BulkOperations = memo(function BulkOperations<T>({
  items,
  selectedItems,
  onSelectionChange,
  onBulkDelete,
  onBulkEdit,
  onExport,
  onImport,
  getItemId,
  getItemTitle,
  customActions = [],
  className = ""
}: BulkOperationsProps<T>) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'edit' | 'custom'>('delete');

  // Select/deselect all
  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items);
    }
  }, [items, selectedItems, onSelectionChange]);

  // Toggle single item selection
  const toggleItemSelection = useCallback((item: T) => {
    const itemId = getItemId(item);
    const isSelected = selectedItems.some(selected => getItemId(selected) === itemId);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => getItemId(selected) !== itemId));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  }, [selectedItems, onSelectionChange, getItemId]);

  // Confirm action
  const confirmAction = useCallback((action: () => void, type: 'delete' | 'edit' | 'custom' = 'delete') => {
    setPendingAction(() => action);
    setActionType(type);
    setShowConfirmDialog(true);
  }, []);

  // Execute confirmed action
  const executeAction = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  }, [pendingAction]);

  // Handle file import
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImport(data);
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    event.target.value = '';
  }, [onImport]);

  const isAllSelected = selectedItems.length === items.length && items.length > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < items.length;
  const hasSelection = selectedItems.length > 0;

  return (
    <div className={className}>
      {/* Bulk Operations Bar */}
      {hasSelection && (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-6 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-primary-700 font-medium">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              
              <button
                onClick={() => onSelectionChange([])}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear selection
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Bulk Edit */}
              {onBulkEdit && (
                <button
                  onClick={() => confirmAction(() => onBulkEdit(selectedItems), 'edit')}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              
              {/* Export */}
              {onExport && (
                <button
                  onClick={() => onExport(selectedItems)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              )}
              
              {/* Custom Actions */}
              {customActions.map((action, index) => {
                const variantClasses = {
                  default: 'bg-neutral-600 hover:bg-neutral-700',
                  danger: 'bg-red-600 hover:bg-red-700',
                  success: 'bg-green-600 hover:bg-green-700'
                };
                
                return (
                  <button
                    key={index}
                    onClick={() => confirmAction(() => action.onClick(selectedItems), 'custom')}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-colors ${
                      variantClasses[action.variant || 'default']
                    }`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                );
              })}
              
              {/* Bulk Delete */}
              {onBulkDelete && (
                <button
                  onClick={() => confirmAction(() => onBulkDelete(selectedItems), 'delete')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Select All Checkbox */}
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            {isAllSelected ? (
              <CheckSquare className="w-5 h-5 text-primary-600" />
            ) : isPartiallySelected ? (
              <div className="w-5 h-5 border-2 border-primary-600 rounded bg-primary-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isAllSelected ? 'Deselect All' : 'Select All'} ({items.length})
            </span>
          </button>
        </div>

        {/* Import/Export */}
        <div className="flex items-center gap-2">
          {onImport && (
            <label className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          )}
          
          {onExport && (
            <button
              onClick={() => onExport(items)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          )}
        </div>
      </div>

      {/* Item Selection List */}
      <div className="space-y-2">
        {items.map((item) => {
          const itemId = getItemId(item);
          const isSelected = selectedItems.some(selected => getItemId(selected) === itemId);
          
          return (
            <div
              key={itemId}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-primary-50 border-primary-200' 
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <button
                onClick={() => toggleItemSelection(item)}
                className="flex-shrink-0"
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-primary-600" />
                ) : (
                  <Square className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                )}
              </button>
              
              <div className="flex-1">
                <span className="font-medium text-neutral-900">
                  {getItemTitle(item)}
                </span>
              </div>
              
              <button className="flex-shrink-0 p-1 text-neutral-400 hover:text-neutral-600 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                actionType === 'delete' ? 'bg-red-100' : 'bg-primary-100'
              }`}>
                {actionType === 'delete' ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <Check className="w-6 h-6 text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {actionType === 'delete' ? 'Confirm Deletion' : 'Confirm Action'}
                </h3>
                <p className="text-neutral-600">
                  Are you sure you want to {actionType} {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}?
                </p>
              </div>
            </div>
            
            {actionType === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Warning:</strong> This action cannot be undone. The selected items will be permanently deleted.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={executeAction}
                className={`flex-1 py-3 font-semibold rounded-xl transition-colors ${
                  actionType === 'delete'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {actionType === 'delete' ? 'Delete' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default BulkOperations;
export type { BulkOperationsProps };
