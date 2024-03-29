import axios from 'axios';
import api from './constant';

const apiDelete = async (jwt, table, id) => {
  if (jwt && table && id) {
    const request = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${jwt}`,
      },
    });

    const response = await request.delete(`${api}${table}/${id}`);
    if (await response) {
      return response;
    }
  }
  return null;
};

export default apiDelete;
