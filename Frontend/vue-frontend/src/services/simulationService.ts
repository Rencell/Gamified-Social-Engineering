import session from './api'

export interface GoPhish {
    emails_sent : number
    links_clicked : number
    data_submitted : number
    security_score : number
}

const END_POINT = '/api/gophish/'

const gophishService = {
  get_all: (): Promise<GoPhish[]> => 
    session.get(END_POINT + 'gophish_user_score/').then((res) => res.data)

}

export default gophishService
