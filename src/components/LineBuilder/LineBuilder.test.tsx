import { describe, it, expect, vi } from 'vitest';
import { render, prettyDOM, waitFor } from '@testing-library/react';

import { Line } from '../Line/Line';
import { uEightNaturalPath } from '../../utils/paths';
import { uEightStops } from '../../utils/stops';

vi.mock('../Train/Train', () => ({
  Train: () => <div>Mocked LineBuilder</div>,
}));

describe('LineBuilder Component', () => {
  it('renders stops on line on the screen', async () => {
    const renderer = render(
      <Line
        path={uEightNaturalPath}
        stops={uEightStops}
        id={'u8'}
        color={'#0065ad'}
      />
    );

    await waitFor(() => {
      // console.log(prettyDOM(renderer.container.firstChild));
      const stopNode_1 = renderer.container.querySelector('#stop_900096101_u8');
      expect(stopNode_1).toBeInTheDocument();
      const stopNode_1_text =
        renderer.container.querySelector('#text_900096101_u8');
      expect(stopNode_1_text).toBeInTheDocument();
    });
  });
});
