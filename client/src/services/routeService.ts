/**
 * Route Service for Smart-Kissan
 * Implements:
 * 1. Native IndexedDB cache layer for API routes
 * 2. OSRM driving route integration
 * 3. Douglas-Peucker Polyline Simplification algorithm
 * 4. A* Search Algorithm with Haversine heuristic for mandi cluster routing
 * 5. High-fidelity dynamic fallback routes for demo purposes (e.g. Mumbai to Nashik, Pune to Thane)
 */

// ---------------------------------------------------------
// 1. IndexedDB Cache Layer
// ---------------------------------------------------------
class IndexedDBCache {
  private dbName = 'smartkisaan-tracking';
  private storeName = 'routes';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve();
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async get(key: string): Promise<any> {
    if (!this.db) {
      try {
        await this.init();
      } catch (e) {
        console.warn('IndexedDB failed to init:', e);
        return null;
      }
    }
    return new Promise((resolve) => {
      if (!this.db) return resolve(null);
      try {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onerror = () => resolve(null);
        request.onsuccess = () => {
          const result = request.result;
          if (result && Date.now() - result.timestamp < 300000) { // 5-minute cache TTL
            resolve(result.data);
          } else {
            resolve(null);
          }
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  async set(key: string, data: any): Promise<void> {
    if (!this.db) {
      try {
        await this.init();
      } catch (e) {
        return;
      }
    }
    return new Promise((resolve) => {
      if (!this.db) return resolve();
      try {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.put({ key, data, timestamp: Date.now() });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

const cache = new IndexedDBCache();

// ---------------------------------------------------------
// 2. Douglas-Peucker Polyline Simplification
// ---------------------------------------------------------
function getSqSegDist(p: [number, number], p1: [number, number], p2: [number, number]): number {
  let x = p1[0];
  let y = p1[1];
  let dx = p2[0] - x;
  let dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}

export function simplifyPolyline(points: [number, number][], tolerance: number): [number, number][] {
  if (points.length <= 2) return points;

  let maxSqDist = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const sqDist = getSqSegDist(points[i], points[0], points[end]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > tolerance * tolerance) {
    const results1 = simplifyPolyline(points.slice(0, index + 1), tolerance);
    const results2 = simplifyPolyline(points.slice(index), tolerance);
    return results1.slice(0, results1.length - 1).concat(results2);
  }

  return [points[0], points[end]];
}

// ---------------------------------------------------------
// 3. A* Search Algorithm for Mandi Clusters Pathfinding
// ---------------------------------------------------------
export interface MandiNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  connections: string[]; // Connected Node IDs
}

// Coordinate Network of Sourcing Clusters, Mandis, and Hubs in Maharashtra, India
export const MANDI_GRAPH: Record<string, MandiNode> = {
  mumbai: { id: 'mumbai', name: 'Mumbai Logistics Hub', lat: 19.0760, lng: 72.8777, connections: ['thane', 'lonavala'] },
  thane: { id: 'thane', name: 'Thane Central Center', lat: 19.2183, lng: 72.9781, connections: ['mumbai', 'kalyan', 'nashik'] },
  kalyan: { id: 'kalyan', name: 'Kalyan Mandi Cluster', lat: 19.2403, lng: 73.1305, connections: ['thane', 'kasara'] },
  kasara: { id: 'kasara', name: 'Kasara Transit Point', lat: 19.6356, lng: 73.4795, connections: ['kalyan', 'nashik'] },
  lonavala: { id: 'lonavala', name: 'Lonavala Western Gate', lat: 18.7508, lng: 73.4050, connections: ['mumbai', 'pune'] },
  pune: { id: 'pune', name: 'Pune Sourcing Mandi', lat: 18.5204, lng: 73.8567, connections: ['lonavala', 'ahmednagar'] },
  ahmednagar: { id: 'ahmednagar', name: 'Ahmednagar Sourcing Hub', lat: 19.0948, lng: 74.7480, connections: ['pune', 'shirdi', 'aurangabad'] },
  nashik: { id: 'nashik', name: 'Nashik Onion & Grape Mandi', lat: 19.9975, lng: 73.7898, connections: ['thane', 'kasara', 'shirdi'] },
  shirdi: { id: 'shirdi', name: 'Shirdi Central Hub', lat: 19.7662, lng: 74.4754, connections: ['nashik', 'ahmednagar', 'aurangabad'] },
  aurangabad: { id: 'aurangabad', name: 'Aurangabad Industrial Mandi', lat: 19.8762, lng: 75.3433, connections: ['ahmednagar', 'shirdi'] },
};

// Haversine Distance Heuristic
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find shortest path connecting mandi hubs using A* Search Algorithm
export function findRouteWithAStar(startId: string, endId: string): MandiNode[] {
  const startNode = MANDI_GRAPH[startId.toLowerCase()];
  const endNode = MANDI_GRAPH[endId.toLowerCase()];
  if (!startNode || !endNode) return [];

  const openSet: string[] = [startNode.id];
  const cameFrom: Record<string, string> = {};

  const gScore: Record<string, number> = {};
  gScore[startNode.id] = 0;

  const fScore: Record<string, number> = {};
  fScore[startNode.id] = haversineDistance(startNode.lat, startNode.lng, endNode.lat, endNode.lng);

  while (openSet.length > 0) {
    // Get node in openSet with lowest fScore
    openSet.sort((a, b) => (fScore[a] ?? Infinity) - (fScore[b] ?? Infinity));
    const currentId = openSet.shift()!;

    if (currentId === endNode.id) {
      // Reconstruct path
      const path: MandiNode[] = [];
      let temp = currentId;
      while (temp) {
        path.unshift(MANDI_GRAPH[temp]);
        temp = cameFrom[temp];
      }
      return path;
    }

    const currentNode = MANDI_GRAPH[currentId];
    for (const neighborId of currentNode.connections) {
      const neighbor = MANDI_GRAPH[neighborId];
      const tentativeGScore =
        gScore[currentId] +
        haversineDistance(currentNode.lat, currentNode.lng, neighbor.lat, neighbor.lng);

      if (tentativeGScore < (gScore[neighborId] ?? Infinity)) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] =
          tentativeGScore + haversineDistance(neighbor.lat, neighbor.lng, endNode.lat, endNode.lng);

        if (!openSet.includes(neighborId)) {
          openSet.push(neighborId);
        }
      }
    }
  }

  return []; // Path not found
}

// ---------------------------------------------------------
// 4. OSRM API Integration & Cache Wrapper
// ---------------------------------------------------------
export async function getOSRMRoute(
  start: [number, number],
  end: [number, number]
): Promise<[number, number][]> {
  const cacheKey = `route_${start[0].toFixed(4)},${start[1].toFixed(4)}_${end[0].toFixed(4)},${end[1].toFixed(4)}`;
  
  // Try retrieving from IndexedDB cache
  const cachedRoute = await cache.get(cacheKey);
  if (cachedRoute) {
    return cachedRoute;
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM API request failed');

    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // OSRM returns coordinates as [lon, lat], convert to [lat, lon]
      const geojsonCoords = data.routes[0].geometry.coordinates as [number, number][];
      const route: [number, number][] = geojsonCoords.map(([lon, lat]) => [lat, lon]);

      // Cache the result in IndexedDB
      await cache.set(cacheKey, route);
      return route;
    }
  } catch (error) {
    console.warn('OSRM fetching failed, falling back to straight-line interpolation', error);
  }

  // Pure straight-line interpolation fallback if API offline
  return interpolateRoute(start, end, 50);
}

// Helper to interpolate points for dynamic mock data
export function interpolateRoute(
  start: [number, number],
  end: [number, number],
  stepsCount = 30
): [number, number][] {
  const route: [number, number][] = [];
  for (let i = 0; i <= stepsCount; i++) {
    const ratio = i / stepsCount;
    const lat = start[0] + (end[0] - start[0]) * ratio;
    const lng = start[1] + (end[1] - start[1]) * ratio;
    route.push([lat, lng]);
  }
  return route;
}

// ---------------------------------------------------------
// 5. Dynamic Sourcing Hub Resolution
// ---------------------------------------------------------
export function getRouteEndpointsForOrder(order: any): {
  origin: [number, number];
  destination: [number, number];
  originName: string;
  destinationName: string;
} {
  const startLoc = order?.pickupAddress || order?.from || 'Pune';
  const endLoc = order?.deliveryAddress?.city || order?.to || 'Mumbai';

  let origin: [number, number] = [18.5204, 73.8567]; // Pune default
  let originName = 'Pune Sourcing Mandi';
  let destination: [number, number] = [19.0760, 72.8777]; // Mumbai default
  let destinationName = 'Mumbai Logistics Hub';

  // Check matching hubs (Maharashtra and pan-India)
  const normalizedStart = String(startLoc).toLowerCase();
  const normalizedEnd = String(endLoc).toLowerCase();

  if (normalizedStart.includes('nashik')) {
    origin = [19.9975, 73.7898];
    originName = 'Nashik Onion Mandi';
  } else if (normalizedStart.includes('pune')) {
    origin = [18.5204, 73.8567];
    originName = 'Pune Sourcing Mandi';
  } else if (normalizedStart.includes('thane')) {
    origin = [19.2183, 72.9781];
    originName = 'Thane Central';
  } else if (normalizedStart.includes('mumbai')) {
    origin = [19.0760, 72.8777];
    originName = 'Mumbai Hub';
  } else if (normalizedStart.includes('bikaner')) {
    origin = [27.0238, 73.3119];
    originName = 'Bikaner Sourcing Hub';
  } else if (normalizedStart.includes('karnal')) {
    origin = [29.6857, 76.9905];
    originName = 'Karnal Rice Cluster';
  } else if (normalizedStart.includes('jaipur')) {
    origin = [26.9124, 75.7873];
    originName = 'Jaipur Hub';
  }

  if (normalizedEnd.includes('mumbai') || normalizedEnd.includes('vashi') || normalizedEnd.includes('navi mumbai')) {
    destination = [19.0760, 72.8777];
    destinationName = 'Mumbai Logistics Hub';
  } else if (normalizedEnd.includes('nashik')) {
    destination = [19.9975, 73.7898];
    destinationName = 'Nashik Cluster';
  } else if (normalizedEnd.includes('thane')) {
    destination = [19.2183, 72.9781];
    destinationName = 'Thane Hub';
  } else if (normalizedEnd.includes('pune')) {
    destination = [18.5204, 73.8567];
    destinationName = 'Pune Mandi';
  } else if (normalizedEnd.includes('delhi') || normalizedEnd.includes('azadpur') || normalizedEnd.includes('ina')) {
    destination = [28.6139, 77.2090];
    destinationName = 'Delhi Azadpur Terminal';
  } else if (normalizedEnd.includes('jaipur')) {
    destination = [26.9124, 75.7873];
    destinationName = 'Jaipur Terminal';
  }

  return { origin, destination, originName, destinationName };
}

// ---------------------------------------------------------
// 6. Central Mock Database for Client Demonstration Fallbacks
// ---------------------------------------------------------
export function getMockOrderById(id: string | undefined): any {
  const defaultOrder = {
    id: 'ORD-5521',
    _id: '55214488',
    productName: 'PREMIUM BASMATI RICE',
    status: 'IN_TRANSIT',
    transporter: { name: 'RAJ CARGO EXPRESS' },
    vehicleNumber: 'MH-43-BE-1234',
    pickupAddress: 'Nashik Onion Mandi',
    deliveryAddress: { 
      name: 'GLOBAL FOODS LTD', 
      address: 'PLOT 42, SECTOR 15, VASHI', 
      city: 'NAVI MUMBAI', 
      state: 'MAHARASHTRA' 
    },
    totalAmount: 215000,
    quantity: 100,
    pricePerUnit: 2150
  };

  if (!id) return defaultOrder;

  const normalizedId = String(id).toUpperCase();

  // Wheat Order (ORD-5521 / 55214488) -> Bikaner to Delhi
  if (normalizedId.includes('55214488') || normalizedId === 'ORD-5521' || normalizedId.includes('101')) {
    return {
      id: 'ORD-5521',
      _id: '55214488',
      productName: 'Wheat (HD-2967)',
      status: 'IN_TRANSIT',
      transporter: { name: 'RAJ CARGO EXPRESS' },
      vehicleNumber: 'MH-43-BE-1234',
      pickupAddress: 'Bikaner, Rajasthan',
      deliveryAddress: { 
        name: 'DELHI INDUSTRIAL TERMINAL', 
        address: 'AZADPUR MANDI BLOCK C', 
        city: 'Delhi', 
        state: 'Delhi' 
      },
      totalAmount: 215000,
      quantity: 100,
      pricePerUnit: 2150
    };
  }

  // Red Onions Order (ORD-5522 / 55214489) -> Nashik to Mumbai
  if (normalizedId.includes('55214489') || normalizedId === 'ORD-5522' || normalizedId.includes('102')) {
    return {
      id: 'ORD-5522',
      _id: '55214489',
      productName: 'Red Onions',
      status: 'DELIVERED',
      transporter: { name: 'VASHI LOGISTICS' },
      vehicleNumber: 'MH-12-PQ-9876',
      pickupAddress: 'Nashik, Maharashtra',
      deliveryAddress: { 
        name: 'VASHI MANDI DEPOT 4', 
        address: 'SECTOR 19, VASHI APMC', 
        city: 'Mumbai', 
        state: 'Maharashtra' 
      },
      totalAmount: 85000,
      quantity: 40,
      pricePerUnit: 2125
    };
  }

  // Basmati Rice Order (L-103) -> Karnal to Delhi
  if (normalizedId.includes('103') || normalizedId.includes('5523') || normalizedId === 'ORD-5523') {
    return {
      id: 'ORD-5523',
      _id: '103',
      productName: 'Premium Basmati Rice',
      status: 'IN_TRANSIT',
      transporter: { name: 'HARYANA LOGISTICS' },
      vehicleNumber: 'HR-55-AA-4432',
      pickupAddress: 'Karnal, Haryana',
      deliveryAddress: { 
        name: 'INA FOOD COURT', 
        address: 'KIDWAI NAGAR WEST', 
        city: 'Delhi', 
        state: 'Delhi' 
      },
      totalAmount: 120000,
      quantity: 200,
      pricePerUnit: 600
    };
  }

  return defaultOrder;
}
