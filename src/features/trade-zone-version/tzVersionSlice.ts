import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { TzVersion, TzVersionRequest } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';
import {
  checkDateTimeCurrentActive,
  convertBinaryFilterToList,
  convertTzVersionToEvents,
  selectEvent,
} from 'utils/common';

export interface TzVersionState {
  loading: boolean;
  tzVersions: TzVersion[];
  filter: TzVersionRequest;
  storeId: number;
  isOpenModal: boolean;
  selectedEventId: number;
}
const initialState: TzVersionState = {
  loading: false,
  tzVersions: [],
  filter: {
    dateFilter: '1111111',
    timeSlot: '111111111111111111111111',
    groupZoneId: 0,
    storeId: 0,
  },
  storeId: 0,
  isOpenModal: false,
  selectedEventId: -1,
};
const tzVersionSlice = createSlice({
  name: 'tzVersion',
  initialState,
  reducers: {
    // poi brands
    fetchTzVersionList(state, action: PayloadAction<TzVersionRequest>) {
      state.loading = true;
    },
    fetchTzVersionListSuccess(state, action: PayloadAction<TzVersion[]>) {
      state.tzVersions = action.payload;
      state.loading = false;
    },
    fetchTzVersionListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<TzVersionRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<TzVersionRequest>) {},
    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },
    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = -1;
    },
  },
});
// actions
export const tzVersionActions = tzVersionSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.groupZone.loading;
export const selectTzVersionList = (state: RootState) => state.tzVersion.tzVersions;
export const selectFilter = (state: RootState) => state.tzVersion.filter;
export const selectStoreId = (state: RootState) => state.tzVersion.storeId;
export const selectedEventId = (state: RootState) => state.tzVersion.selectedEventId;
export const selectedOpenModal = (state: RootState) => state.tzVersion.isOpenModal;
export const selectTimeFilterSelected = createSelector(selectFilter, (filter) =>
  convertBinaryFilterToList(filter.timeSlot)
);
export const selectDateFilterSelected = createSelector(selectFilter, (filter) =>
  convertBinaryFilterToList(filter.dateFilter)
);

export const selectTzVersionEvents = createSelector(selectTzVersionList, (list) =>
  convertTzVersionToEvents(list?.filter((f) => f.isActive === true))
);

export const selectedEventSelector = createSelector(
  selectTzVersionEvents,
  selectedEventId,
  (list, id) => selectEvent(list, id)
);

export const selectTzVersionOptions = createSelector(selectTzVersionList, (list) =>
  list?.map((el) => ({
    name: el.name,
    id: el.id,
  }))
);

export const selectTzVersionCurrentActive = createSelector(selectTzVersionList, (list) => {
  const newList = list?.filter((x) => x.isActive === true);
  if (list.length === 0) return undefined;
  let rs: any;
  newList.forEach((el) => {
    const checkActive = checkDateTimeCurrentActive(el.timeSlot, el.dateFilter);
    if (checkActive) {
      rs = el;
    }
  });
  return rs;
});
// reducers
const tzVersionReducer = tzVersionSlice.reducer;
export default tzVersionReducer;
