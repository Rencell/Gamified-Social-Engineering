import session from './api'

export interface GoPhish {
    emails_sent : number
    links_clicked : number
    data_submitted : number
    security_score : number
}
export interface GoPhishSMS {
    number_sent : number
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
    type: string
}

export interface GoPhishTotalScore {
    total_emails_sent: number;
    total_links_clicked: number;
    total_data_submitted: number;
    avg_click_rate: number;
    avg_submission_rate: number;
    max_emails_sent: number;
    max_links_clicked: number;
    max_data_submitted: number;
}
export interface GoPhishTotalScoreSms {
    total_sms_sent: number;
    total_links_clicked: number;
    total_data_submitted: number;
    avg_click_rate: number;
    avg_submission_rate: number;
    max_sms_sent: number;
    max_links_clicked: number;
    max_data_submitted: number;
}

const END_POINT = '/api/gophish/'

const gophishService = {
  get_all: (): Promise<GoPhish[]> => 
    session.get(END_POINT + 'gophish_user_score/').then((res) => res.data),
  get_total_score: (): Promise<GoPhishTotalScore> => 
    session.get(END_POINT + 'gophish_user_score/total_score/').then((res) => res.data),
  get_total_score_sms: (): Promise<GoPhishTotalScoreSms> => 
    session.get(END_POINT + 'gophish_user_score/total_score_sms/').then((res) => res.data),
  get_all_sms: (): Promise<GoPhishSMS[]> => 
    session.get(END_POINT + 'gophish_user_score_sms/').then((res) => res.data),
  get_consent: (): Promise<GoPhishConsent> =>
    session.get(END_POINT + 'gophish_consent/').then((res) => res.data[0]),
  get_events: (): Promise<GoPhishEvent> =>
    session.get(END_POINT + 'gophish_events/').then((res) => res.data),
  update_email_consent: (email_consent: boolean): Promise<GoPhishConsent> =>
    session.post(END_POINT + 'gophish_consent/email/', { email_consent }).then((res) => res.data[0]),
  update_phone_consent: (phone_number: string): Promise<GoPhishConsent> =>
    session.post(END_POINT + 'gophish_consent/phone/', { phone_number }).then((res) => res.data[0])
}

export default gophishService
