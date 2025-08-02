import session from './api';

export interface Module {
  user: number;
  module: number;
}

const END_POINT = "/api/modules/";

const moduleService = {
  getAll: (): Promise<Module[]> =>
    session.get(END_POINT).then(res => res.data),
  create_module: (module: Module): Promise<Module> =>
    session.post(END_POINT + 'user-module-progress/', module).then(res => res.data),
};

export default moduleService;