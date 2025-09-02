import axios, { type AxiosInstance } from 'axios';

const CSRF_COOKIE_NAME: string = 'csrftoken';
const CSRF_HEADER_NAME: string = 'X-CSRFToken';

const session: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://gamified-social-engineering.onrender.com"
    : "http://localhost:8000",
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  withCredentials: true,
});

export default session;