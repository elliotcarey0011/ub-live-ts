import React, { useEffect, useState, useRef } from 'react';
import { LineBuilder } from '../LineBuilder/LineBuilder';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderLineBuilder(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
