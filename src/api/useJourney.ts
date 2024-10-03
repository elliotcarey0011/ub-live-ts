import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { Journey } from '../types';

export function useJourney(
  firstStop: string,
  lastStop: string
): UseQueryResult<Journey> {
  const getJourneyFn = async (): Promise<Journey> => {
    try {
      const isTesting = import.meta.env.VITE_ENV_MODE === 'test';

      const initialUrl = isTesting
        ? `journeys/1`
        : `journeys?from=${firstStop}&to=${lastStop}&suburban=false&tram=false&bus=false&ferry=false&express=false&regional=false&results=12&stopovers=true`;
      const initialResponse = await apiClient.get<Journey>(initialUrl);
      const initialData = initialResponse.data;

      const lastRef = initialData.earlierRef;

      if (!lastRef) {
        return initialData;
      }

      const encodedLastRef = encodeURIComponent(lastRef);

      const secondUrl = isTesting
        ? `journeys/1`
        : `journeys?earlierThan=${encodedLastRef}&from=${firstStop}&to=${lastStop}&suburban=false&tram=false&bus=false&ferry=false&express=false&regional=false&results=12&stopovers=true`;

      const secondResponse = await apiClient.get<Journey>(secondUrl);
      return secondResponse.data;
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
