export interface RoutePoint {
  order: number;
  lat: number;
  lng: number;
}

export interface Route {
  raceId: string;
  points: RoutePoint[]; // min 3, max 500
  startPoint: RoutePoint;
  endPoint: RoutePoint;
}
