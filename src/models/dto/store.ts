export interface Store {
  id: number;
  name: string;
  wkt: string;
  createDate: Date;
  brandId: number;
  address: string;
  brandName: string;
  buildingId: number;
  buildingName: string;
  building: Building;
  type: string;
  status: number;
  storeStreetSegments: any[];
  abilityToServe: number;
  timeSlot: string;
  geom: Geom;
  storeTypeName: string;
  imageUrl?: string;
  storeTypeId?: number;
  storeCode?: string;
  url: string;
  template: Template;
  phone?: string;
  bank?: string;
}

export interface Brand {
  id: number;
  name: string;
  active: number;
  iconUrl?: string;
  imageUrl?: string;
  segmentId?: number;
  segmentName?: string;
}

export interface Building {
  id: number;
  name: string;
}

export interface Account {
  id: number;
  fullname: string;
  phoneNumber?: string;
  email: string;
  role: number;
  active: number;
  fcmToken?: string;
  createDate?: string;
  brandId: number;
  imageUrl?: string;
  brandName?: string;
}

export interface Geom {
  type: string;
  coordinates: number[];
}
export interface StoreType {
  id: number;
  name: string;
  parentStoreTypeId?: number;
  parentStoreTypeName?: string;
}

export interface BrandType {
  id: number;
  name: string;
}

export interface Segment {
  id: number;
  name: string;
}
export interface PostStore {
  id: number;
  name: string;
  brandId?: number;
  address: string;
  coordinateString: string;
  imageUrl?: string;
  storeCode: string;
  storeTypeId: number;
  buildingId?: number;
  phone?: string;
  bank?: string;
}

export interface PostBrand {
  // id: number;
  name: string;
  iconUrl?: string;
  imageUrl?: string;
  segmentId?: number;
}

export interface PostAccount {
  fullname: string;
  phoneNumber?: string;
  email: string;
  role: number;
  imageUrl?: string;
  brandId: number;
  password: string;
}
export interface Template {
  id: number;
  name: string;
  imageUrl: string;
}
export interface PostTemplate {
  templateId: number;
  url: string;
}
