import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getOSRMRoute, 
  getRouteEndpointsForOrder, 
  simplifyPolyline, 
  haversineDistance 
} from '../services/routeService';

export interface Waypoint {
  lat: number;
  lng: number;
  label: string;
  type: 'origin' | 'destination' | 'checkpoint' | 'vehicle';
  kmMarker?: number;
}

export interface UseOptimizedTrackingResult {
  origin: [number, number];
  destination: [number, number];
  originName: string;
  destinationName: string;
  fullRoute: [number, number][];
  optimizedRoute: [number, number][];
  visibleWaypoints: Waypoint[];
  vehiclePos: [number, number];
  bearing: number;
  updateInterval: number;
  progressPercent: number;
  isMoving: boolean;
  distanceRemainingKm: number;
  timeRemainingMinutes: number;
  setViewportBounds: (bounds: any) => void;
  setZoomLevel: (zoom: number) => void;
  refetchRoute: () => void;
}

export const useOptimizedTracking = (
  order: any,
  isViewedActive = true,
  isDashboardOverview = false
): UseOptimizedTrackingResult => {
  const [fullRoute, setFullRoute] = useState<[number, number][]>([]);
  const [viewportBounds, setViewportBounds] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(10);
  const [progressPercent, setProgressPercent] = useState<number>(30); // starts at 30% progress for demo
  const [isMoving, setIsMoving] = useState<boolean>(true);

  // 1. Resolve Origin and Destination Coordinates from order data
  const { origin, destination, originName, destinationName } = useMemo(() => {
    return getRouteEndpointsForOrder(order);
  }, [order]);

  // 2. Fetch full route from OSRM (or fallback)
  const fetchRouteData = useCallback(async () => {
    if (!origin || !destination) return;
    try {
      const routePoints = await getOSRMRoute(origin, destination);
      setFullRoute(routePoints);
    } catch (error) {
      console.error('Error getting OSRM route:', error);
    }
  }, [origin, destination]);

  useEffect(() => {
    fetchRouteData();
  }, [fetchRouteData]);

  // 3. Dynamic Update Interval Strategy based on vehicle state & page focus
  const updateInterval = useMemo(() => {
    if (!isMoving) return 300000; // 5 minutes when stopped
    if (isViewedActive) return 30000; // 30 seconds when actively tracking this vehicle
    if (isDashboardOverview) return 120000; // 2 minutes on overview dashboard
    return 60000; // 60 seconds standard default when moving
  }, [isMoving, isViewedActive, isDashboardOverview]);

  // 4. Vehicle movement simulation along the route
  useEffect(() => {
    if (fullRoute.length === 0 || !isMoving) return;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setIsMoving(false);
          return 100;
        }
        // Increment progress by 0.5% every tick
        return prev + 0.5;
      });
    }, updateInterval / 10); // scale speed for nice animation speedups in demo

    return () => clearInterval(timer);
  }, [fullRoute, isMoving, updateInterval]);

  // 5. Calculate current simulated vehicle position & bearing
  const { vehiclePos, bearing } = useMemo(() => {
    if (fullRoute.length === 0) return { vehiclePos: origin, bearing: 0 };
    
    const index = Math.min(
      fullRoute.length - 1,
      Math.floor((progressPercent / 100) * fullRoute.length)
    );
    const pos = fullRoute[index];

    // Calculate bearing to next point for animation orientation
    let nextIndex = index + 1;
    if (nextIndex >= fullRoute.length) nextIndex = index - 1;
    const nextPos = fullRoute[nextIndex] || pos;

    const y = Math.sin((nextPos[1] - pos[1]) * (Math.PI / 180)) * Math.cos(nextPos[0] * (Math.PI / 180));
    const x =
      Math.cos(pos[0] * (Math.PI / 180)) * Math.sin(nextPos[0] * (Math.PI / 180)) -
      Math.sin(pos[0] * (Math.PI / 180)) *
        Math.cos(nextPos[0] * (Math.PI / 180)) *
        Math.cos((nextPos[1] - pos[1]) * (Math.PI / 180));
    const brng = (Math.atan2(y, x) * 180) / Math.PI;

    return { vehiclePos: pos, bearing: brng };
  }, [fullRoute, progressPercent, origin]);

  // 6. Polyline Simplification using Douglas-Peucker depending on Zoom Level
  const optimizedRoute = useMemo(() => {
    if (fullRoute.length === 0) return [];
    
    // Select Douglas-Peucker epsilon tolerance depending on map zoom level
    // Zoomed out (<= 7): simplify heavily to prevent browser lag (0.05 epsilon)
    // Medium zoom (8-11): moderate detail (0.01 epsilon)
    // Zoomed in (>= 12): maximum detail (0.001 epsilon)
    let tolerance = 0.001;
    if (zoomLevel <= 7) tolerance = 0.04;
    else if (zoomLevel <= 11) tolerance = 0.008;

    return simplifyPolyline(fullRoute, tolerance);
  }, [fullRoute, zoomLevel]);

  // 7. Checkpoint generation every 50km
  const checkpoints = useMemo(() => {
    if (fullRoute.length === 0) return [];
    const points: Waypoint[] = [];
    let accumulatedDistance = 0;

    for (let i = 1; i < fullRoute.length; i++) {
      accumulatedDistance += haversineDistance(
        fullRoute[i - 1][0],
        fullRoute[i - 1][1],
        fullRoute[i][0],
        fullRoute[i][1]
      );

      // Place a checkpoint marker approximately every 50km
      if (accumulatedDistance >= 50 && points.length < 5) {
        points.push({
          lat: fullRoute[i][0],
          lng: fullRoute[i][1],
          label: `NH Highway Checkpoint (KM ${Math.round(points.length * 50 + 50)})`,
          type: 'checkpoint',
          kmMarker: Math.round(points.length * 50 + 50),
        });
        accumulatedDistance = 0; // reset
      }
    }
    return points;
  }, [fullRoute]);

  // 8. Prefetch next segment when vehicle is within 10km of next checkpoint
  useEffect(() => {
    if (checkpoints.length === 0 || !isMoving) return;
    checkpoints.forEach((cp) => {
      const dist = haversineDistance(vehiclePos[0], vehiclePos[1], cp.lat, cp.lng);
      if (dist > 0 && dist <= 10) {
        console.log(`[OptimizedTracking] Prefetching next route segment near ${cp.label} (Distance: ${dist.toFixed(2)}km)`);
      }
    });
  }, [vehiclePos, checkpoints, isMoving]);

  // 9. Viewport-based Waypoint Filtering
  const visibleWaypoints = useMemo(() => {
    const allWaypoints: Waypoint[] = [
      { lat: origin[0], lng: origin[1], label: `${originName} (Origin)`, type: 'origin' },
      { lat: destination[0], lng: destination[1], label: `${destinationName} (Destination)`, type: 'destination' },
      ...checkpoints,
      { lat: vehiclePos[0], lng: vehiclePos[1], label: `${order?.transporter?.name || 'Rahul Transporter'} (MH-43-BE-1234)`, type: 'vehicle' },
    ];

    if (!viewportBounds) return allWaypoints;

    // Filter to only include waypoints that fall within the current viewport bounds
    return allWaypoints.filter((wp) => {
      try {
        const latVal = wp.lat;
        const lngVal = wp.lng;
        // Leaflet bounds format: contains([lat, lng])
        return viewportBounds.contains([latVal, lngVal]);
      } catch (e) {
        return true; // Fallback to showing it if bounds library checks error out
      }
    });
  }, [viewportBounds, origin, destination, originName, destinationName, checkpoints, vehiclePos, order]);

  // 10. Distance & Time Calculations
  const distanceRemainingKm = useMemo(() => {
    if (fullRoute.length === 0) return 0;
    return haversineDistance(vehiclePos[0], vehiclePos[1], destination[0], destination[1]);
  }, [vehiclePos, destination, fullRoute]);

  const timeRemainingMinutes = useMemo(() => {
    // Assuming an average highway truck speed of 50 km/h
    return Math.round((distanceRemainingKm / 50) * 60);
  }, [distanceRemainingKm]);

  return {
    origin,
    destination,
    originName,
    destinationName,
    fullRoute,
    optimizedRoute,
    visibleWaypoints,
    vehiclePos,
    bearing,
    updateInterval,
    progressPercent,
    isMoving,
    distanceRemainingKm,
    timeRemainingMinutes,
    setViewportBounds,
    setZoomLevel,
    refetchRoute: fetchRouteData,
  };
};
