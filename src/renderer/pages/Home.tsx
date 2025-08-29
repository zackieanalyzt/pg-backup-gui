// src/renderer/pages/Home.tsx
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  destination: string;
}

interface TestConnectionResult {
  success: boolean;
  message: string;
}

interface HomeProps {
  onConnect: (connection: DatabaseConnection) => void;
}

export const Home: React.FC<HomeProps> = ({ onConnect }) => {
  const [connection, setConnection] = useState<DatabaseConnection>({
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    destination: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);

  const handleChange = (field: keyof DatabaseConnection, value: string | number) => {
    setConnection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnect = async () => {
    if (!connection.host || !connection.database || !connection.username) {
      setError('Please fill in all required fields');
      return;
    }

    if (!connection.destination) {
      setError('Please select destination folder');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // In real implementation, this would test the actual database connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would test the actual database connection
      // For now, we'll simulate a successful connection
      console.log('Connection test successful');
      onConnect(connection);
    } catch (err) {
      setError('Failed to connect to database. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!connection.host || !connection.database || !connection.username) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTestResult(null);
    setError(null);
    
    try {
      // Use IPC to communicate with main process
      const result = await window.api.testConnection(connection);
      setTestResult(result);
      
      if (result.success) {
        // Show success message
        alert('Connection test successful!');
      } else {
        // Show error message
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to test connection');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowse = () => {
    // In Electron, this would open a dialog
    // For now, we'll just show an alert
    alert('In the full application, this will open a folder selection dialog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="PostgreSQL Backup Tool" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Database Backup</h1>
              <p className="text-gray-600">Connect to your PostgreSQL database and select objects to backup</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {testResult && (
              <div className={`mb-6 p-4 rounded-lg ${
                testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {testResult.success ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                    {testResult.message}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connection Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Host *</label>
                    <input
                      type="text"
                      value={connection.host}
                      onChange={(e) => handleChange('host', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="localhost"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port *</label>
                    <input
                      type="number"
                      value={connection.port}
                      onChange={(e) => handleChange('port', parseInt(e.target.value) || 5432)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="5432"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Name *</label>
                  <input
                    type="text"
                    value={connection.database}
                    onChange={(e) => handleChange('database', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="my_database"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input
                      type="text"
                      value={connection.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="postgres"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={connection.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Backup Settings
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Folder *</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={connection.destination}
                      onChange={(e) => handleChange('destination', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="C:\backups\my_database"
                    />
                    <button
                      onClick={handleBrowse}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-r-lg transition"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleConnect}
                  loading={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Connect & Load Objects
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleTestConnection}
                  loading={loading}
                  className="flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>PostgreSQL Backup Tool v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};