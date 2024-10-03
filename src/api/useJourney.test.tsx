import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJourney } from './useJourney';
import { describe, it, expect } from 'vitest';

const queryClient = new QueryClient();

describe('useJourney Hook', () => {
  it('should fetch journey data successfully', async () => {
    const firstStop = '900096101';
    const lastStop = '900079221';

    const { result } = renderHook(() => useJourney(firstStop, lastStop), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.journeys[0]).toEqual(
      expect.objectContaining({
        legs: expect.arrayContaining([
          expect.objectContaining({
            destination: expect.objectContaining({
              name: 'S+U Hermannstr. (Berlin)',
            }),
          }),
        ]),
      })
    );
  });
});
