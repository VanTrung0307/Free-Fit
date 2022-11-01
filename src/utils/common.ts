import { EventInput } from '@fullcalendar/common';
import { LatLngBounds, LatLngExpression } from 'leaflet';
import { NominatimAddress, TzVersion, User } from 'models';
import {
  GetConstantTimeFilter,
  OptionsTimeFilter,
  TimeObj,
  TimeObjNum,
  TimeOfDay,
} from 'models/dto/timeFilter';
import { OrderBatch } from '../models/dto/task';

const { timeFilter } = GetConstantTimeFilter();

export const getCurrentUser = () => {
  try {
    const user: User = JSON.parse(localStorage.getItem('user') || '');
    return user;
  } catch (error) {
    return null;
  }
};
export const splitWktToLatLng = (wkt: string) => {
  const start = wkt.indexOf('(');
  const end = wkt.indexOf(')');
  const sub = wkt.substring(start + 2, end);
  const rs = sub.split(' ');
  const latLng: LatLngExpression = [Number(rs[1]), Number(rs[0])];
  return latLng;
};

export const splitPointToLatLng = (wkt: string) => {
  if (wkt === '') return undefined;
  const start = wkt.indexOf('(');
  const end = wkt.indexOf(')');
  const sub = wkt.substring(start + 1, end);
  const rs = sub.split(' ');
  const latLng: LatLngExpression = [Number(rs[1]), Number(rs[0])];
  return latLng;
};

export const splitWktTopPostLatLng = (wkt: string) => {
  const start = wkt.indexOf('(');
  const end = wkt.indexOf(')');
  const sub = wkt.substring(start + 2, end);
  const rs = sub.split(' ');
  const latLng: string = `${rs[0]} ${rs[1]}`;
  return latLng;
};
export const convertBounds = (bounds: LatLngBounds) => {
  const rs =
    `${bounds.getSouthWest().lng} ${bounds.getSouthWest().lat}, ` +
    `${bounds.getNorthWest().lng} ${bounds.getNorthWest().lat}, ` +
    `${bounds.getNorthEast().lng} ${bounds.getNorthEast().lat}, ` +
    `${bounds.getSouthEast().lng} ${bounds.getSouthEast().lat}, ` +
    `${bounds.getSouthWest().lng} ${bounds.getSouthWest().lat}`;
  return rs;
};
export const splitLongString = (s: string, length: number) => {
  if (s.length > length) {
    return `${s.substring(0, length)} ...`;
  }
  return s;
};
export const convertListToBinaryFilter = (range: number, list: OptionsTimeFilter[]) => {
  let rs = '';
  for (let i = 0; i < range; i++) {
    // eslint-disable-next-line no-loop-func
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    if (list.find((x) => x.id === i)) {
      rs += +'1';
    } else {
      rs += +'0';
    }
  }
  return rs;
};
export const convertBinaryFilterToList = (s: string) => {
  const list: number[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === '1') {
      list.push(i);
    }
  }
  return list;
};
export const convertTimeFilter = (s: string) => {
  let start = '';
  const list: TimeObj[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === '1') {
      if (s.charAt(i + 1) === '1') {
        if (start === '') {
          start = timeFilter[i].start;
        }
      } else if (start === '') {
        list.push(timeFilter[i]);
      } else {
        list.push({ start, end: timeFilter[i].end });
        start = '';
      }
    }
  }
  return list;
};
export const getCurrentWeek = () => {
  // let curr = new Date();
  // let firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  // let lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const firstDay = new Date(d.setDate(diff));
  const lastDay = new Date(d.setDate(diff));
  // eslint-disable-next-line no-new
  new Date(lastDay.setDate(lastDay.getDate() + 6));

  // let start = firstDay.toISOString().split('T')[0];
  // let end = lastDay.toISOString().split('T')[0];
  const rs: TimeOfDay = {
    start: firstDay,
    end: lastDay,
  };
  return rs;
};
export const parseDateFilter = (index: number, time: string) => {
  const currentWeek: TimeOfDay = getCurrentWeek();
  const date = new Date(currentWeek.start.setDate(currentWeek.start.getDate() + index));
  return `${date.toISOString().split('T')[0]}T${time}`;
};
export const parseDateFilterDisplay = (s: string) => {
  let start = -1;
  const list: TimeObjNum[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === '1') {
      if (s.charAt(i + 1) === '1') {
        if (start === -1) {
          start = i;
        }
      } else if (start === -1) {
        list.push({ start: i, end: -1 });
      } else {
        list.push({ start, end: i });
        start = -1;
      }
    }
  }
  return list;
};
export const convertTzVersionToEvents = (list: TzVersion[]) => {
  const rs: EventInput[] = [];

  // eslint-disable-next-line array-callback-return
  list.map((e) => {
    const listTimeFilter = convertTimeFilter(e.timeSlot);
    // eslint-disable-next-line array-callback-return
    listTimeFilter.map((el) => {
      for (let i = 0; i < e.dateFilter.length; i++) {
        if (e.dateFilter.charAt(i) === '1') {
          if (e.tzInfo !== undefined) {
            rs.push({
              title: e.tzInfo.name,
              start: parseDateFilter(i, el.start),
              end: parseDateFilter(i, el.end),
              textColor: '#00AB55',
              id: e.tzInfo.tradeZoneVersionId.toString(),
              description: e.description,
              tz: e.tzInfo,
            });
          }
        }
      }
    });
  });
  return rs;
};
export const selectEvent = (list: EventInput[], id: number) => {
  if (id === -1) return null;
  return list.find((x) => x.id === id.toString());
};
export const getAddressDataByLatLngUtils = async (lat: number, lng: number) => {
  const response = await fetch(
    // eslint-disable-next-line prettier/prettier
    `${process.env.REACT_APP_API_NOMINATIM || 'http://3.36.96.192:8080'
    }/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  ); // For demo purposes.
  const data: NominatimAddress = await response.json();
  return data;
};
export const checkNoEvidence = (packageAction: OrderBatch) => {
  const evidence = packageAction.packageActions.reduce(
    (evidence: number, current) =>
      (evidence += current.packageEvidences !== undefined ? current.packageEvidences.length : 0),
    0
  );
  if (evidence === 0) return true;
  return false;
};
// check date time of version is current active
export const checkDateTimeCurrentActive = (time: string, date: string) => {
  const listTime = convertBinaryFilterToList(time);
  const listDate = convertBinaryFilterToList(date);
  const currentDate = new Date();
  const checkDate = listDate.find((x) => x === currentDate.getDay() - 1);
  if (checkDate === undefined) return false;
  const checkTime = listTime.find((x) => x === currentDate.getHours());
  if (checkTime === undefined) return false;
  return true;
};
