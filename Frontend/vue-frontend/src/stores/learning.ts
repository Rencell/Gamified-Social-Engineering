import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Module, Lesson } from '@/stores/types/learning'
import { lessons as dataLessons } from '@/data/learning'

export const useLearningStore = defineStore('learning', () => {

  // State
  const lessons = ref<Lesson[]>(Object.values(dataLessons))
  const currentLessonId = ref<String | null>(null)
  const selectedModule = ref<Module | null>(null)

  // Getters
  const currentLesson = ()  => {
    if (!lessons.value || !currentLessonId.value) {
      return null
    }
    return lessons.value.find(lesson => lesson.id === currentLessonId.value) || null
  }
  const currentModules = ()  => {
    const lesson = lessons.value?.find(lesson => lesson.id === currentLessonId.value)
    return lesson ? lesson.modules : []
  }

  // Actions

  const loadLessons = (lessonId : string) => {

    const isLesson = lessons.value.find(lesson => lesson.id === lessonId)

    if (!isLesson) {
      console.error(`Lesson with id ${lessonId} not found`)
      return
    }
    currentLessonId.value = lessonId
    selectedModule.value = isLesson.modules[0] || null

  } 

  const setSelectedModule = (module: Module) => {
    selectedModule.value = module
  }
  
  const activateModuleInteraction = () => {
    if (selectedModule.value) {
      selectedModule.value.interactive = true
      console.log(selectedModule.value)
    } else {
      console.error('No module is currently selected.')
    }
  }

  const nextModule = () => {
    if (!selectedModule.value || !currentModules().length) return
    const currentIndex = currentModules().findIndex(m => m.title === selectedModule.value?.title)
    if (currentIndex < currentModules().length - 1) {
      selectedModule.value = currentModules()[currentIndex + 1]
    }
  }

  const previousModule = () => {
    if (!selectedModule.value || !currentModules().length) return
    const currentIndex = currentModules().findIndex(m => m.title === selectedModule.value?.title)
    if (currentIndex > 0) {
      selectedModule.value = currentModules()[currentIndex - 1]
    }
  }

  return {
    lessons,
    currentLessonId,
    selectedModule,
    currentLesson,
    currentModules,
    loadLessons, 
    setSelectedModule,
    activateModuleInteraction,
    previousModule,
    nextModule
  }
})
