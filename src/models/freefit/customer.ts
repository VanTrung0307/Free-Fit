import { Club } from './club';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  club: Club[];
  registration: Registration[];
}
export interface PostCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  club: Club[];
  registration: Registration[];
}

export interface Registration {
  id: number;
  type: number;
  createAt: Date;
  updateAt: Date;
  status: number;
  startDate: Date;
  endDate: Date;
  numberSessions: number;
  packageId: number;
}
