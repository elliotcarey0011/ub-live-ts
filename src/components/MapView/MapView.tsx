import React, { createContext, useContext } from 'react';

import { uEightStops } from '../../utils/stops';
import { uEightNaturalPath } from '../../utils/paths';
import { Line } from '../Line/Line';
import { TimeProvider } from '../../TimeContext';

export const MapView: React.FC = () => {
  return (
    <>
      <h1>ub-live</h1>
      <TimeProvider>
        <Line
          path={uEightNaturalPath}
          stops={uEightStops}
          id={'u8'}
          color={'#0065ad'}
        />
      </TimeProvider>
    </>
  );
};
