export interface Module {
  id: string
  title: string
  component: object
  module_order?: number
  interactive?: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string,
  lesson_order?: number
  image?: string
  bg?: string
  locked?: boolean
  modules: Module[]
}
