import { renderHook, waitFor } from '@testing-library/react';
import { useLine } from './useLine';
import { apiClient } from './apiClient';
import { describe, it, expect, vi } from 'vitest';
import { createWrapper } from '../utils/createWrapper';
import { mockLineData } from '../utils/mockData';

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('useLine hook', () => {
  it('fetches line data successfully', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockLineData,
    });

    const { result } = renderHook(() => useLine(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockLineData);
  });

  it('handles API errors', async () => {
    const error = new Error('Failed to fetch line data');
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLine(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 1500,
    });

    expect(result.current.error?.message).toContain(
      'Failed to fetch line data'
    );

    expect(result.current.data).toBeUndefined();
  });
});
