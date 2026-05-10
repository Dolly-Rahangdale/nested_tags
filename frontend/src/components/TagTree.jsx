'use client';

import { useState, useEffect } from 'react';
import TagView from './TagView';
import { treeApi } from '@/services/api';
import { SaveIcon, PlusIcon, CodeIcon, XIcon, CheckCircleIcon } from './Icons';
import Toast from './Toast';
import useToast from '@/utils/useToast';

const defaultTree = {
  name: 'My Tree',
  children: [
    {
      name: 'Documents',
      children: [
        { name: 'Resume.pdf', data: "Version 2.3 - Last updated Dec 2025" },
        { name: 'CoverLetter.docx', data: "Customizable template for job applications" }
      ]
    },
    {
      name: 'Projects', 
      data: "Active Projects Dashboard",
      children: [
        { name: 'Frontend', data: "React + Tailwind CSS" },
        { name: 'Backend', data: "Node.js + Express API" }
      ]
    },
    {
      name: 'Archive',
      data: "Completed items from 2024"
    }
  ]
};

const TagTree = () => {
  const [trees, setTrees] = useState([]);
  const [currentTree, setCurrentTree] = useState(null);
  const [currentTreeId, setCurrentTreeId] = useState(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    loadTrees();
  }, []);

  const loadTrees = async () => {
    try {
      const response = await treeApi.getAllTrees();
      setTrees(response.data);
      if (response.data.length > 0 && !currentTreeId) {
        setCurrentTree(response.data[0].data);
        setCurrentTreeId(response.data[0].id);
      } else if (response.data.length === 0 && !currentTree) {
        setCurrentTree(defaultTree);
      }
    } catch (error) {
      console.error('Error loading trees:', error);
      setCurrentTree(defaultTree);
    }
  };

  const exportTree = async () => {
    const formattedJson = JSON.stringify(currentTree, null, 2);
    setJsonData(formattedJson);
    setShowJsonModal(true);
    
    setIsLoading(true);
    setSaveStatus(null);
    
    try {
      if (currentTreeId) {
        await treeApi.updateTree(currentTreeId, {
          name: currentTree.name,
          data: currentTree
        });
        setSaveStatus({ success: true, message: 'Tree updated successfully!' });
        toast({ message: 'Tree updated successfully!', type: 'success' });
      } else {
        const response = await treeApi.createTree({
          name: currentTree.name,
          data: currentTree
        });
        setCurrentTreeId(response.data.id);
        setSaveStatus({ success: true, message: 'Tree saved successfully!' });
        toast({ message: 'Tree saved successfully!', type: 'success' });
      }
      await loadTrees();
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving tree:', error);
      setSaveStatus({ success: false, message: 'Error saving tree. Please try again.' });
      toast({ message: 'Error saving tree. Please try again.', type: 'error' });
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTree = (tree) => {
    setCurrentTree(tree.data);
    setCurrentTreeId(tree.id);
    toast({ message: `Loaded "${tree.name}"`, type: 'info' });
  };

  const newTree = () => {
    setCurrentTree(JSON.parse(JSON.stringify(defaultTree)));
    setCurrentTreeId(null);
    toast({ message: 'Created new tree', type: 'info' });
  };

  const updateTree = (updatedTree) => {
    setCurrentTree(updatedTree);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTree?.name || 'tree'}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ message: 'JSON file downloaded!', type: 'success' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
    toast({ message: 'JSON copied to clipboard!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section with Buttons */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent pb-1">
                  Tag Tree Manager
                </h1>
                <p className="text-slate-500 text-sm hidden md:block">
                  Create, organize, and export nested data structures
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={newTree}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <PlusIcon className="w-4 h-4" />
                New Tree
              </button>
              <button
                onClick={exportTree}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )}
                Export & Save
              </button>
            </div>
          </div>
          {/* Mobile description */}
          <p className="text-slate-500 text-sm mt-3 md:hidden text-center">
            Create, organize, and export nested data structures
          </p>
        </div>

        {/* Save Status Alert */}
        {saveStatus && (
          <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl animate-fade-in ${
            saveStatus.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {saveStatus.success ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
            <span className="text-sm font-medium">{saveStatus.message}</span>
          </div>
        )}

        {/* Saved Trees Section */}
        {trees.length > 0 && (
          <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-premium border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Saved Trees
              </h2>
              <span className="text-xs text-slate-400">{trees.length} tree{trees.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {trees.map((tree) => (
                <button
                  key={tree.id}
                  onClick={() => loadTree(tree)}
                  className={`group px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    currentTreeId === tree.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{tree.name}</span>
                    <span className={`text-xs ${currentTreeId === tree.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {new Date(tree.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tree Editor Section */}
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Current Tree Editor
              </h2>
              {currentTree && currentTree.name && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                  Editing: {currentTree.name}
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {currentTree && currentTree.name ? (
              <TagView node={currentTree} onUpdate={updateTree} />
            ) : (
              <div className="text-center py-12 text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No tree selected. Create a new tree or load an existing one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON Preview Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CodeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">JSON Export Preview</h3>
                  <p className="text-sm text-slate-500">Your tree data has been saved successfully</p>
                </div>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <XIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-slate-900">
              <pre className="text-sm font-mono text-emerald-300 whitespace-pre-wrap break-words">
                {jsonData}
              </pre>
            </div>
            
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all duration-200 font-medium"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={downloadJson}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default TagTree;