import axios from 'axios';
import api from './constant';

const apiPut = async (jwt, table, arr, id) => {
  if (jwt && table && arr && id) {
    const data = JSON.stringify(arr);
    const request = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${jwt}`,
      },
    });

    const response = await request.put(`${api}${table}/${id}`, data);
    if (await response) {
      return response;
    }
    return null;
  }
  return {
    data: {
      code: 0,
      message: 'Bad request',
      status: 'error',
    },
  };
};

export default apiPut;
