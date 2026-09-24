import session from './api'

export interface Lesson {
  lesson_test: number | null
  user: number
  lesson: number
  percentage: number
}

export interface Lesson_test {
  id?: number
  title: string
  slug: string
  image: File | string | undefined
  bg: string
  lesson_order: number | null
  description: string
  objective: string[]
  locked?: boolean
  completed_modules?: number
  total_modules?: number
}

interface LatestLessonStatus {
  user: number
  lesson_test: number
  percentage: number
  module_count: number
  completed_module_count: number
}

const END_POINT = '/api/lessons/'
const USER_END_POINT = '/api/lessons/user-lesson-progress/'

const lessonService = {
  get_all: (): Promise<Lesson[]> => session.get(END_POINT + 'lesson/').then((res) => res.data),
  get_unlocked_lessons: (): Promise<any> => session.get(END_POINT + 'lesson/unlocked/'),
  get_unlocked_modules_from_lessons: (num: number): Promise<any> =>
    session.get(`${END_POINT}lesson/${num}/unlocked-modules/`).then((res) => res.data),
  create_lesson: (module: Partial<Lesson>): Promise<Lesson> =>
    session.post(USER_END_POINT, module).then((res) => res.data),
  get_latest_lesson: (): Promise<LatestLessonStatus> =>
    session.get(END_POINT + 'user-lesson-test-progress/current_lesson/').then((res) => res.data),
  
  // test
  get_all_test: (): Promise<Lesson_test[]> => session.get(END_POINT + 'lesson-test/').then((res) => res.data),
  create_lesson_test: (module: FormData): Promise<Lesson_test> =>
    session.post(END_POINT + 'lesson-test/', module).then((res) => res.data),
  update_lesson_test: (lessonId: number, module: FormData): Promise<Lesson_test> =>
    session.put(END_POINT + 'lesson-test/' + lessonId + '/', module).then((res) => res.data),
  update_lesson_partial_test: (lessonId: number, module: Partial<Lesson_test>): Promise<Lesson_test> =>
    session.patch(END_POINT + 'lesson-test/' + lessonId + '/', module).then((res) => res.data),
  delete_lesson_test: (lessonId: number): Promise<void> =>
    session.delete(END_POINT + `lesson-test/${lessonId}/`).then(() => {}),
  unlock_lesson_test: (lesson_test: number): Promise<void> =>
    session.post(END_POINT + 'user-lesson-test-progress/', {lesson_test}).then(() => {}),
  get_unlocked_lessons_test: (): Promise<any> =>
    session.get(END_POINT + 'lesson-test/unlocked/').then((res) => res.data),
  
}

export default lessonService
