export interface Module {
  title: string
  component: object
  interactive?: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string
  modules: Module[]
}
