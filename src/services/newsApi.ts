// src/services/newsApi.ts

import axios from 'axios';

// ✅ Replace this with your actual API key if needed
const API_KEY = 'd69d40a635a5437abd0aadbbba7e6447';

const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// ✅ Country shortcodes for top headlines
const countryMapping: { [key: string]: string } = {
  'Bangladesh': 'bd',
  'India': 'in',
  'United States': 'us',
  'United Kingdom': 'gb',
  'World': '',
  'International': '',
  'All': ''
};

// ✅ Get top headlines based on country/region
export const fetchNews = async (region: string, pageSize = 20) => {
  const countryCode = countryMapping[region] ?? '';
  const url = `${BASE_URL}?apiKey=${API_KEY}${countryCode ? `&country=${countryCode}` : ''}&pageSize=${pageSize}`;
  const response = await axios.get(url);
  return response.data.articles;
};

// ✅ Search news globally using query
export const searchNews = async (query: string, pageSize = 20) => {
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=${pageSize}`;
  const response = await axios.get(url);
  return response.data.articles;
};