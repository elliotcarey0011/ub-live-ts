import React from 'react';
import { uEightStops } from '../../utils/stops';
import { uEightNaturalPath } from '../../utils/paths';
import { Line } from '../Line/Line';

export const MapView: React.FC = () => {
  return (
    <>
      <h1>ub-live</h1>
      <Line
        path={uEightNaturalPath}
        stops={uEightStops}
        id={'u8'}
        color={'#0065ad'}
      />
    </>
  );
};
