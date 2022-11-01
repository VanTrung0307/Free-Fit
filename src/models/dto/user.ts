export interface User {
  id: string;
  fullname: string;
  phoneNumber: string;
  email: string;
  role: number;
  active: boolean;
  fcmToken: string;
  createDate: Date;
  brandId: number;
  imageUrl: string;
  brandName: string;
}
