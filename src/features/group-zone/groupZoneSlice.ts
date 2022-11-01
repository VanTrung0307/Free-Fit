import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { FreeZone } from 'models/dto/freeZone';
import { GroupZone } from 'models/dto/groupZone';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface GroupZoneState {
  loading: boolean;
  groupZones: GroupZone;
  freeZones: FreeZone;
}
const initialState: GroupZoneState = {
  loading: false,
  groupZones: {
    features: [],
    type: '',
  },
  freeZones: {
    features: [],
    type: '',
  },
};
const groupZoneSlice = createSlice({
  name: 'groupZone',
  initialState,
  reducers: {
    // poi brands
    fetchGroupZoneList(state) {
      state.loading = true;
    },
    fetchGroupZoneListSuccess(state, action: PayloadAction<GroupZone>) {
      state.groupZones = action.payload;
      state.loading = false;
    },
    fetchGroupZoneListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    fetchFreeZoneList(state, action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchFreeZoneSuccess(state, action: PayloadAction<FreeZone>) {
      state.freeZones = action.payload;
      state.loading = false;
    },
    fetchFreeZoneError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
  },
});
// actions
export const groupZoneActions = groupZoneSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.groupZone.loading;
export const selectGroupZoneList = (state: RootState) => state.groupZone.groupZones;
export const selectFreeZoneList = (state: RootState) => state.groupZone.freeZones;

export const selectGroupZoneOptions = createSelector(selectGroupZoneList, (gzs) =>
  gzs?.features?.map((gz) => ({
    name: gz.properties.f1,
    id: gz.properties.f4,
  }))
);
export const selectFreeZoneOptions = createSelector(selectFreeZoneList, (fzs) =>
  fzs?.features?.map((fz) => ({
    name: fz.properties.f2,
    id: fz.properties.f3,
  }))
);

// reducers
const groupZoneReducer = groupZoneSlice.reducer;
export default groupZoneReducer;
