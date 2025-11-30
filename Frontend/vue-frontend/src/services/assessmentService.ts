import { get } from '@vueuse/core'
import session from './api'

export interface Option {
    id: number
    question: number | null
    text: string
    is_correct: boolean
    order?: number | null
    image?: string | null | File
}

export interface Question {
    id: number
    question_type: string
    text: string
    image?: string | File | null
    order: number
    assessment: number
    options: Option[]
}

export interface Assessment {
    id: number
    name: string
    slug: string
    lesson: number
    description?: string
    image?: string | File
    bg?: string
    duration?: number | 0
    question_count?: number | 0
    props?: any | null
    exp_points?: number | 0
    coin_points?: number | 0
    passing_rate?: number | 0
    difficulty_level?: string
    instructions?: string[] | null
}

export interface AssessmentSession {
    session_id: string;
    status: string | null;
    started_at: string | Date| number;
    score: number | null;
    assessment: Assessment | null;
    current_question_index: number | null;
    completed_questions: number[] | null  | undefined;
    completed_at: string | null;
    user: string | null;
}

export interface AssessmentAnswer {
    id: number;
    session: number;
    question: Question;
    selected_option: Option;
    is_correct: boolean;
}

export interface AssessmentReward {
    id: number;
    rewarded: boolean;
    rewarded_at: string | null;
    user: number;
    assessment: number;
}

const END_POINT = '/api/assessment/'

const assessmentService = {
    get_all: (): Promise<Assessment[]> => session.get(END_POINT + 'assessments/').then((res) => res.data),
    detail: (slug: string): Promise<Assessment> => session.get(`${END_POINT}assessments/${slug}/`).then((res) => res.data),
    create: (data: FormData): Promise<Assessment> => session.post(END_POINT + 'assessments/', data).then((res) => res.data),
    patch: (id: number, data: FormData): Promise<Assessment> => session.patch(`${END_POINT}assessments/${id}/`, data).then((res) => res.data),
    
    fetch_completed_assessment: (assessment_id: number): Promise<AssessmentSession> => session.post(`${END_POINT}session/has_completed/`, { assessment_id }).then((res) => res.data),
    resume_assessment: (assessment_id: number): Promise<AssessmentSession> => session.post(`${END_POINT}session/continute_session/`, { assessment_id }).then((res) => res.data),
    initialize_assessment: (assessment_id: number): Promise<AssessmentSession> => session.post(`${END_POINT}session/start_session/`, { assessment_id }).then((res) => res.data),
    timeout_assessment: (session_id: string): Promise<AssessmentSession> => session.post(`${END_POINT}session/timeout_session/`, { session_id }).then((res) => res.data),
    current_session: (session_id: string): Promise<AssessmentSession> => session.get(`${END_POINT}session/get_session/`, {params: { session_id }}).then((res) => res.data),
    assessment_report: (assessment_id: string): Promise<AssessmentSession[]> => session.post(`${END_POINT}session/get_report_assessments/`, { assessment_id }).then((res) => res.data),
    
    save_answer: (data: { session_id: string; question_id: number;  option_id: number | null; }): Promise<any> => session.post(`${END_POINT}session-answer/`, data).then((res) => res.data),
    patchOption: (id: number, data: FormData): Promise<Option> => session.patch(`${END_POINT}option/${id}/`, data).then((res) => res.data),
    createOption: (data: FormData): Promise<Option> => session.post(`${END_POINT}option/`, data).then((res) => res.data),
    deleteOption: (id: number): Promise<void> => session.delete(`${END_POINT}option/${id}/`).then(() => {}),

    patchQuestion: (id: number, data: FormData): Promise<Question> => session.patch(`${END_POINT}question/${id}/`, data).then((res) => res.data),
    get_questions: (assessment_id: number | string): Promise<Question[]> => session.get(`${END_POINT}question/`, { params: { assessment: assessment_id }}).then((res) => res.data),
    createQuestion: (data: Question): Promise<Question> => session.post(`${END_POINT}question/`, data).then((res) => res.data),
    deleteQuestion: (id: number): Promise<void> => session.delete(`${END_POINT}question/${id}/`).then(() => {}),
    
    fetch_assessment_results: (session_id: string): Promise<AssessmentAnswer[]> => session.get(`${END_POINT}session-answer/get_answers_for_session/`, { params: { session_id }}).then((res) => res.data),
    fetch_assessment_rewards: (assessment_id: number): Promise<AssessmentReward> => session.get(`${END_POINT}assessment-complete/get_assessment/`, { params: { assessment_id }}).then((res) => res.data),
    assessment_claim_reward: (assessment_id: number): Promise<AssessmentReward> => session.get(`${END_POINT}assessment-complete/reward_claimed/`, { params: { assessment_id }}).then((res) => res.data),

}

export default assessmentService
