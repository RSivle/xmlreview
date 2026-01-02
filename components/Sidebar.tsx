
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { FileIcon, SearchIcon, UploadIcon, TrashIcon, SunIcon, MoonIcon } from './Icons';

interface SidebarProps {
  files: NewsItem[];
  onSelect: (item: NewsItem) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ files, onSelect, onUpload, onClear, selectedId }) => {
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const filteredFiles = files.filter(f => 
    f.headline.toLowerCase().includes(search.toLowerCase()) || 
    f.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 h-full transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <FileIcon className="w-5 h-5" />
            </span>
            Lumina
          </h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClear}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear all files"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <label className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 transition-all hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
          <input type="file" multiple accept=".xml" className="hidden" onChange={onUpload} />
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
            <UploadIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-wider">Import XML Files</span>
          </div>
        </label>
      </div>

      {/* Search */}
      <div className="px-4 pb-2 pt-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter files..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all dark:text-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-600">
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          filteredFiles.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-xl transition-all group relative ${
                selectedId === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-200 dark:ring-indigo-800' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className={`text-sm font-semibold truncate ${selectedId === item.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.headline || 'Untitled Item'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="uppercase tracking-wider font-bold">{item.metadata.mediaType}</span>
                  <span>•</span>
                  <span>{item.metadata.docDate}</span>
                </div>
              </div>
              {selectedId === item.id && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
              )}
            </button>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
          <span>Loaded Items</span>
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200 dark:ring-slate-700">{files.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
