import session from './api';

export interface Lesson {
  id: number;
  name: string;
}

const END_POINT = "/lessons/";

const lessonService = {
  getAll: (): Promise<Lesson[]> =>
    session.get(END_POINT + 'lesson/').then(res => res.data),
};

export default lessonService;