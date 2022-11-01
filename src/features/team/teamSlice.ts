import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { PaginationRequest, Response, Team } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface TeamState {
  loading: boolean;
  teams: Response<Team>;
  filter: PaginationRequest;
}
const initialState: TeamState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
  },
  teams: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    // poi brands
    fetchTeamList(state, action: PayloadAction<PaginationRequest>) {
      state.loading = true;
    },
    fetchTeamListSuccess(state, action: PayloadAction<Response<Team>>) {
      state.teams = action.payload;
      state.loading = false;
    },
    fetchTeamListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<PaginationRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {},
  },
});
// actions
export const teamActions = teamSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.team.loading;
export const selectTeamList = (state: RootState) => state.team.teams;
export const selectTeamsOptions = createSelector(selectTeamList, (teams) =>
  teams?.results?.map((team) => ({
    name: team.name,
    id: team.id,
  }))
);
export const selectFilter = (state: RootState) => state.team.filter;
// reducers
const teamReducer = teamSlice.reducer;
export default teamReducer;
