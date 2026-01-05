
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { UserIcon } from './Icons';

interface DetailViewProps {
  item: NewsItem;
  onUpdate: (updated: NewsItem) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ item, onUpdate }) => {
  // Combine intro and story for a single editor view
  const initialContent = item.intro 
    ? `${item.intro}\n\n${item.story}`.trim()
    : item.story;

  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    const newContent = item.intro 
      ? `${item.intro}\n\n${item.story}`.trim()
      : item.story;
    setContent(newContent);
  }, [item.id, item.intro, item.story]);

  // Auto-update parent state when content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    
    // We update the parent. For simplicity after "joining", 
    // we put everything into the story field and clear the intro.
    onUpdate({ 
      ...item, 
      intro: '', 
      story: newText 
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Detail Header - Simplified: Removed AI and Save buttons */}
      <div className="bg-white dark:bg-slate-900 px-8 py-6 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between z-10 shrink-0">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">{item.headline}</h2>
          <div className="flex items-center gap-4">
            {item.subheadline && (
              <p className="text-slate-500 dark:text-slate-400 text-sm italic border-r border-slate-200 dark:border-slate-800 pr-4">
                {item.subheadline}
              </p>
            )}
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              <UserIcon className="w-4 h-4" />
              <span>{item.byline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetaCard label="Language" value={item.metadata.language} />
          <MetaCard label="Media" value={item.metadata.mediaType} />
          <MetaCard label="Source" value={`${item.metadata.source.name} (${item.metadata.source.country})`} />
          <MetaCard label="Date" value={item.metadata.docDate} />
          <MetaCard label="Page(s)" value={item.metadata.physicalPosition} />
          <MetaCard label="Section" value={item.metadata.logicalPosition.value} />
        </div>

        {/* Unified Content Editor */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
            Article Content
            <span className="lowercase font-normal">Editing live</span>
          </label>
          <div className="relative group">
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full min-h-[650px] p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-400 dark:focus:border-indigo-600 outline-none transition-all text-slate-700 dark:text-slate-200 leading-relaxed font-serif text-lg resize-none"
              spellCheck="true"
              placeholder="Article content..."
            />
            <div className="absolute bottom-4 right-6 text-[10px] text-slate-300 dark:text-slate-600 font-mono">
              {content.length} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate" title={value}>{value || 'N/A'}</p>
  </div>
);

export default DetailView;
