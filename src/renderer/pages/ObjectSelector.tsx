// src/renderer/pages/ObjectSelector.tsx
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

interface DatabaseObject {
  id: string;
  name: string;
  type: 'table' | 'view' | 'materialized_view' | 'function';
}

interface ObjectSelectorProps {
  onBackup: (selectedObjects: {
    tables: string[];
    views: string[];
    materializedViews: string[];
    functions: string[];
  }) => void;
  onBack: () => void;
}

export const ObjectSelector: React.FC<ObjectSelectorProps> = ({ onBackup, onBack }) => {
  // Mock data - ในระบบจริงจะโหลดจาก database
  const [objects] = useState<DatabaseObject[]>([
    // Tables
    { id: '1', name: 'users', type: 'table' },
    { id: '2', name: 'products', type: 'table' },
    { id: '3', name: 'orders', type: 'table' },
    { id: '4', name: 'customers', type: 'table' },
    { id: '5', name: 'inventory', type: 'table' },
    { id: '6', name: 'categories', type: 'table' },
    
    // Views
    { id: '7', name: 'user_summary', type: 'view' },
    { id: '8', name: 'product_sales', type: 'view' },
    { id: '9', name: 'order_details', type: 'view' },
    
    // Materialized Views
    { id: '10', name: 'monthly_report', type: 'materialized_view' },
    { id: '11', name: 'yearly_summary', type: 'materialized_view' },
    
    // Functions
    { id: '12', name: 'calculate_tax', type: 'function' },
    { id: '13', name: 'generate_report', type: 'function' },
    { id: '14', name: 'update_inventory', type: 'function' },
  ]);

  const [selectedObjects, setSelectedObjects] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'tables' | 'views' | 'materialized_views' | 'functions'>('tables');

  // Filter objects by type
  const tables = objects.filter(obj => obj.type === 'table');
  const views = objects.filter(obj => obj.type === 'view');
  const materializedViews = objects.filter(obj => obj.type === 'materialized_view');
  const functions = objects.filter(obj => obj.type === 'function');

  // Check if all objects of a type are selected
  const areAllSelected = (objectsOfType: DatabaseObject[]) => {
    return objectsOfType.length > 0 && objectsOfType.every(obj => selectedObjects[obj.id]);
  };

  // Toggle selection for all objects of a type
  const toggleSelectAll = (objectsOfType: DatabaseObject[]) => {
    const allSelected = areAllSelected(objectsOfType);
    const newSelected = { ...selectedObjects };
    
    objectsOfType.forEach(obj => {
      newSelected[obj.id] = !allSelected;
    });
    
    setSelectedObjects(newSelected);
  };

  // Toggle selection for a single object
  const toggleSelection = (id: string) => {
    setSelectedObjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get selected objects by type
  const getSelectedByType = (type: DatabaseObject['type']) => {
    return objects
      .filter(obj => obj.type === type && selectedObjects[obj.id])
      .map(obj => obj.name);
  };

  const handleBackup = () => {
    const selected = {
      tables: getSelectedByType('table'),
      views: getSelectedByType('view'),
      materializedViews: getSelectedByType('materialized_view'),
      functions: getSelectedByType('function')
    };
    
    onBackup(selected);
  };

  // Get current objects based on active tab
  const getCurrentObjects = () => {
    switch (activeTab) {
      case 'tables': return tables;
      case 'views': return views;
      case 'materialized_views': return materializedViews;
      case 'functions': return functions;
      default: return [];
    }
  };

  const getCurrentSelectedAll = () => {
    switch (activeTab) {
      case 'tables': return areAllSelected(tables);
      case 'views': return areAllSelected(views);
      case 'materialized_views': return areAllSelected(materializedViews);
      case 'functions': return areAllSelected(functions);
      default: return false;
    }
  };

  const renderObjectGrid = (objects: DatabaseObject[]) => {
    if (objects.length === 0) {
      return (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500">No {activeTab.replace('_', ' ')} found in this database</p>
        </div>
      );
    }

    // Group objects into rows of 3 for 3-column layout
    const rows = [];
    for (let i = 0; i < objects.length; i += 3) {
      rows.push(objects.slice(i, i + 3));
    }

    return (
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {row.map(obj => (
              <div
                key={obj.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedObjects[obj.id] 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => toggleSelection(obj.id)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedObjects[obj.id] 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedObjects[obj.id] && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{obj.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{obj.type.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Fill empty columns if needed */}
            {row.length < 3 && Array(3 - row.length).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="invisible"></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Select Database Objects" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Progress Indicator */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Connection</div>
                  </div>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200"></div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">2</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Select Objects</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('tables')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'tables'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tables ({tables.length})
                </button>
                <button
                  onClick={() => setActiveTab('views')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'views'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Views ({views.length})
                </button>
                <button
                  onClick={() => setActiveTab('materialized_views')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'materialized_views'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Materialized Views ({materializedViews.length})
                </button>
                <button
                  onClick={() => setActiveTab('functions')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'functions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Functions ({functions.length})
                </button>
              </nav>
            </div>
            
            {/* Content Area */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                  {activeTab.replace('_', ' ')}
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => toggleSelectAll(getCurrentObjects())}
                  className="text-sm"
                >
                  {getCurrentSelectedAll() ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              {renderObjectGrid(getCurrentObjects())}
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  onClick={onBack}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Button>
                
                <Button
                  onClick={handleBackup}
                  className="flex items-center"
                >
                  Start Backup
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};