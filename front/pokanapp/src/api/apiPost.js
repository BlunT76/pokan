import axios from 'axios';
import api from './constant';

const apiPost = async (jwt, table, arr) => {
  if (table && arr) {
    const data = JSON.stringify(arr);
    const request = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${jwt}`,
      },
    });
    const response = await request.post(`${api}${table}`, data);
    if (await response) {
      return response;
    }
  }
  return null;
};

export default apiPost;
