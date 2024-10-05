
export const getCurrentStop = (stopovers: any[], currentTime: number) => {
    if (!stopovers || stopovers.length === 0) return null;

    for (let i = 0; i < stopovers.length - 1; i++) {
        const currentStopDepartureUnix = stopovers[i].departure
            ? new Date(stopovers[i].departure).getTime()
            : null;
        const nextStopDepartureUnix = stopovers[i + 1].departure
            ? new Date(stopovers[i + 1].departure).getTime()
            : null;

        if (currentStopDepartureUnix && nextStopDepartureUnix) {
            if (
                currentTime >= currentStopDepartureUnix &&
                currentTime < nextStopDepartureUnix
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
        if (currentTime >= lastStopDepartureUnix) {
            return stopovers[stopovers.length - 1];
        }
    }

    return null;
};