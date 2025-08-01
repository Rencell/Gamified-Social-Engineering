import axios, { type AxiosInstance } from 'axios';

const CSRF_COOKIE_NAME: string = 'csrftoken';
const CSRF_HEADER_NAME: string = 'X-CSRFToken';

const session: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  withCredentials: true,
});

export default session;