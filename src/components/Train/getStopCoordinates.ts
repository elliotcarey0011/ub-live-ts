export const getStopCoordinates = (
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
