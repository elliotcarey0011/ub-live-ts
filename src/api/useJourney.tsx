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
        const lastRef =
          '3|OB|MT#14#12767#12767#12804#12804#0#0#165#12765#1#0#10#0#0#-2147483648#1#2|PDH#86e6778d65934bdd1f881f0fd1e7ea7e|RD#3102024|RT#204528|US#1|RS#INIT';
        const encodedlast = encodeURIComponent(lastRef);
        url = `journeys?earlierThan=${encodedlast}&from=${firstStop}&to=${lastStop}&suburban=false&tram=false&bus=false&ferry=false&express=false&regional=false&results=12&stopovers=true`;
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

// https://v6.vbb.transport.rest/journeys/%C2%B6HKI%C2%B6T%24A%3D1%40O%3DS%2BU%20Wittenau%20%28Berlin%29%40L%3D900096101%40a%3D128%40%24A%3D1%40O%3DS%2BU%20Hermannstr.%20%28Berlin%29%40L%3D900079221%40a%3D128%40%24202410031917%24202410031954%24%20%20%20%20%20%20U8%24%241%24%24%24%24%24%24%C2%B6KC%C2%B6%23VE%232%23CF%23100%23CA%230%23CM%230%23SICT%230%23AM%2316481%23AM2%230%23RT%2315%23%C2%B6KCC%C2%B6I1ZFIzEjRVJHIzEjSElOIzAjRUNLIzEyNjc3fDEyNjc3fDEyNzE0fDEyNzE0fDB8MHwxNjV8MTI2NzN8MXwwfDEwfDB8MHwtMjE0NzQ4MzY0OCNHQU0jMzEwMjQxOTE3IwpaI1ZOIzEjU1QjMTcyNzczOTg0MyNQSSMwI1pJIzU3MDYwI1RBIzMjREEjMzEwMjQjMVMjOTAwMDk2MTAxIzFUIzE5MTcjTFMjOTAwMDc5MjIxI0xUIzE5NTQjUFUjODYjUlQjMSNDQSNVI1pFI1U4I1pCIyAgICAgIFU4I1BDIzEjRlIjOTAwMDk2MTAxI0ZUIzE5MTcjVE8jOTAwMDc5MjIxI1RUIzE5NTQj%C2%B6KRCC%C2%B6%23VE%231%23?stopovers=true&tickets=false&polylines=false&subStops=true&entrances=true&remarks=true&scheduledDays=false&language=en
