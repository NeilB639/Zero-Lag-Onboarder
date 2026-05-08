import axios from 'axios';

export const http = axios.create({
  timeout: 50_000,
});
