import React from 'react';
import { NewsItem } from '../types';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  delay: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, delay }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Negative': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <TrendingUp className="w-4 h-4" />;
      case 'Negative': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  // Helper to find citations in text (e.g. [1]) and link them
  // This is a simplified version. For full robustness, we'd need a complex parser.
  // Here we just look for sources in the metadata that might be relevant.
  // Since Gemini Search tool returns global grounding, mapping specific sentences to specific links
  // without the detailed index data is tricky. We will list sources at the bottom if available.
  
  const sources = item.groundingMetadata?.groundingChunks || [];
  
  // Deduplicate sources by URI
  const uniqueSourcesMap = new Map<string, { uri: string; title: string }>();
  sources.forEach(chunk => {
    if (chunk.web?.uri && chunk.web?.title) {
      uniqueSourcesMap.set(chunk.web.uri, chunk.web);
    }
  });
  
  const uniqueSources = Array.from(uniqueSourcesMap.values());

  return (
    <div 
      className="glass-panel rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-fadeIn flex flex-col h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase border border-cyan-500/30 px-2 py-1 rounded bg-cyan-950/30">
          {item.tag}
        </span>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${getSentimentColor(item.sentiment)}`}>
          {getSentimentIcon(item.sentiment)}
          <span>{item.sentiment}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight">
        {item.title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
        {item.summary}
      </p>

      {uniqueSources.length > 0 && (
        <div className="mt-auto pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-widest">Sources</p>
          <div className="flex flex-wrap gap-2">
            {uniqueSources.slice(0, 3).map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 transition-colors bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-500/50"
              >
                <span className="truncate max-w-[100px]">{source.title}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;