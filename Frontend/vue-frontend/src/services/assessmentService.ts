import { get } from '@vueuse/core'
import session from './api'

export interface Option {
    id: number
    question: number | null
    text: string
    is_correct: boolean
    order?: number | null
    image?: string | null
}

export interface Question {
    id: number
    question_type: string
    text: string
    image?: string | File
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
    question_count?: number | null
    props?: any | null
    exp_points?: number | null
    coin_points?: number | null
    difficulty_level?: string
    instructions?: string[] | null
}

export interface AssessmentSession {
    session_id: string;
    status: string | null;
    started_at: string | null;
    score: number | null;
    assessment: Assessment | null;
    current_question_index: number | null;
    user: string | null;
}
const END_POINT = '/api/assessment/'

const assessmentService = {
    get_all: (): Promise<Assessment[]> => session.get(END_POINT + 'assessments/').then((res) => res.data),
    detail: (slug: string): Promise<Assessment> => session.get(`${END_POINT}assessments/${slug}/`).then((res) => res.data),
    create: (data: FormData): Promise<Assessment> => session.post(END_POINT + 'assessments/', data).then((res) => res.data),
    patch: (id: number, data: FormData): Promise<Assessment> => session.patch(`${END_POINT}assessments/${id}/`, data).then((res) => res.data),
    initialize_assessment: (assessment_id: number): Promise<AssessmentSession> => session.post(`${END_POINT}session/start_session/`, { assessment_id }).then((res) => res.data),
    current_session: (session_id: string): Promise<AssessmentSession> => session.get(`${END_POINT}session/get_session/`, {params: { session_id }}).then((res) => res.data),
    get_questions: (assessment_id: number): Promise<Question[]> => session.get(`${END_POINT}question/`, { params: { assessment: assessment_id }}).then((res) => res.data),
}

export default assessmentService
