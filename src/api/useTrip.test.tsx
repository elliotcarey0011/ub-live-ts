import { renderHook, waitFor } from '@testing-library/react';
import { useTrip } from './useTrip';
import { apiClient } from './apiClient';
import { describe, it, expect, vi } from 'vitest';
import { createWrapper } from '../utils/createWrapper';
import { mockTripData } from '../utils/mockData';

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('useTrip hook', () => {
  it('fetches trip data successfully', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockTripData,
    });

    const { result } = renderHook(() => useTrip(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTripData);
  });

  it('handles API errors', async () => {
    const error = new Error('Failed to fetch trip data');
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTrip(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 1500,
    });

    expect(result.current.error?.message).toContain(
      'Failed to fetch trip data'
    );

    expect(result.current.data).toBeUndefined();
  });
});
