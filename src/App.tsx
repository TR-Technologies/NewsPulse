import { useState, useEffect } from 'react'; import { Clock, User, Menu, X, AlertCircle, ExternalLink } from 'lucide-react'; import { fetchNews, searchNews } from './services/newsApi'; import { NewsArticle } from './types/news'; import SearchBar from './components/SearchBar'; import ErrorBoundary from './components/ErrorBoundary';

const categories = ["All", "Bangladesh", "World", "International", "Politics", "Technology", "Sports", "Entertainment", "Health", "Education", "Business"];

function App() { const [news, setNews] = useState<NewsArticle[]>([]); const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]); const [selectedCategory, setSelectedCategory] = useState("All"); const [isLoading, setIsLoading] = useState(true); const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); const [error, setError] = useState<string | null>(null); const [searchQuery, setSearchQuery] = useState(''); const [isSearching, setIsSearching] = useState(false);

const loadNews = async (category: string) => { setIsLoading(true); setError(null);

try {
  const articles = await fetchNews(category, 20);
  setNews(articles);
  setFilteredNews(articles);
} catch (err) {
  console.error('Failed to load news:', err);
  setError('Failed to load news. Please check your internet connection and try again.');
  setNews([]);
  setFilteredNews([]);
} finally {
  setIsLoading(false);
}

};

const handleSearch = async (query: string) => { setIsSearching(true); setError(null); setSearchQuery(query);

try {
  const articles = await searchNews(query, 20);
  setFilteredNews(articles);
  setSelectedCategory('Search Results');
} catch (err) {
  console.error('Failed to search news:', err);
  setError('Failed to search news. Please try again.');
} finally {
  setIsSearching(false);
}

};

const handleClearSearch = () => { setSearchQuery(''); setFilteredNews(news); setSelectedCategory('All'); };

useEffect(() => { loadNews('All'); }, []);

const handleCategoryClick = (category: string) => { if (category === selectedCategory) return;

setSelectedCategory(category);
setSearchQuery('');
setIsMobileMenuOpen(false);

if (category === 'All') {
  loadNews('All');
} else {
  loadNews(category);
}

};

const formatDate = (dateString: string) => { const date = new Date(dateString); const now = new Date(); const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

if (diffInHours < 1) {
  return 'Just now';
} else if (diffInHours < 24) {
  return `${diffInHours}h ago`;
} else if (diffInHours < 48) {
  return 'Yesterday';
} else {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

};

const handleArticleClick = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };

if (isLoading) { return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <div className="text-center"> <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div> <p className="text-gray-600 text-lg">Loading latest news...</p> </div> </div> ); }

return ( <ErrorBoundary> <div className="min-h-screen bg-gray-50"> {/* Header */} <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="flex items-center justify-between h-16"> <div className="flex items-center space-x-2"> <span className="text-2xl">📰</span> <div> <h1 className="text-2xl font-bold text-red-600">NewsPulse</h1> <p className="text-xs text-gray-500 hidden sm:block">Your pulse on the latest headlines</p> </div> </div>

<nav className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar 
        onSearch={handleSearch}
        isSearching={isSearching}
        onClear={handleClearSearch}
        searchQuery={searchQuery}
      />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedCategory === "All" ? "Latest News" : `${selectedCategory} News`}
        </h2>
        <p className="text-gray-600">
          {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => loadNews(selectedCategory)}
              className="text-red-600 hover:text-red-700 font-medium text-sm mt-1"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer"
              onClick={() => handleArticleClick(article.url)}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User size={14} />
                    <span className="truncate max-w-24">{article.author}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="inline-flex items-center text-red-600 font-medium text-sm hover:text-red-700 transition-colors">
                    Read More
                    <ExternalLink size={14} className="ml-1" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Source: {article.source}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !isLoading && !error ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No news found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Try searching with different keywords.' : 'Try selecting a different category or check back later.'}
          </p>
          <button
            onClick={() => searchQuery ? handleClearSearch() : handleCategoryClick("All")}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {searchQuery ? 'Clear Search' : 'View All News'}
          </button>
        </div>
      ) : null}
    </main>

    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">📰</span>
            <span className="text-xl font-bold text-red-600">NewsPulse</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Your pulse on the latest headlines from Bangladesh and around the world
          </p>
          <p className="text-gray-500 text-sm mb-2">
            © 2025 NewsPulse. Made with ❤️ by Tanvir Rahman
          </p>
          <p className="text-gray-400 text-xs">
            Powered by NewsAPI.org
          </p>
        </div>
      </div>
    </footer>
  </div>
</ErrorBoundary>

); }

export default App;