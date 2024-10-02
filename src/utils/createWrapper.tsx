// test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a utility function to wrap the hook with QueryClientProvider
export const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries to ensure error state is triggered immediately
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
