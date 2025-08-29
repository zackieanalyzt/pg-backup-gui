// src/renderer/pages/BackupProcess.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

interface BackupProcessProps {
  selectedObjects: {
    tables: string[];
    views: string[];
    materializedViews: string[];
    functions: string[];
  };
  onBack: () => void;
  onComplete: () => void;
}

export const BackupProcess: React.FC<BackupProcessProps> = ({ 
  selectedObjects, 
  onBack, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Steps for the backup process
  const steps = [
    { id: 'schema', name: 'Backup Schema', description: 'Backing up database schema structure' },
    { id: 'tables', name: 'Backup Tables', description: 'Backing up selected tables data' },
    { id: 'views', name: 'Backup Views', description: 'Backing up selected views' },
    { id: 'materialized', name: 'Backup Materialized Views', description: 'Backing up materialized views' },
    { id: 'functions', name: 'Backup Functions', description: 'Backing up selected functions' },
    { id: 'compress', name: 'Compress Files', description: 'Compressing backup files' },
    { id: 'complete', name: 'Complete', description: 'Backup process completed successfully' }
  ];

  // Add log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Simulate backup process
  useEffect(() => {
    if (isCancelled || isCompleted) return;

    const runBackupProcess = async () => {
      // Add initial log
      addLog('Starting backup process...');
      
      for (let step = 0; step < steps.length - 1; step++) {
        if (isCancelled) return;
        
        setCurrentStep(step);
        addLog(`Starting: ${steps[step].name}`);
        
        // Simulate progress for each step
        for (let i = 0; i <= 100; i += 10) {
          if (isCancelled) return;
          setProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        addLog(`Completed: ${steps[step].name}`);
        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Final step
      setCurrentStep(steps.length - 1);
      addLog('Backup process completed successfully!');
      addLog(`Files created: ${Object.values(selectedObjects).flat().length} objects backed up`);
      setIsCompleted(true);
    };

    runBackupProcess();
  }, [isCancelled, isCompleted]);

  const handleCancel = () => {
    setIsCancelled(true);
    addLog('Backup process cancelled by user');
  };

  const handleComplete = () => {
    onComplete();
  };

  const getTotalObjects = () => {
    return Object.values(selectedObjects).flat().length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Backup in Progress" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Progress Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Select Objects</div>
                  </div>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200"></div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">3</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Backup Process</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="p-6">
              {/* Status Summary */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-800">Backup in Progress</h3>
                    <p className="text-sm text-blue-700">
                      Backing up {getTotalObjects()} database objects to selected destination
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Current Step */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {steps[currentStep]?.name || 'Starting...'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {steps[currentStep]?.description || 'Initializing backup process...'}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{progress}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* Step Progress */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-700 mb-3">Process Steps</h4>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center p-3 rounded-lg ${
                        index < currentStep 
                          ? 'bg-green-50 border border-green-200' 
                          : index === currentStep 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentStep 
                          ? 'bg-green-500' 
                          : index === currentStep 
                            ? 'bg-blue-500' 
                            : 'bg-gray-300'
                      }`}>
                        {index < currentStep ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : index === currentStep ? (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        ) : (
                          <span className="text-xs text-gray-600">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className={`font-medium ${
                          index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                        <div className={`text-sm ${
                          index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Log Viewer */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-700">Process Log</h4>
                  <button 
                    onClick={() => setLogs([])}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Log
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div key={index} className="text-green-400 mb-1">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">
                      Waiting for process to start...
                    </div>
                  )}
                  <div className="text-green-400 animate-pulse">█</div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                {!isCompleted && !isCancelled ? (
                  <>
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
                      variant="danger"
                      onClick={handleCancel}
                      className="flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Backup
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex justify-center">
                    <Button
                      onClick={handleComplete}
                      className="flex items-center"
                    >
                      {isCancelled ? 'Return to Setup' : 'View Backup Files'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};