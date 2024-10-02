import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from './apiClient';

type Trip = {
    id: string;
    name: string;
};

type Location = {
    type: string;
    id: string;
    latitude: number;
    longitude: number;
};

type Products = {
    suburban: boolean;
    subway: boolean;
    tram: boolean;
    bus: boolean;
    ferry: boolean;
    express: boolean;
    regional: boolean;
};

type Stop = {
    type: string;
    id: string;
    name: string;
    location: Location;
    products: Products;
    stationDHID: string;
};

type Operator = {
    type: string;
    id: string;
    name: string;
};

type Line = {
    type: string;
    id: string;
    fahrtNr: string;
    name: string;
    public: boolean;
    adminCode: string;
    productName: string;
    mode: string;
    product: string;
    operator: Operator;
};

type Stopover = {
    stop: Stop;
    arrival: string | null;  // ISO 8601 date string or null
    plannedArrival: string | null;  // ISO 8601 date string or null
    arrivalDelay: number | null;  // number or null
    arrivalPlatform: string | null;  // string or null
    arrivalPrognosisType: string | null;  // string or null
    plannedArrivalPlatform: string | null;  // string or null
    departure: string;  // ISO 8601 date string
    plannedDeparture: string;  // ISO 8601 date string
    departureDelay: number;  // number
    departurePlatform: string;  // string
    departurePrognosisType: string;  // string
    plannedDeparturePlatform: string;  // string
};

// New Remark type
type Remark = {
    type: string;
    code: string;
    text: string;
};

type Trip = {
    origin: Stop;
    destination: Stop;
    departure: string;  // ISO 8601 date string
    plannedDeparture: string;  // ISO 8601 date string
    departureDelay: number;
    arrival: string;  // ISO 8601 date string
    plannedArrival: string;  // ISO 8601 date string
    arrivalDelay: number;
    line: Line;
    direction: string;
    arrivalPlatform: string;
    plannedArrivalPlatform: string;
    arrivalPrognosisType: string;
    departurePlatform: string;
    plannedDeparturePlatform: string;
    departurePrognosisType: string;
    stopovers: Stopover[];  // Array of Stopover objects
    remarks: Remark[];  // Array of Remark objects
    id: string;  // Unique identifier for the trip
    realtimeDataUpdatedAt: number;  // Timestamp for the last update
};


export function useTrip(tripId: number): UseQueryResult<Trip> {  // Change integer to number

    const getTripFn = async (): Promise<Trip> => {
        try {
            const response = await apiClient.get<Trip>(`trips/${tripId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch trip data');
        }
    };

    return useQuery<Trip>({
        queryKey: ['trip', tripId],
        queryFn: getTripFn,
        retry: 1,
    });
}
