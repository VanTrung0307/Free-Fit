import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Agent, AgentPagingRequest, Response } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface AgentState {
  loading: boolean;
  agents: Response<Agent>;
  filter: AgentPagingRequest;
}
const initialState: AgentState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
  },
  agents: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const agentSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    // poi brands
    fetchAgentList(state, action: PayloadAction<AgentPagingRequest>) {
      state.loading = true;
    },
    fetchAgentListSuccess(state, action: PayloadAction<Response<Agent>>) {
      state.agents = action.payload;
      state.loading = false;
    },
    fetchAgentListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<AgentPagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<AgentPagingRequest>) {},
  },
});
// actions
export const agentActions = agentSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.agent.loading;
export const selectAgentList = (state: RootState) => state.agent.agents;
export const selectAgentOptions = createSelector(selectAgentList, (agents) =>
  agents?.results?.map((agent) => ({
    name: agent.firstName,
    id: agent.id,
  }))
);
export const selectFilter = (state: RootState) => state.agent.filter;
// reducers
const agentReducer = agentSlice.reducer;
export default agentReducer;
