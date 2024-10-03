import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { Journey } from '../types';

export function useJourney(
  firstStop: string,
  lastStop: string
): UseQueryResult<Journey> {
  const getJourneyFn = async (): Promise<Journey> => {
    try {
      let url;
      if (import.meta.env.VITE_ENV_MODE === 'test') {
        url = `journeys/1?from=${firstStop}&to=${lastStop}&suburban=false&tram=false&bus=false&ferry=false&express=false&regional=false`;
      } else {
        url = `journeys?from=${firstStop}&to=${lastStop}&suburban=false&tram=false&bus=false&ferry=false&express=false&regional=false`;
      }
      const response = await apiClient.get<Journey>(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Journey data with error: ${error}`);
    }
  };

  return useQuery<Journey>({
    queryKey: ['Journey', firstStop, lastStop],
    queryFn: getJourneyFn,
    retry: 1,
  });
}
