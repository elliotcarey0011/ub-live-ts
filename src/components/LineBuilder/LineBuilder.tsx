import React, { useEffect } from 'react';
import { Train } from '../Train/Train';
import { gsap } from 'gsap';

interface Stop {
  id: string;
  name: string;
}
interface PathFunction {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  a?: { x: number; y: number };
  b?: { x: number; y: number };
  c?: { x: number; y: number };
  d?: { x: number; y: number };
  length?: number;
}

interface Properties {
  length: number;
  partial_lengths: number[];
  functions: (PathFunction | null)[];
  initial_point: {
    x: number;
    y: number;
  };
}

interface LineBuilderProps {
  stops: Stop[];
  path: SVGPathElement;
  id: string;
  properties: Properties;
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
    const linePath = path;
    const linePathParent = linePath.parentNode as SVGGElement;
    const lineLength = properties.getTotalLength();
    const stopCount = stops.length;
    const distanceBetweenElements = lineLength / (stopCount + 1);
    const stopsDataReverse = [...stops].reverse();

    const createOrUpdateStop = (stop: Stop, point: DOMPoint) => {
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
        text.textContent = stop.name;
        linePathParent.appendChild(text);
      }
      text.setAttribute(
        'fill',
        import.meta.env.VITE_STATION_DOT_AND_TEXT_COLOR
      );
      text.setAttribute('x', point.x.toString() + 5);
      text.setAttribute('y', point.y.toString() + 5);
      text.setAttribute('text-anchor', 'start');
    };

    const updateStopPositions = () => {
      stopsDataReverse.forEach((stop, index) => {
        const distance = distanceBetweenElements * (index + 1);

        const point = properties.getPointAtLength
          ? properties.getPointAtLength(distance)
          : null;

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
