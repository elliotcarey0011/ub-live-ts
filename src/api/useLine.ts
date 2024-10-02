import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from './apiClient';

type LineData = {
    type: string;
    id: string;
    name: string;
    operator: string;
    mode: string;
    product: string;
};

export function useLine(): UseQueryResult<LineData> {

    const getLineFn = async (): Promise<LineData> => {
        try {
            const response = await apiClient.get<LineData>(`lines/17514_400`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch line data');
        }
    };

    return useQuery<LineData>({
        queryKey: ['line'],
        queryFn: getLineFn,
        retry: 1,
    });
}
