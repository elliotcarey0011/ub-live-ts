import { describe, it, expect } from 'vitest';
import { render, waitFor, prettyDOM } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Line } from '../Line/Line';
import { uEightNaturalPath } from '../../utils/paths';
import { uEightStops } from '../../utils/stops';

describe('Train Tests', () => {
  it('should render the trains', async () => {
    const queryClient = new QueryClient();

    const renderer = render(
      <QueryClientProvider client={queryClient}>
        <Line
          path={uEightNaturalPath}
          stops={uEightStops}
          id={'u8'}
          color={'#0065ad'}
        />
      </QueryClientProvider>
    );

    await waitFor(
      async () => {
        const train = renderer.container.querySelector('#train_3102024_u8');
        expect(train).toBeInTheDocument();
        console.log(prettyDOM(renderer.container));
      },
      { timeout: 200 }
    );
  });
});
