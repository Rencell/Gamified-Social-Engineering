import session from './api'

export interface Lesson {
  user: number
  lesson: number
}

const END_POINT = '/api/lessons/'

const lessonService = {
  get_all: (): Promise<Lesson[]> => session.get(END_POINT + 'lesson/').then((res) => res.data),
  get_unlocked_lessons: (): Promise<any> => session.get(END_POINT + 'lesson/unlocked/'),
  get_unlocked_modules_from_lessons: (num: number): Promise<any> =>
    session.get(`${END_POINT}lesson/${num}/unlocked-modules/`).then((res) => res.data),
  create_lesson: (module: Lesson): Promise<Lesson> =>
    session.post(END_POINT + 'user-lesson-progress/', module).then((res) => res.data),
}

export default lessonService
