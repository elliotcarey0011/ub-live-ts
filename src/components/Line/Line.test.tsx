import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Line } from './Line';
import { uEightNaturalPath } from '../../utils/paths';
import { uEightStops } from '../../utils/stops';

// Mock the LineBuilder component if necessary
vi.mock('../LineBuilder/LineBuilder', () => ({
  LineBuilder: () => <div>Mocked LineBuilder</div>,
}));

describe('Line Component', () => {
  it('renders a line on the screen', () => {
    const { container } = render(
      <Line
        path={uEightNaturalPath}
        stops={uEightStops}
        id={'u8'}
        color={'#0065ad'}
      />
    );

    const lineElement = container.querySelector(`path#line_u8`);
    expect(lineElement).toBeInTheDocument();
    expect(lineElement).toHaveAttribute('d', uEightNaturalPath);

    const pathElement = container.querySelector(`path#line_u8`);
    expect(pathElement).toHaveAttribute('d', uEightNaturalPath);
    expect(pathElement).toHaveAttribute('stroke', '#0065ad');
  });
});
