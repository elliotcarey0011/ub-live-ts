import { render, screen } from '@testing-library/react';
import { MapView } from './MapView';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../Line/Line', () => ({
  Line: () => <div>Mocked Line</div>,
}));
vi.mock('../LineBuilder/LineBuilder', () => ({
  LineBuilder: () => <div>Mocked LineBuilder</div>,
}));

describe('MapView', () => {
  it('renders without crashing', () => {
    render(<MapView />);

    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('ub-live');
  });
});
