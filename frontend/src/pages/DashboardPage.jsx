import { useState, useEffect } from 'react';
import { newsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { ExternalLink, Clock, TrendingUp, RefreshCw, Sparkles, Calendar, User } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = async (pageNum = 1, append = false) => {
    try {
      const { data } = await newsAPI.getNews(pageNum, 12);
      if (append) {
        setArticles((prev) => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      setTotalResults(data.totalResults || 0);
      setHasMore(data.articles.length === 12);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await newsAPI.getTrending();
      setTrending(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  useEffect(() => {
    fetchNews(1);
    fetchTrending();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchNews(1);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNews(nextPage, true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back, <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{user?.username}</span>
        </h1>
        <p className="text-gray-400">Here's what's happening in the world of AI today.</p>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-white">Trending Now</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.slice(0, 3).map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                      {article.source?.name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.source.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Main News Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Latest AI News</h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <article
                  key={i}
                  className="card group hover:-translate-y-1 transition-all duration-300"
                >
                  {article.urlToImage ? (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      {article.source?.name && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-gray-900/80 backdrop-blur-sm text-xs text-gray-300 rounded-md border border-gray-700/50">
                          {article.source.name}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-primary-900/40 to-accent-900/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                      {article.source?.name && (
                        <>
                          <span className="text-gray-700">•</span>
                          <span>{article.source.name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                        {article.description}
                      </p>
                    )}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium"
                    >
                      Read full article
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && articles.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="btn-secondary"
                >
                  Load More Articles
                </button>
              </div>
            )}

            {articles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No articles found. Try refreshing the page.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
