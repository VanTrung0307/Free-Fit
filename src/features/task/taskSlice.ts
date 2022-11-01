import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Response, Task, TaskPagingRequest } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface TeamState {
  loading: boolean;
  tasks: Response<Task>;
  filter: TaskPagingRequest;
}
export interface TotalTask {
  distance: number;
  items: number;
}
const initialState: TeamState = {
  loading: false,
  filter: {
    page: 1,
    pageSize: 10,
  },
  tasks: {
    pageNumber: 1,
    pageSize: 10,
    results: [],
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  },
};
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // poi brands
    fetchTaskList(state, action: PayloadAction<TaskPagingRequest>) {
      state.loading = true;
    },
    fetchTaskListSuccess(state, action: PayloadAction<Response<Task>>) {
      state.tasks = action.payload;
      state.loading = false;
    },
    fetchTaskListError(state) {
      toast.error(i18n.t('common.errorText'));
      state.loading = false;
    },
    // filter
    setFilter(state, action: PayloadAction<TaskPagingRequest>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<TaskPagingRequest>) {},
  },
});
// actions
export const taskActions = taskSlice.actions;
// selectors
export const selectLoading = (state: RootState) => state.task.loading;
export const selectTaskList = (state: RootState) => state.task.tasks;
export const selectFilter = (state: RootState) => state.task.filter;
// reducers
const taskReducer = taskSlice.reducer;
export default taskReducer;
