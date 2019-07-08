import axios from 'axios';
import api from './constant';

const apiSignIn = async (username, password) => {
  const data = JSON.stringify({
    username,
    password,
  });

  const request = axios.create({
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  const response = await request.post(`${api}login`, data);
  if (await response) {
    return response;
  }
  return null;
};

export default apiSignIn;
