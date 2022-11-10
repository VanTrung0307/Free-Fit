export interface Session {
  id: number;
  date: Date;
  ptid: number;
  courseId: number;
  clubId: number;
  status: number;
  checkInTime: Date;
  checkOutTime: Date;
}
