import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { AuthRequest, User } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface AuthState {
  isLoggedIn: boolean;
  logging?: boolean;
  currentUser?: User;
}
const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  currentUser: undefined,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthRequest>) {
      state.logging = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      toast.success(i18n.t('login.loginSuccess'));
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
      // eslint-disable-next-line no-restricted-globals
      location.href = '/dashboard';
    },
    loginFailed(state, action: PayloadAction<string>) {
      toast.error(i18n.t('login.userPassInvalid'));
      state.logging = false;
    },
    logout(state) {
      toast.success(i18n.t('login.logoutSuccess'));
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
  },
});
export const authAction = authSlice.actions;
export const selectAuthLoading = (state: RootState) => state.auth.logging;
const authReducer = authSlice.reducer;
export default authReducer;
