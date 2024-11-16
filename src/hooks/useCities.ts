import { useQuery } from 'react-query';
import { fetchTopCities } from '../lib/cities';

export function useCities() {
  return useQuery('cities', fetchTopCities, {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}