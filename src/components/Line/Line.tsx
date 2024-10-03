import React, { useEffect, useState, useRef } from 'react';
import { LineBuilder } from '../LineBuilder/LineBuilder';
import { Train } from '../Train/Train';
import { svgPathProperties } from 'svg-path-properties';

interface Stop {
  id: string;
  name: string;
}

interface LineProps {
  path: string;
  stops: Stop[];
  id: string;
  color: string;
}

export const Line: React.FC<LineProps> = ({ path, stops, id, color }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const properties = new svgPathProperties(path);

  const [renderLineBuilder, setRenderLineBuilder] = useState(false);

  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];

  useEffect(() => {
    if (pathRef.current) {
      setRenderLineBuilder(true);
    }
  }, [pathRef]);

  return (
    <div id={`train-line`} className="train-line" data-testid="line">
      <svg width="100%" height="100%" viewBox="250 250 457 140" id="svg">
        <path
          id={`line_${id}`}
          ref={pathRef}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="3"
        />
        <Train firstStop={firstStop.id} lastStop={lastStop.id} />
        {renderLineBuilder && (
          <LineBuilder
            stops={stops}
            path={pathRef.current}
            id={id}
            properties={properties}
          />
        )}
      </svg>
    </div>
  );
};
