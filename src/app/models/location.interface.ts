export interface ILocation {
  name: string;
  flagPath: string;
  route: string;
  id: LocationType;
  lat: number;
  lng: number;
}

export type LocationType = 'LWX' | 'TOP';
