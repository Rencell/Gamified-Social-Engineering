import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Module, Lesson } from '@/stores/types/learning'
import { lessons as dataLessons } from '@/data/learning'
import { LessonService, ModuleService } from '@/services'
import { useAuthStore } from './auth'

export const useLearningStore = defineStore('learning', () => {
  // State
  const authStore = useAuthStore()
  const lessons = ref<Lesson[]>(Object.values(dataLessons))
  const modules = ref<Module[]>([])
  const currentModuleId = ref(0)
  const currentLessonId = ref<string | null>(null)
  const selectedModule = ref<Module | null>(null)

  // Getters
  const currentLesson = () => {
    if (!lessons.value || !currentLessonId.value) {
      return null
    }
    return lessons.value.find((lesson) => lesson.id === currentLessonId.value) || null
  }

  const isFinalQuizUnlocked = computed(() => {
    const requiredModules = modules.value.filter((module) => !module.final)
    const completedModules = requiredModules.filter((module) => module.interactive)

    return completedModules.length === requiredModules.length
  })

  const completionPercentage = computed(() => {

    const total = modules.value.length;
    const completed = modules.value.filter(m => m.interactive).length;
  
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  // Actions
  const loadModules = () => {
    const lesson = lessons.value?.find((lesson) => lesson.id === currentLessonId.value)
    currentModuleId.value = lesson ? (lesson.lesson_order ?? 0) : 0
    modules.value = lesson ? lesson.modules : []
  }

  const fetchModules = async () => {
    try {
      const unlockedModules = await LessonService.get_unlocked_modules_from_lessons(
        currentModuleId.value,
      )
      modules.value.forEach((module) => {
        module.interactive = unlockedModules.includes(module.id.toLowerCase())
      })
    } catch (error) {
      console.error('Failed to fetch unlocked modules:', error)
    }
  }

  const fetchLessons = async () => {
    try {
      const unlockedIds = await LessonService.get_unlocked_lessons()

      // Dynamically update the locked status
      lessons.value.forEach((lesson) => {
        const data = lesson.id.toLowerCase()
        lesson.locked = !unlockedIds.data.includes(data)
      })
    } catch (error) {
      console.error('Failed to load unlocked lessons:', error)
    }
  }

  const loadLessons = (lessonId: string) => {
    const isLesson = lessons.value.find((lesson) => lesson.id === lessonId)

    if (!isLesson) {
      console.error(`Lesson with id ${lessonId} not found`)
      return
    }
    currentLessonId.value = lessonId

    if(selectedModule.value == undefined)
      selectedModule.value = isLesson.modules[0] || null
  }

  const setSelectedModule = (module: Module) => {

    if (currentLesson()?.locked){
      console.warn('Current lesson is locked. Please unlock it first.')
      return;
    }
    
    if (module.final && !isFinalQuizUnlocked.value) {
      console.warn('Final Quiz is locked. Complete all modules first.');
      return;
    }

    selectedModule.value = module
  }

  const activateModuleInteraction = async () => {
    try {
      if (selectedModule.value) {
        const lesson = lessons.value?.find(
          (lesson) => lesson.lesson_order === selectedModule.value?.unlocksLessonId,
        )
        if (lesson) lesson.locked = false
        if (selectedModule.value.interactive) return // Module is already interactive

        selectedModule.value.interactive = true
        await ModuleService.create_module({
          user: authStore.User?.pk,
          module: selectedModule.value.module_order ?? 1,
        })
      } else {
        console.error('No module is currently selected.')
      }
    } catch (error) {
      console.error('Failed to activate module interaction:', error)
    }
  }

  const nextModule = () => {
    if (!selectedModule.value || !modules.value.length) return
    const currentIndex = modules.value.findIndex((m) => m.title === selectedModule.value?.title)
    if (currentIndex < modules.value.length - 1) {
      selectedModule.value = modules.value[currentIndex + 1]
    }
  }

  const previousModule = () => {
    if (!selectedModule.value || !modules.value.length) return
    const currentIndex = modules.value.findIndex((m) => m.title === selectedModule.value?.title)
    if (currentIndex > 0) {
      selectedModule.value = modules.value[currentIndex - 1]
    }
  }

  return {
    lessons,
    modules,
    currentLessonId,
    selectedModule,
    isFinalQuizUnlocked,
    completionPercentage,
    fetchLessons,
    fetchModules,
    currentLesson,
    loadLessons,
    loadModules,
    setSelectedModule,
    activateModuleInteraction,
    previousModule,
    nextModule,
  }
})
