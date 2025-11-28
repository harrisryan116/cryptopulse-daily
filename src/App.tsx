import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SkeletonCard from './components/SkeletonCard';

import { fetchCryptoNews } from './services/newsService';   // ✅ FIXED IMPORT

import { NewsItem } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCryptoNews();
      setNews(data.items);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Unable to fetch the latest crypto news.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] text-slate-200">
      <Header onRefresh={loadNews} isLoading={loading} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Market moving news,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              simplified.
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            AI-style summaries using 100% free open-source tools. No API keys required.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center max-w-md mx-auto mb-8">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-rose-400 font-medium mb-1">Failed to Load News</h3>
            <p className="text-rose-300/80 text-sm mb-4">{error}</p>
            <button
              onClick={loadNews}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : news.length > 0 ? (
            news.map((item, index) => (
              <NewsCard key={item.id} item={item} delay={index * 100} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p>No news found. Try later.</p>
            </div>
          )}
        </div>

        {!loading && !error && news.length > 0 && (
          <div className="mt-16 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm">
              Powered by Free Crypto News API • Open-Source Summaries
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
