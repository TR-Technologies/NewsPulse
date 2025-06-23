import axios from 'axios';

const API_KEY = 'd69d40a635a5437abd0aadbbba7e6447';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const countryMapping: { [key: string]: string } = {
  'Bangladesh': 'bd',
  'India': 'in',
  'United States': 'us',
  'United Kingdom': 'gb',
  'World': '',
  'International': '',
  'All': ''
};

export const fetchNews = async (region: string, pageSize: number = 20) => {
  const countryCode = countryMapping[region] ?? '';
  const url = `${BASE_URL}?apiKey=${API_KEY}${countryCode ? `&country=${countryCode}` : ''}&pageSize=${pageSize}`;

  try {
    const response = await axios.get(url);
    return response.data.articles.map((article: any, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      author: article.author || 'Unknown',
      publishedAt: article.publishedAt,
      source: article.source.name,
      imageUrl: article.urlToImage,
      url: article.url,
      category: region,
      readTime: `${Math.floor(Math.random() * 6) + 1} min read`,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
};

export const searchNews = async (query: string, pageSize: number = 20) => {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.articles.map((article: any, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      author: article.author || 'Unknown',
      publishedAt: article.publishedAt,
      source: article.source.name,
      imageUrl: article.urlToImage,
      url: article.url,
      category: 'Search',
      readTime: `${Math.floor(Math.random() * 6) + 1} min read`,
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    throw new Error('Failed to search news');
  }
};
