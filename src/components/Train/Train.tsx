import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useJourney } from '../../api/useJourney';
import { uEightStops } from '../../utils/stops';

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

const Circle = React.forwardRef<SVGCircleElement, CircleProps>(
  (
    { id, line, cx, cy, destination, plannedArrival, plannedDeparture },
    ref
  ) => (
    <circle
      id={`train_${id}_${line}`}
      fill="red"
      r="11"
      cx={cx}
      cy={cy}
      ref={ref}
    >
      <title>
        <div>
          Destination: {destination}
          Planned Arrival: {plannedArrival}
          Planned Departure: {plannedDeparture}
        </div>
      </title>
    </circle>
  )
);
export const Train: React.FC<TrainProps> = ({ firstStop, lastStop }) => {
  const { data, isLoading, isError, refetch } = useJourney(firstStop, lastStop);
  // console.log(data?.journeys.length);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const journeys = data?.journeys;
  console.log(data);
  console.log('jorney', journeys);

  const leg = journeys?.[0]?.legs?.[0];
  const stopovers = leg?.stopovers;
  console.log('stopovers', stopovers);

  const line = leg?.line?.id || '';
  const tripId = leg?.tripId || '';
  const idParts = tripId.toString().split('|');
  const id = idParts.length > 4 ? idParts[4] : 'default-id';

  const destination = leg?.destination?.name || '';
  const plannedArrival = leg?.plannedArrival || '';
  const plannedDeparture = leg?.plannedDeparture || '';

  const departure = leg?.departure ? new Date(leg.departure) : null;
  const arrival = leg?.arrival ? new Date(leg.arrival) : null;

  const durationInSeconds =
    departure && arrival ? (arrival.getTime() - departure.getTime()) / 1000 : 0;

  const getStopCoordinates = (
    stopId: string
  ): { cx: number; cy: number } | null => {
    const circle = document.getElementById(
      `stop_${stopId}_u8`
    ) as SVGCircleElement | null;

    if (circle) {
      const cx = circle.getAttribute('cx');
      const cy = circle.getAttribute('cy');

      if (cx !== null && cy !== null) {
        return { cx: parseFloat(cx), cy: parseFloat(cy) };
      }
    }

    return null;
  };

  const onComplete = () => {
    console.log('complete');
  };
  const onStart = () => {
    console.log('start');
  };
  const onInterrupt = () => {
    console.log('interrupt');
  };

  const findCurrentStop = () => {
    if (!stopovers || stopovers.length === 0) return null;

    const nowUnix = Date.now(); // Current time in Unix time (milliseconds since epoch)

    // Loop through stopovers to find the current stop
    for (let i = 0; i < stopovers.length - 1; i++) {
      const currentStopDepartureUnix = stopovers[i].departure
        ? new Date(stopovers[i].departure).getTime()
        : null;
      const nextStopDepartureUnix = stopovers[i + 1].departure
        ? new Date(stopovers[i + 1].departure).getTime()
        : null;
      // console.log('planned', currentStopDepartureUnix);
      // console.log('plannednx', nextStopDepartureUnix);
      // console.log('now', nowUnix);

      // Check if the current time is between the departure times of the current and next stop
      if (currentStopDepartureUnix && nextStopDepartureUnix) {
        if (
          nowUnix >= currentStopDepartureUnix &&
          nowUnix < nextStopDepartureUnix
        ) {
          return stopovers[i];
        }
      }
    }

    // If we are past the last stop, return the last stop
    if (stopovers[stopovers.length - 1].departure) {
      const lastStopDepartureUnix = new Date(
        stopovers[stopovers.length - 1].departure
      ).getTime();
      if (nowUnix >= lastStopDepartureUnix) {
        return stopovers[stopovers.length - 1];
      }
    }

    return null;
  };

  const currentStop = findCurrentStop();
  console.log('current', currentStop?.stop);

  useEffect(() => {
    if (!circleRef.current) {
      return;
    }

    const tl = gsap.timeline({ repeatDelay: 1 });

    uEightStops.forEach((stop) => {
      const position = getStopCoordinates(Number(stop.id));
      if (!position) {
        return;
      }

      const animationDuration = Math.min(
        Math.floor(durationInSeconds / uEightStops.length),
        300
      );

      tl.to(`#train_${id}_${line}`, {
        cx: position.cx,
        cy: position.cy,
        duration: animationDuration,
        delay: 1,
        onComplete: onComplete,
        onStart: onStart,
        onInterrupt: onInterrupt,
      });
    });

    return () => {
      tl.kill();
    };
  }, [leg]);

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
      <Circle
        id={id}
        line={line}
        cx={`${getStopCoordinates(currentStop?.stop.id)?.cx}`}
        cy={`${getStopCoordinates(currentStop?.stop.id)?.cy}`}
        destination={destination}
        plannedArrival={plannedArrival}
        plannedDeparture={plannedDeparture}
        ref={circleRef}
      />
      <p>Current Stop: {currentStop?.stop?.name || 'Not available'}</p>
    </>
  );
};
