import session from './api'

export interface level {
    number: number
    name: string
    xp_required: number
    rank: number
}

const END_POINT = '/api/levels/'

const levelService = {
  get_all: (): Promise<level> => 
    session.get(END_POINT + 'level/').then((res) => res.data)
}

export default levelService
