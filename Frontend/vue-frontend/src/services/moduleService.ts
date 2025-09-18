import session from './api';
import type {Quiz} from './quizService';
export interface Module {
  user: number;
  module: number;
}

export interface ModuleTest {
  id: number | null;
  title: string;
  slug: string;
  module_order: number | null;
  final: boolean;
  lesson: number | null;
  unlocks_lesson: number | null;
  locked?: boolean;
  section: number | null;
  accuracy?: number;
  contents_length?: number | null | undefined;
  content_quiz?: number | null | undefined;
  
}

const END_POINT = "/api/modules/";

const moduleService = {
  getAll: (): Promise<Module[]> =>
    session.get(END_POINT).then(res => res.data),
  create_module: (module: Module): Promise<Module> =>
    session.post(END_POINT + 'user-module-progress/', module).then(res => res.data),

  get_all: (): Promise<Module[]> =>
    session.get(END_POINT + 'module-test/').then(res => res.data),
  get_all_test: ( lesson_slug: string ): Promise<ModuleTest[]> =>
    session.get(END_POINT + 'module-test/lesson/', { params: { lesson_slug } }).then(res => res.data),
  get_unlocked_modules_test: (): Promise<any> => session.get(END_POINT + 'module-test/unlocked/').then((res) => res.data),
  delete_module_test: (moduleId: number): Promise<void> =>
    session.delete(END_POINT + `module-test/${moduleId}/`).then(() => {}),
  create_module_test: (module: Partial<ModuleTest>): Promise<ModuleTest> =>
    session.post(END_POINT + 'module-test/', module).then(res => res.data),
  update_module_test: (module: Partial<ModuleTest>): Promise<ModuleTest> =>
    session.put(END_POINT + `module-test/${module.id}/`, module).then(res => res.data), 
  // User

  unlock_module: (data: { module_test: number | null }): Promise<void> =>
    session.post(END_POINT + 'user-module-test-progress/', data).then(() => {}),

};

export default moduleService;