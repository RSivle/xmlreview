
import React, { useState, useCallback } from 'react';
import { NewsItem, AppStatus } from './types';
import Sidebar from './components/Sidebar';
import DetailView from './components/DetailView';
import { parseXMLFile } from './services/xmlParser';
import { FileIcon, UploadIcon } from './components/Icons';

const App: React.FC = () => {
  const [files, setFiles] = useState<NewsItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    setStatus(AppStatus.LOADING);
    setErrorMsg(null);

    try {
      const results: NewsItem[] = [];
      for (const file of Array.from(uploaded) as File[]) {
        const item = await parseXMLFile(file);
        results.push(item);
      }
      
      setFiles(prev => [...prev, ...results]);
      if (results.length > 0 && !selectedId) {
        setSelectedId(results[0].id);
      }
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing files');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setSelectedId(null);
    setErrorMsg(null);
  };

  const handleUpdateItem = useCallback((updated: NewsItem) => {
    setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
  }, []);

  const selectedItem = files.find(f => f.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <Sidebar 
        files={files} 
        onSelect={(item) => setSelectedId(item.id)} 
        onUpload={handleFileUpload}
        onClear={handleClear}
        selectedId={selectedId}
      />

      <main className="flex-1 relative overflow-hidden">
        {status === AppStatus.LOADING && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">Parsing XML Content...</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 m-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
          </div>
        )}

        {selectedItem ? (
          <DetailView item={selectedItem} onUpdate={handleUpdateItem} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-indigo-100 dark:ring-indigo-800">
              <UploadIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome to Lumina</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
              Professional XML reviewer for media workflows. Upload your newsitem XML files to start reviewing and editing.
            </p>
            
            <label className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all cursor-pointer flex items-center gap-3">
              <input type="file" multiple accept=".xml" className="hidden" onChange={handleFileUpload} />
              <FileIcon className="w-5 h-5" />
              Browse XML Files
            </label>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
