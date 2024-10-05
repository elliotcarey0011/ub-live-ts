import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useJourney } from '../../api/useJourney';
import { uEightStops } from '../../utils/stops';
import { useTime } from '../../TimeContext';
import { getStopCoordinates } from './getStopCoordinates';
import { getCurrentStop } from './getCurrentStop';
import useSetState from '../../hooks/useSetState';

interface TrainProps {
  firstStop: string;
  lastStop: string;
}

interface CircleProps {
  id: string;
  line: string;
  cx: string;
  cy: string;
  destination: string;
  plannedArrival: string;
  plannedDeparture: string;
}

const Circle: React.FC<CircleProps> = ({
  id,
  line,
  cx,
  cy,
  destination,
  plannedArrival,
  plannedDeparture,
}) => (
  <circle id={`${id}`} fill="red" r="11" cx={cx} cy={cy}>
    <title>
      <div>
        Destination: {destination}
        Planned Departure: {plannedDeparture}
        Planned Arrival: {plannedArrival}
      </div>
    </title>
  </circle>
);

export const Train: React.FC<TrainProps> = ({ firstStop, lastStop }) => {
  const { data, isLoading, isError, refetch } = useJourney(firstStop, lastStop);
  const { dataNorth } = useJourney(lastStop, firstStop);
  const [state, setState] = useState();

  const circleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const currentTime = useTime();

  const journeys = data?.journeys || [];

  const onComplete = () => {
    console.log('complete');
  };
  const onStart = () => {
    console.log('start');
  };

  useEffect(() => {
    if (!circleRefs.current) return;
    // setState(data);

    // Loop through each journey and create a separate GSAP timeline for each one
    journeys.forEach((journey, index) => {
      const leg = journey?.legs?.[0];

      const stopovers = leg?.stopovers;
      const currentStop = getCurrentStop(stopovers, currentTime);
      const currentStopIndex = uEightStops.findIndex(
        (stop) => stop.id === currentStop?.stop?.id
      );

      if (currentStopIndex !== -1) {
        const tl = gsap.timeline({ repeatDelay: 1 }); // Create a new timeline for each journey

        uEightStops.slice(currentStopIndex).forEach((stop) => {
          const position = getStopCoordinates(Number(stop.id));
          if (!position) return;

          const durationInSeconds =
            leg?.departure && leg?.arrival
              ? (new Date(leg.arrival).getTime() -
                  new Date(leg.departure).getTime()) /
                1000
              : 0;

          const animationDuration = Math.min(
            Math.floor(
              durationInSeconds / (uEightStops.length - currentStopIndex)
            ),
            300
          );

          // Use index to target each circle uniquely
          tl.to(`#train_${index}_${leg.line.id}`, {
            cx: position.cx,
            cy: position.cy,
            duration: animationDuration,
            delay: 1,
            onComplete: onComplete,
            onStart: onStart,
          });
        });
      }
    });
  }, [journeys]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Failed to fetch journey data.</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      {journeys.map((journey, index) => {
        const leg = journey?.legs?.[0];
        const stopovers = leg.stopovers;

        const line = leg?.line?.id || '';
        const destination = leg?.destination?.name || '';
        const plannedArrival = leg?.plannedArrival || '';
        const plannedDeparture = leg?.plannedDeparture || '';

        const currentStop = getCurrentStop(stopovers, currentTime);
        const position = getStopCoordinates(currentStop?.stop?.id || '');

        return (
          <React.Fragment key={index}>
            <Circle
              id={`train_${index}_${line}`}
              line={line}
              cx={`${position?.cx || 0}`}
              cy={`${position?.cy || 0}`}
              destination={destination}
              plannedArrival={plannedArrival}
              plannedDeparture={plannedDeparture}
            />
            <p>Current Stop: {currentStop?.stop?.name || 'Not available'}</p>
            <div>
              <h4>{destination}</h4>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
