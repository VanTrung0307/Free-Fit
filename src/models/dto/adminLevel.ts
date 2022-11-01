import { Building } from './store';

export interface Province {
  id: number;
  name: string;
  districts: District[];
}

export interface District {
  id: number;
  name: string;
  wards: Ward[];
}

export interface Ward {
  id: number;
  name: string;
  campuses: Campus[];
}

export interface Campus {
  id: number;
  name: string;
  building: Building[];
}
