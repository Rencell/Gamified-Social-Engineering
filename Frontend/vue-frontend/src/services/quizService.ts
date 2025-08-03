import session from './api';

export interface Quiz {
    score: number;
    total_questions: number;
    user: number;
    module: number;
}

const END_POINT = "/api/quizzes/quiz-progress/";

const quizService = {
  get_all: (): Promise<Quiz[]> =>
    session.get(END_POINT).then(res => res.data),
  create_quiz: (quiz: Quiz): Promise<Quiz> =>
    session.post(END_POINT, quiz).then(res => res.data),
  get_by_user_and_module: (user: number, module_id: number): Promise<Quiz> =>
    session.get(`/api/quizzes/quiz-progress/module/`, { params: { user, module_id } }).then(res => res.data),
};

export default quizService;