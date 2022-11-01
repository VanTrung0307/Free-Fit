export interface TimeObj {
  start: string;
  end: string;
}
export interface TimeObjNum {
  start: number;
  end: number;
}
export interface TimeFilter {
  [key: number]: TimeObj;
}
export interface DateFilter {
  [key: number]: string;
}
export interface TimeOfDay {
  start: Date;
  end: Date;
}
export interface OptionsTimeFilter {
  id: number;
  name: string;
}

export function GetConstantTimeFilter() {
  const timeFilter: TimeFilter = {
    0: { start: '00:00:00', end: '01:00:00' },
    1: { start: '01:00:00', end: '02:00:00' },
    2: { start: '02:00:00', end: '03:00:00' },
    3: { start: '03:00:00', end: '04:00:00' },
    4: { start: '04:00:00', end: '05:00:00' },
    5: { start: '05:00:00', end: '06:00:00' },
    6: { start: '06:00:00', end: '07:00:00' },
    7: { start: '07:00:00', end: '08:00:00' },
    8: { start: '08:00:00', end: '09:00:00' },
    9: { start: '09:00:00', end: '10:00:00' },
    10: { start: '10:00:00', end: '11:00:00' },
    11: { start: '11:00:00', end: '12:00:00' },
    12: { start: '12:00:00', end: '13:00:00' },
    13: { start: '13:00:00', end: '14:00:00' },
    14: { start: '14:00:00', end: '15:00:00' },
    15: { start: '15:00:00', end: '16:00:00' },
    16: { start: '16:00:00', end: '17:00:00' },
    17: { start: '17:00:00', end: '18:00:00' },
    18: { start: '18:00:00', end: '19:00:00' },
    19: { start: '19:00:00', end: '20:00:00' },
    20: { start: '20:00:00', end: '21:00:00' },
    21: { start: '21:00:00', end: '22:00:00' },
    22: { start: '22:00:00', end: '23:00:00' },
    23: { start: '23:00:00', end: '00:00:00' },
  };
  const dateFilter: DateFilter = {
    0: '2(Mo)',
    1: '3(Tu)',
    2: '4(We)',
    3: '5(Th)',
    4: '6(Fr)',
    5: '7(Sa)',
    6: 'CN(Su)',
  };
  const timeFilterOptions: OptionsTimeFilter[] = [
    { id: 0, name: '00:00 -> 01:00' },
    { id: 1, name: '01:00 -> 02:00' },
    { id: 2, name: '02:00 -> 03:00' },
    { id: 3, name: '03:00 -> 04:00' },
    { id: 4, name: '04:00 -> 05:00' },
    { id: 5, name: '05:00 -> 06:00' },
    { id: 6, name: '06:00 -> 07:00' },
    { id: 7, name: '07:00 -> 08:00' },
    { id: 8, name: '08:00 -> 09:00' },
    { id: 9, name: '09:00 -> 10:00' },
    { id: 10, name: '10:00 -> 11:00' },
    { id: 11, name: '11:00 -> 12:00' },
    { id: 12, name: '12:00 -> 13:00' },
    { id: 13, name: '13:00 -> 14:00' },
    { id: 14, name: '14:00 -> 15:00' },
    { id: 15, name: '15:00 -> 16:00' },
    { id: 16, name: '16:00 -> 17:00' },
    { id: 17, name: '17:00 -> 18:00' },
    { id: 18, name: '18:00 -> 19:00' },
    { id: 19, name: '19:00 -> 20:00' },
    { id: 20, name: '20:00 -> 21:00' },
    { id: 21, name: '21:00 -> 22:00' },
    { id: 22, name: '22:00 -> 23:00' },
    { id: 23, name: '23:00 -> 00:00' },
  ];
  const dateFilterOptions: OptionsTimeFilter[] = [
    { id: 0, name: '2(Mo)' },
    { id: 1, name: '3(Tu)' },
    { id: 2, name: '4(We)' },
    { id: 3, name: '5(Th)' },
    { id: 4, name: '6(Fr)' },
    { id: 5, name: '7(Sa)' },
    { id: 6, name: 'CN(Su)' },
  ];

  return { timeFilter, dateFilter, dateFilterOptions, timeFilterOptions };
}
