import session from './api';

export interface Module {
  id: number;
  title: string;
  lesson: number;
  content: string;
  order: number;
}

const END_POINT = "/modules/";

const moduleService = {
  getAll: (): Promise<Module[]> =>
    session.get(END_POINT).then(res => res.data),
};

export default moduleService;