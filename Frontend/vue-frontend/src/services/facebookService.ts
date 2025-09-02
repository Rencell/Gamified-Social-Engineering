import axios, { type AxiosInstance } from 'axios'

export const handleLoginWithFacebook = (accessToken: string, authToken: { value: string | null }) => {
  axios
    .post('http://localhost:8000/auth0/facebook/', {
      access_token: accessToken,
    })
    .then((res) => {
      console.log('Django response:', res.data)
      if (res.data.key) {
        localStorage.setItem('authToken', res.data.key)
        authToken.value = res.data.key
        alert('Login successful!')
      }
    })
    .catch((err) => {
      console.error('Login error:', err.response?.data || err.message)
    })
}
