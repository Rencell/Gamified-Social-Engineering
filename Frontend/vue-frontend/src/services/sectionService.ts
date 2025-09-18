import session from './api';
import type { Module, ModuleTest } from './moduleService';
export interface Section {
    id: number;
    name: string;
    description: string;
    lesson: number;
    modules: ModuleTest[];
}

const END_POINT = "/api/sections/section/";

const quizService = {
    get_all: (): Promise<Section[]> =>
        session.get(END_POINT).then(res => res.data),
    get_sections: (id: number): Promise<Section[]> =>
        session.get(`/api/lessons/lesson-test/${id}/section/`).then(res => res.data),
    create_section: (data: Partial<Section>): Promise<Section> =>
        session.post(END_POINT, data).then(res => res.data),
    update_section: (data: Partial<Section>): Promise<Section> =>
        session.put(END_POINT + `${data.id}/`, data).then(res => res.data),
    delete_section: (sectionId: number): Promise<void> =>
        session.delete(END_POINT + `${sectionId}/`).then(() => {}),
};

export default quizService;