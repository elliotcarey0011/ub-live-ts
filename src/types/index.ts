export interface Leg {
    line: string;
    tripId: string;
    destination: string;
    duration: string;
    departure: string;
    arrival: string;
    plannedArrival: string;
    plannedDeparture: string;
}

export interface Journey {
    journeys: {
        legs: Leg[];
    }[];
}
