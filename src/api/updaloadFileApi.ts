import { requestImg } from 'utils/axios';

export const uploadfile = (fileData) =>
  requestImg.post(`/files`, fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
