import axios from 'axios';

const client = axios.create({
  baseURL: 'https://saavn.sumit.co',
  timeout: 10000,
});

export default client;