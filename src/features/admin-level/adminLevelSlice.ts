import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { District, Province, Ward } from 'models';

export interface AdminLevelState {
  loading: boolean;
  provinceOptions: Province[];
  districtOptions: District[];
  wardOptions: Ward[];
}
const initialState: AdminLevelState = {
  loading: false,
  provinceOptions: [],
  districtOptions: [],
  wardOptions: [],
};
const adminLevelSlice = createSlice({
  name: 'adminLevel',
  initialState,
  reducers: {
    fetchAdminLevelData(state) {
      state.loading = true;
    },
    fetchAdminLevelDataSuccess(state, action: PayloadAction<Province[]>) {
      state.provinceOptions = action.payload;
      state.loading = false;
    },
    fetchAdminLevelDataError(state) {
      state.loading = false;
    },
    provinceChange(state, action: PayloadAction<number>) {
      if (action.payload === 0) {
        state.districtOptions = [];
        state.wardOptions = [];
      }
      if (state.provinceOptions === []) return;
      const province = state.provinceOptions?.find((x) => x.id === action.payload);
      if (province) state.districtOptions = province?.districts;
      else state.districtOptions = [];
    },
    districtChange(state, action: PayloadAction<number>) {
      if (action.payload === 0) {
        state.wardOptions = [];
      }
      if (state.districtOptions === []) return;
      const district = state.districtOptions?.find((x) => x.id === action.payload);
      if (district) state.wardOptions = district?.wards;
      else state.wardOptions = [];
    },
  },
});
// actions
export const adminLevelActions = adminLevelSlice.actions;
// selectors
export const selectProvinceOptions = (state: RootState) => state.adminLevel.provinceOptions;
export const selectDistrictOptions = (state: RootState) => state.adminLevel.districtOptions;
export const selectWardOptions = (state: RootState) => state.adminLevel.wardOptions;
// reducers
const adminLevelReducer = adminLevelSlice.reducer;
export default adminLevelReducer;
