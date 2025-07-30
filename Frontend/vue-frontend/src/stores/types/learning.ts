export interface Module {
  title: string
  component: object
  interactive?: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string,
  image?: string
  bg?: string
  locked?: boolean
  modules: Module[]
}
