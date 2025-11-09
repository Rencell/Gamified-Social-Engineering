import session from './api'

export interface GoPhish {
    emails_sent : number
    links_clicked : number
    data_submitted : number
    security_score : number
}

export interface GoPhishConsent {
    email_consent: boolean
    phone_consent: boolean
}

export interface GoPhishEvent {
    id: number
    received_at: string
    message: string
    details: string
}

const END_POINT = '/api/gophish/'

const gophishService = {
  get_all: (): Promise<GoPhish[]> => 
    session.get(END_POINT + 'gophish_user_score/').then((res) => res.data),
  get_consent: (): Promise<GoPhishConsent> =>
    session.get(END_POINT + 'gophish_consent/').then((res) => res.data[0]),
  get_events: (): Promise<GoPhishEvent> =>
    session.get(END_POINT + 'gophish_events/').then((res) => res.data),
  update_email_consent: (email_consent: boolean): Promise<GoPhishConsent> =>
    session.post(END_POINT + 'gophish_consent/email/', { email_consent }).then((res) => res.data[0])
  
}

export default gophishService
