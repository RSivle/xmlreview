
import React, { useState } from 'react';
import { NewsItem } from '../types';
import { FileIcon, SearchIcon, UploadIcon, TrashIcon } from './Icons';

interface SidebarProps {
  files: NewsItem[];
  onSelect: (item: NewsItem) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ files, onSelect, onUpload, onClear, selectedId }) => {
  const [search, setSearch] = useState('');

  const filteredFiles = files.filter(f => 
    f.headline.toLowerCase().includes(search.toLowerCase()) || 
    f.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="p-4 border-bottom border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 rounded-lg">
              <FileIcon className="w-5 h-5" />
            </span>
            Lumina
          </h1>
          <button 
            onClick={onClear}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Clear all files"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <label className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all hover:border-indigo-400 hover:bg-indigo-50">
          <input type="file" multiple accept=".xml" className="hidden" onChange={onUpload} />
          <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
            <UploadIcon className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Import XML Files</span>
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
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          filteredFiles.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-xl transition-all group relative ${
                selectedId === item.id 
                ? 'bg-indigo-50 ring-1 ring-indigo-200' 
                : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className={`text-sm font-semibold truncate ${selectedId === item.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {item.headline || 'Untitled Item'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="uppercase tracking-wider font-bold text-slate-300">{item.metadata.mediaType}</span>
                  <span>•</span>
                  <span>{item.metadata.docDate}</span>
                </div>
              </div>
              {selectedId === item.id && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          <span>Loaded Items</span>
          <span className="bg-white px-2 py-0.5 rounded shadow-sm text-indigo-600 ring-1 ring-slate-200">{files.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
