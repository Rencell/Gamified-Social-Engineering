import type { QuizType } from '@/components/learn/QuizUI/QuizRegistry'
import session from './api'

export interface ContentParent {
    content_order: number
    modules: number
}

export interface Content {
    id: number
    type: string
    props: Record<string, any> 
    item_order: number
    content: number
    parent: number
    children?: Content[]
}

export interface ContentImage {
    content_item: number
    image: string
}
export interface ContentQuizImage {
    content_quiz: number
    image: string
}

export interface QuizQuestion {
    id: number;
    type: QuizType;
    props: Record<string, any>; 
    quiz_limit?: number;
    pass_rate?: number;
}


const END_POINT = '/api/contents/'

const contentService = {
    get_all: (): Promise<Content[]> => session.get(END_POINT + 'content-items/').then((res) => res.data),
    get_contentitems_by_parent: (parentId: number): Promise<Content[]> => session.get(END_POINT + `content/${parentId}/list-content-items/`).then((res) => res.data),
    create: (data: Content): Promise<Content> => session.post(END_POINT + 'content-items/', data).then((res) => res.data),
    deleteMultiple: (ids: number[]): Promise<void> => session.delete(END_POINT + 'content-items/batch-delete/', { data: { ids } }),
    patch: (id: number, data: Partial<Content>): Promise<Content> => session.patch(END_POINT + `content-items/${id}/`, data).then((res) => res.data),
    uploadImage: (formData: FormData): Promise<ContentImage> => session.post(END_POINT + 'content-image/', formData, {
    }).then((res) => res.data),

    get_contents_by_module: (moduleId: number): Promise<Content[]> => session.get(`/api/modules/module-test/${moduleId}/list-contents/`).then((res) => res.data),

    // Content
    delete: (id: number): Promise<void> => session.delete(END_POINT + `content/${id}/`),
    create_content: (data: { modules: number }): Promise<Content> => session.post(END_POINT + 'content/', data).then((res) => res.data),
    patch_content: (id: number, data: Partial<ContentParent>): Promise<ContentParent> => session.patch(END_POINT + `content/${id}/`, data).then((res) => res.data),
    // Quiz
    get_quizzes : (moduleId: number): Promise<QuizQuestion> => session.get(END_POINT + 'content-quiz/by-module/', {params: {moduleId}}).then((res) => res.data),
    update_quiz: (quizId: number, data: QuizQuestion): Promise<QuizQuestion> => session.put(END_POINT + `content-quiz/${quizId}/`, data).then((res) => res.data),
    uploadQuizImage: (formData: FormData): Promise<ContentQuizImage> => session.post(END_POINT + 'content-quiz-image/', formData, {
    }).then((res) => res.data),
}

export default contentService
