import React, { useEffect } from 'react';
import { Train } from '../Train/Train';

interface LineBuilderProps {
  stops: { id: string; name: string }[];
  path: SVGPathElement;
  id: string;
  properties: {
    getTotalLength: () => number;
    getPointAtLength: (length: number) => DOMPoint | null;
  };
}

export const LineBuilder: React.FC<LineBuilderProps> = ({
  stops,
  path,
  id,
  properties,
}) => {
  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];

  useEffect(() => {
    if (!path) {
      return;
    }

    const linePathParent = path.parentNode as SVGGElement;
    const lineLength = properties.getTotalLength();
    const distanceBetweenElements = lineLength / (stops.length + 1);
    const stopsDataReverse = [...stops].reverse();

    const createOrUpdateStop = (
      stop: { id: string; name: string },
      point: DOMPoint
    ) => {
      let circle = linePathParent.querySelector<SVGCircleElement>(
        `#stop_${stop.id}_${id}`
      );

      if (!circle) {
        circle = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        ) as SVGCircleElement;
        circle.setAttribute('id', `stop_${stop.id}_${id}`);
        circle.setAttribute(
          'fill',
          import.meta.env.VITE_STATION_DOT_AND_TEXT_COLOR
        );
        circle.setAttribute('r', '6');
        linePathParent.appendChild(circle);
      }

      circle.setAttribute('cx', point.x.toString());
      circle.setAttribute('cy', point.y.toString());

      let text = linePathParent.querySelector(`#text_${stop.id}_${id}`);
      if (!text) {
        text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('id', `text_${stop.id}_${id}`);
        linePathParent.appendChild(text);
      }

      text.textContent = stop.name;
      text.setAttribute(
        'fill',
        import.meta.env.VITE_STATION_DOT_AND_TEXT_COLOR
      );
      text.setAttribute('x', (point.x + 5).toString());
      text.setAttribute('y', (point.y + 5).toString());
      text.setAttribute('text-anchor', 'start');
    };

    const updateStopPositions = () => {
      stopsDataReverse.forEach((stop, index) => {
        const distance = distanceBetweenElements * (index + 1);
        const point = properties.getPointAtLength(distance);

        if (point) {
          createOrUpdateStop(stop, point);
        } else {
          console.warn(
            `Could not get point for stop: ${stop.name} at distance ${distance}`
          );
        }
      });
    };

    updateStopPositions();
  }, [path, stops]);

  return <Train firstStop={firstStop.id} lastStop={lastStop.id} />;
};
