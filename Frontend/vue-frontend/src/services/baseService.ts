import session from './api';

const baseService = {
    get: <T>(url: string): Promise<T> => session.get(url).then(res => res.data),
    post: <T>(url: string, data: any): Promise<T> => session.post(url, data).then(res => res.data),
    put: <T>(url: string, data: any): Promise<T> => session.put(url, data).then(res => res.data),
    delete: <T>(url: string): Promise<T> => session.delete(url).then(res => res.data),
};


type ID = number | string;


export function serviceFactory<T>(basePath: string) {
  return {
    list: (): Promise<T[]> => baseService.get<T[]>(basePath),
    get: (id: ID): Promise<T> => baseService.get<T>(`${basePath}${id}/`),
    create: (data: any): Promise<T> => baseService.post<T>(basePath, data),
    update: (id: ID, data: any): Promise<T> => baseService.put<T>(`${basePath}${id}/`, data),
    remove: (id: ID): Promise<T> => baseService.delete<T>(`${basePath}${id}/`),
  };
}
