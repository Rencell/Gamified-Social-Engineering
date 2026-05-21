import session from './api'

const END_POINT = '/api/vishing/'

const vishingService = {
    send_score: (status: 'GAVE_INFORMATION' | 'REFUSED' | 'UNAUDIBLE'): Promise<Streak> =>
        session.post(END_POINT + 'score/', { status }).then((res) => res.data),
}
  
export default vishingService
