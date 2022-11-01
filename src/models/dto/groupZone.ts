export interface GroupZone {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<number[]>>;
}

export interface Properties {
  f1: string;
  f2: string;
  f3: number;
  f4: number;
}

export interface GroupZoneDetails {
  id?: number;
  name: string;
  geom?: Geom;
  brandId?: number;
}
export interface Geom {
  type: string;
  coordinates: Array<Array<number[]>>;
}
export interface PostGroupZone {
  name: string;
  listZoneId?: number[];
  type?: number;
}
