import session from './api'

export interface Lesson {
  id: number
  name: string
}

const END_POINT = '/api/lessons/'

const lessonService = {
  get_all: (): Promise<Lesson[]> => session.get(END_POINT + 'lesson/').then((res) => res.data),
  get_unlocked_lessons: (): Promise<any> => session.get(END_POINT + 'lesson/unlocked/'),
}

export default lessonService
