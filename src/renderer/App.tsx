// src/renderer/App.tsx
import React, { useState } from 'react';
import { Home } from './pages/Home';
import { ObjectSelector } from './pages/ObjectSelector';
import { BackupProcess } from './pages/BackupProcess';
import { Settings } from './pages/Settings';
import { Complete } from './pages/Complete';

// Types
interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  destination: string;
}

interface BackupResults {
  success: boolean;
  files: string[];
  errors: string[];
  duration: string;
  totalObjects: number;
}

const App: React.FC = () => {
  // State management
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'objectSelector' | 'backupProcess' | 'settings' | 'complete'
  >('home');
  
  const [connection, setConnection] = useState<DatabaseConnection>({
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    destination: ''
  });
  
  const [selectedObjects, setSelectedObjects] = useState({
    tables: [] as string[],
    views: [] as string[],
    materializedViews: [] as string[],
    functions: [] as string[]
  });
  
  const [backupResults, setBackupResults] = useState<BackupResults>({
    success: true,
    files: [
      'superset_schema_20250829_143022.sql.gz',
      'superset_tables_20250829_143022.sql.gz',
      'superset_views_20250829_143022.sql.gz'
    ],
    errors: [],
    duration: '2m 35s',
    totalObjects: 15
  });

  // Navigation handlers
  const handleConnect = (newConnection: DatabaseConnection) => {
    setConnection(newConnection);
    setCurrentScreen('objectSelector');
  };

  const handleObjectSelection = (objects: typeof selectedObjects) => {
    setSelectedObjects(objects);
    setCurrentScreen('backupProcess');
  };

  const handleBackupComplete = () => {
    setCurrentScreen('complete');
  };

  const handleNewBackup = () => {
    setCurrentScreen('home');
    // Reset states if needed
  };

  const handleViewFiles = () => {
    // In real implementation, this would open the folder
    alert('In the full application, this will open the backup folder');
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onConnect={handleConnect} />;
      
      case 'objectSelector':
        return (
          <ObjectSelector 
            onBackup={handleObjectSelection}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'backupProcess':
        return (
          <BackupProcess 
            selectedObjects={selectedObjects}
            onBack={() => setCurrentScreen('objectSelector')}
            onComplete={handleBackupComplete}
          />
        );
      
      case 'settings':
        return <Settings onBack={() => setCurrentScreen('home')} />;
      
      case 'complete':
        return (
          <Complete 
            backupResults={backupResults}
            onNewBackup={handleNewBackup}
            onViewFiles={handleViewFiles}
          />
        );
      
      default:
        return <Home onConnect={handleConnect} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
};

export default App;