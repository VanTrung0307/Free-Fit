import { AuthRequest, User } from 'models';
import axiosClient from './axiosClient';

const authApi = {
  authUsernamePass(data: AuthRequest): Promise<string> {
    const url = '/accounts/authenticate-username-pass';
    return axiosClient.post(url, data);
  },
  getMe(id: string): Promise<User> {
    const url = `/accounts/me/${id}`;
    return axiosClient.get(url);
  },
};
export default authApi;
