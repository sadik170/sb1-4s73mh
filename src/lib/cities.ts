import axios from 'axios';
import { City } from '../types';

const CITIES_API_URL = 'https://api.api-ninjas.com/v1/city';
const POPULATION_THRESHOLD = 1000000; // 1 million+ population cities

export async function fetchTopCities(): Promise<City[]> {
  try {
    const response = await axios.get(CITIES_API_URL, {
      params: {
        min_population: POPULATION_THRESHOLD,
        limit: 30 // Fetch in batches
      },
      headers: {
        'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY
      }
    });

    return response.data.map((city: any) => ({
      name: city.name,
      country: city.country,
      population: city.population,
      latitude: city.latitude,
      longitude: city.longitude
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Şehir bilgileri alınamadı');
  }
}