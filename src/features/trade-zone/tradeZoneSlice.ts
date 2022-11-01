import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Response, TradeZone, TradeZonePagingRequest } from 'models';
import { FreeZone } from 'models/dto/freeZone';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface TradeZoneState {
  loading: boolean;
  response: Response<TradeZone>;
  filter: TradeZonePagingRequest;
  freeZones: FreeZone;
}
export interface FreeZonesRequest {
  type: number;
  tzVersionId: number;
  tzId: number;
}
const initialState: TradeZoneState = {
  loading: false,
  response: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
  filter: {
    page: 1,
    pageSize: 10,
  },
  freeZones: {
    features: [],
    type: '',
  },
};
export interface FreeZoneTzVersionRequest {
  id: number;
  tzId: number;
}
const tradeZoneSlice = createSlice({
  name: 'tradeZone',
  initialState,
  reducers: {
    // poi brands
    fetchTradeZoneList(state, action: PayloadAction<TradeZonePagingRequest>) {
      state.loading = true;
    },
    fetchTradeZoneListSuccess(state, action: PayloadAction<Response<TradeZone>>) {
      state.response = action.payload;
      state.loading = false;
    },
    fetchTradeZoneListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<TradeZonePagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<TradeZonePagingRequest>) {},
    fetchFreeZoneList(state, action: PayloadAction<FreeZonesRequest>) {
      state.loading = true;
    },
    fetchFreeZoneSuccess(state, action: PayloadAction<FreeZone>) {
      state.freeZones = action.payload;
      if (action.payload.features.length === 0) {
        toast.warning(i18n.t('tz.zonesEmpty'));
      }
      state.loading = false;
    },
    fetchFreeZoneError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
  },
});
// actions
export const tradeZoneActions = tradeZoneSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.tradeZone.loading;
export const selectTradeZoneList = (state: RootState) => state.tradeZone.response;
export const selectFilter = (state: RootState) => state.tradeZone.filter;
export const selectFreeZoneList = (state: RootState) => state.tradeZone.freeZones;
export const selectFreeZoneOptions = createSelector(selectFreeZoneList, (fzs) =>
  fzs?.features?.map((fz) => ({
    name: fz.properties.f2,
    id: fz.properties.f3,
  }))
);

// reducers
const tradeZoneReducer = tradeZoneSlice.reducer;
export default tradeZoneReducer;
