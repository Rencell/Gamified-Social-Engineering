import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Module, Lesson } from '@/stores/types/learning'
import { lessons as dataLessons } from '@/data/learning'
import { LessonService, ModuleService } from '@/services'
import { useAuthStore } from './auth'
import { BadgeService } from '@/services'
import { useStreakStore } from './pageStreak'
export const useLearningStore = defineStore('learning', () => {
  // State
  const streakStore = useStreakStore();
  const authStore = useAuthStore()
  const lessons = ref<Lesson[]>(Object.values(dataLessons))
  const latestLesson = ref<Lesson[] | null>([])
  const latestPercentageLesson = ref(0)
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
    const total = modules.value.length
    const completed = modules.value.filter((m) => m.interactive).length

    return total > 0 ? Math.round((completed / total) * 100) : 0
  })
  
  const latestModuleUnlockedCount = computed(() => {
    if (!latestLesson.value || latestLesson.value.length === 0) return 0;

    loadLessons(latestLesson?.value[0]?.id);
    loadModules()
    fetchModules();
    return modules.value.filter((m) => m.interactive).length;
  });
  // Actions

  //  ------------- LESSONS -------------
  const updateLessons = async() => {
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
  
  const fetchLessons = async () => {
    if (lessons.value.every((lesson) => !lesson.locked)) {
      console.log('All lessons are already unlocked. Skipping fetch.')
      return
    }

    await updateLessons()
  }

  const loadLessons = (lessonId: string) => {
    const isLesson = lessons.value.find((lesson) => lesson.id === lessonId)
    

    if (!isLesson) {
      console.error(`Lesson with id ${lessonId} not found`)
      return
    }
    currentLessonId.value = lessonId

    if (selectedModule.value == undefined) selectedModule.value = isLesson.modules[0] || null
  }

  const fetchLatestLesson = async () => {
    if (latestLesson.value && latestLesson.value.length > 0) {
      console.log('Latest lesson already fetched:', latestLesson.value)
      return
    }

    try {
      const data = await LessonService.get_latest_lesson()
      latestPercentageLesson.value = data.percentage
      // const foundLesson = lessons.value?.find((lesson) => lesson.lesson_order === data.lesson)
      // latestLesson.value = foundLesson ? [foundLesson] : null

      console.log('Latest lesson fetched:', latestLesson.value)
    } catch (error) {
      console.error('Failed to fetch unlocked modules:', error)
    }
  }

  //  ------------- MODULES -------------
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

  const loadModules = () => {
    if(lessons.value.length === 0) return

    const lesson = lessons.value.find((lesson) => lesson.id === currentLessonId.value)
    currentModuleId.value = lesson ? (lesson.lesson_order ?? 0) : 0
    modules.value = lesson ? lesson.modules : []
  }


   //  ------------- TRIGGER -------------
  const setSelectedModule = (module: Module) => {
    selectedModule.value = module
    if (currentLesson()?.locked) {
      console.warn('Current lesson is locked. Please unlock it first.')
      return
    }
    
    if (module.final && !isFinalQuizUnlocked.value) {
      console.warn('Final Quiz is locked. Complete all modules first.')
      return
    }
    
  }

  const activateModuleInteraction = async () => {
    
    const mod = selectedModule.value
    if (!mod) {
      console.error('No module selected for interaction.')
      return
    }
    
    if (mod.interactive) return
    const lesson = lessons.value?.find(
      (l) => l.lesson_order === mod.unlocksLessonId,
    )
    try {
      if (mod.final && lesson?.id) {
        await unlockNextLesson(lesson.id as string)
      }
      await unlockNextModule(mod.module_order as number)
      await updateLessons()
      if (lesson) lesson.locked = false
      streakStore.postStreak();
      mod.interactive = true
    } catch (error) {
      
      console.error('Failed to activate module interaction:', error)
    }
  }

  const unlockNextLesson = async (lessonId: string) => {
    if (currentLessonId.value !== lessonId) {
      await BadgeService.create(currentLesson()?.lesson_order ?? 0)

      await LessonService.create_lesson({
        user: authStore.User?.pk,
        lesson: selectedModule.value?.unlocksLessonId ?? 0,
        percentage: 0, // Assuming initial percentage is 0
      })
    }
  }

  const unlockNextModule = async (moduleId: number) => {
    await ModuleService.create_module({
      user: authStore.User?.pk,
      module: moduleId,
    })
  }

  const nextModule = () => {
    if (!selectedModule.value || !modules.value.length) return
    const currentIndex = modules.value.findIndex((m) => m.title === selectedModule.value?.title)
    if (currentIndex < modules.value.length - 1) {
      setSelectedModule(modules.value[currentIndex + 1])
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
    latestLesson,
    latestPercentageLesson,
    latestModuleUnlockedCount,
    currentLessonId,
    selectedModule,
    isFinalQuizUnlocked,
    completionPercentage,
    fetchLatestLesson,
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
