import session from './api';

export interface Quiz {
  id: number;
    score: number;
    total_questions: number;
    user: number;
    module: number;
    time_spent: number; // time spent in seconds
    attempt_number: number;
    accuracy: number;
}

const END_POINT = "/api/quizzes/quiz-progress/";

const quizService = {
  get_all: (): Promise<Quiz[]> =>
    session.get(END_POINT).then(res => res.data),
  create_quiz: (quiz: Quiz): Promise<Quiz> =>
    session.post(END_POINT, quiz).then(res => res.data),
  get_by_user_and_module: (user: number, module_id: number): Promise<Quiz> =>
    session.get(`/api/quizzes/quiz-progress/module/`, { params: { user, module_id } }).then(res => res.data),
  get_by_ids: (ids: number[]): Promise<Quiz[]> =>
    session.post(END_POINT + 'process-ids/', { ids }).then(res => res.data),
  patch: (id: number, quiz: Partial<Quiz>): Promise<Quiz> =>
    session.patch(END_POINT + id + '/', quiz).then(res => res.data),
};

export default quizService;