import axios from 'axios';
import { WikipediaResponse } from '../types';

export async function getWikipediaInfo(city: string): Promise<WikipediaResponse | null> {
  const endpoint = 'https://tr.wikipedia.org/api/rest_v1/page/summary/';
  
  try {
    const response = await axios.get(`${endpoint}${encodeURIComponent(city)}`);
    return {
      extract: response.data.extract,
      thumbnail: response.data.thumbnail?.source,
      url: response.data.content_urls?.desktop?.page
    };
  } catch (error) {
    console.error('Wikipedia API hatası:', error);
    return null;
  }
}