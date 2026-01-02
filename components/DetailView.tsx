
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { SparklesIcon, CheckCircleIcon } from './Icons';
import { getAISummary } from '../services/geminiService';

interface DetailViewProps {
  item: NewsItem;
  onUpdate: (updated: NewsItem) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ item, onUpdate }) => {
  const [localStory, setLocalStory] = useState(item.story);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalStory(item.story);
    setIsSaved(false);
  }, [item.id, item.story]);

  const handleSave = () => {
    onUpdate({ ...item, story: localStory });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSummarize = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    const summary = await getAISummary(item.headline, localStory);
    onUpdate({ ...item, story: localStory, aiSummary: summary });
    setIsSummarizing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Detail Header */}
      <div className="bg-white dark:bg-slate-900 px-8 py-6 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{item.headline}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2 italic">
            {item.subheadline || 'No subheadline available'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <SparklesIcon className={`w-4 h-4 ${isSummarizing ? 'animate-pulse' : ''}`} />
            {isSummarizing ? 'Analyzing...' : 'AI Summary'}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              isSaved 
              ? 'bg-emerald-500 dark:bg-emerald-600 text-white' 
              : 'bg-slate-900 dark:bg-indigo-500 text-white hover:bg-slate-800 dark:hover:bg-indigo-400 hover:shadow-md'
            }`}
          >
            {isSaved ? <CheckCircleIcon className="w-4 h-4" /> : null}
            {isSaved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetaCard label="Language" value={item.metadata.language} />
          <MetaCard label="Media Type" value={item.metadata.mediaType} />
          <MetaCard label="Source" value={`${item.metadata.source.name} (${item.metadata.source.country})`} />
          <MetaCard label="Doc Date" value={item.metadata.docDate} />
          <MetaCard label="Logical Pos" value={`${item.metadata.logicalPosition.value} (${item.metadata.logicalPosition.type})`} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Story Editor */}
          <div className="flex-1 space-y-3">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
              Content Editor
              <span className="lowercase font-normal">Standard Editorial View</span>
            </label>
            <div className="relative group">
              <textarea
                value={localStory}
                onChange={(e) => setLocalStory(e.target.value)}
                className="w-full min-h-[500px] p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 focus:border-indigo-400 dark:focus:border-indigo-600 outline-none transition-all text-slate-700 dark:text-slate-200 leading-relaxed font-serif text-lg resize-none"
                spellCheck="true"
              />
              <div className="absolute bottom-4 right-6 text-[10px] text-slate-300 dark:text-slate-600 font-mono">
                {localStory.length} characters
              </div>
            </div>
          </div>

          {/* AI Panel */}
          {item.aiSummary && (
            <div className="lg:w-80 space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 shrink-0">
              <label className="text-xs font-bold text-indigo-400 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <SparklesIcon className="w-3 h-3" />
                AI Analysis
              </label>
              <div className="p-6 bg-white dark:bg-slate-900 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-xl shadow-sm dark:shadow-indigo-900/10 space-y-4">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{item.aiSummary}"
                </p>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Generated via Gemini 3 Flash</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate" title={value}>{value}</p>
  </div>
);

export default DetailView;
