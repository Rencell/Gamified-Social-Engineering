import session from './api'

export interface Authentication {
    username: string;
    email: string;
    password1: string;
    password2: string;
  }
  
  export interface LoginPayload {
    email?: string;
    password: string;
  }
  
const END_POINT = '/auth0/'

const authentication = {
  getUser: (): Promise<any> => session.get(END_POINT + 'user/'),
  login: (data: LoginPayload): Promise<any> => session.post(END_POINT + 'login/', data),
  loginFacebook: ({ access_token }: { access_token: string }): Promise<any> => session.post(END_POINT + 'facebook/', { access_token }),
  loginGoogle: ({ access_token }: { access_token: string }): Promise<any> => session.post(END_POINT + 'google/', { access_token }),
  logout: (): Promise<any> => session.post(END_POINT + 'logout/', {}),
  register: (data: Authentication): Promise<any> =>
    session.post(END_POINT + 'registration/', data),
  confirm_email: (key: string): Promise<any> => session.post(END_POINT + 'registration/verify-email/', {key}),
  setToken(token: string): void {
    session.defaults.headers.common['Authorization'] = `Token ${token}`
  },
  removeToken(): void {
    delete session.defaults.headers.common['Authorization']
  },
}

export default authentication
