import { defineStore } from 'pinia'
import { lessons } from '@/data/lessons'
import type { Module, Lesson } from '@/stores/types/learning'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    lessons: lessons,
    currentLessonId: null as string | null,
    selectedModule: null as Module | null
  }),
  getters: {
    currentLesson: (state): Lesson | null => {
      if (!state.currentLessonId) return null
      return state.lessons[state.currentLessonId]
    },
    currentModules: (state): Module[] => {
      const lesson = state.lessons[state.currentLessonId as keyof typeof state.lessons]

      if (!lesson) return []
      
      return lesson?.modules
    }
  },
  actions: {
    loadLesson(lessonId: string) {
      if (!this.lessons[lessonId]) {
        console.error(`Lesson with id '${lessonId}' not found.`)
        return
      }
      this.currentLessonId = lessonId
      this.selectedModule = this.lessons[lessonId].modules[0] || null
    },

    setSelectedModule(module: Module) {
      this.selectedModule = module
    },

    nextModule() {
      const modules = this.currentModules
      const currentIndex = modules.findIndex((m) => m.title === this.selectedModule?.title)
      if (currentIndex !== -1 && currentIndex < modules.length - 1) {
        this.selectedModule = modules[currentIndex + 1]
      }
    },

    previousModule() {
      const modules = this.currentModules
      const currentIndex = modules.findIndex((m) => m.title === this.selectedModule?.title)
      if (currentIndex > 0) {
        this.selectedModule = modules[currentIndex - 1]
      }
    }
  }
})

