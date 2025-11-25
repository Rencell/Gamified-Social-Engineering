import { defineStore } from 'pinia'
import { ModuleService } from '@/services'
import type { ModuleTest } from '@/services/moduleService'
import { useLessonStore } from './lesson'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'
import { useSectionStore } from './sections'
import { useStreakStore } from './pageStreak'
import { useCourseUnlockStore } from './pageCourseUnlock'
export const useModuleStore = defineStore('Module', () => {
  const lessonStore = useLessonStore()
  const modules = ref<ModuleTest[]>([])
  const selectedModule = ref<ModuleTest | null>(null)
  const sectionStore = useSectionStore()
  const streakStore = useStreakStore()
  const pageCourseUnlockStore = useCourseUnlockStore()
  const fetchModules = async (lessonId: string) => {
    try {
      modules.value = await ModuleService.get_all_test(lessonId)
      console.log(modules.value)

      const unlockedModules = await ModuleService.get_unlocked_modules_test()

      modules.value = modules.value.map((module) => ({
        ...module,
        locked: !unlockedModules.includes(module.slug),
      }))

      modules.value = sortModules(modules.value)
    } catch (error) {
      modules.value = []
      console.error('Error fetching modules:', error)
    }
  }

  const fetchModulesBySection = async (modules: ModuleTest[]) => {
    try {
      const unlockedModules = await ModuleService.get_unlocked_modules_test()

      modules = modules.map((module) => ({
        ...module,
        locked: !unlockedModules.includes(module.slug),
      }))

      modules = sortModules(modules)

      if (selectedModule.value == null) {
        selectedModule.value = modules.length > 0 ? modules[0] : null
      }

      return modules
    } catch (error) {
      console.error('Error fetching modules by section:', error)
    }
  }

  const isFinalQuizUnlocked = computed(() => {
    const requiredModules = modules.value.filter((module) => !module.final)
    // alert(requiredModules)
    const completedModules = requiredModules.filter((module) => !module.locked)

    return completedModules.length === requiredModules.length
  })

  const sortModules = (modules: ModuleTest[]) => {
    return modules.sort((a, b) => {
      if (a.final === b.final) {
        return (a.module_order ?? 0) - (b.module_order ?? 0)
      }
      return a.final ? 1 : -1
    })
  }

  const setSelectedModule = (module: ModuleTest) => {
    selectedModule.value = module
    if (lessonStore.currentLesson?.locked) {
      console.warn('Current lesson is locked. Please unlock it first.')
      return
    }

    // if (module.final && !isFinalQuizUnlocked.value) {
    //   console.warn('Final Quiz is locked. Complete all modules first.')
    //   return
    // }
  }

  const unlockModule = async () => {
    try {
      const moduleId = selectedModule.value?.id as number
      selectedModule.value!.locked = false

      const section = sectionStore.selectedSection
      if (section) {
        const moduleIndex = section.modules.findIndex((m) => m.id === moduleId)
        if (moduleIndex !== -1) {
          section.modules[moduleIndex].locked = false
        }
      }

      // ALSO update in the main modules array if it exists
      const mainModuleIndex = modules.value.findIndex((m) => m.id === moduleId)
      if (mainModuleIndex !== -1) {
        modules.value[mainModuleIndex].locked = false
      }
      await ModuleService.unlock_module({ module_test: moduleId })
    } catch (error) {
      console.error('Error unlocking module:', error)
    }
  }

  const createModule = async (moduleData: Partial<ModuleTest>) => {
    try {
      const newModule = await ModuleService.create_module_test(moduleData)
      sectionStore.fetchSection(lessonStore.currentLesson?.id || 0)
      selectedModule.value = newModule
      modules.value.push({ ...newModule, locked: true })

      modules.value = sortModules(modules.value)
    } catch (error) {
      console.error('Error creating module:', error)
    }
  }

  const updateModule = async (moduleData: Partial<ModuleTest>) => {
    try {
      const updatedModule = await ModuleService.update_module_test(moduleData)
      sectionStore.setSelectedSection(moduleData.section || 0)
      sectionStore.selectedSection?.modules.map((mod) => {
        if (mod.id === moduleData.id) {
          Object.assign(mod, moduleData)
        }
      })
    } catch (error) {
      console.error('Error updating module:', error)
    }
  }

  const deleteModule = async (moduleId: number) => {
    try {
      await ModuleService.delete_module_test(moduleId)
      modules.value = modules.value.filter((module) => module.id !== moduleId)
      if (selectedModule.value?.id === moduleId) {
        selectedModule.value = modules.value.length > 0 ? modules.value[0] : null
      }
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const completeModule = async () => {
    const mod = selectedModule.value
    if (!mod) return
    const lesson = lessonStore.lessons?.find((l) => l.id === mod.unlocks_lesson)
    try {
      streakStore.postStreak()
      await unlockModule()

      console.log('lesson unlocked:', lessonStore.currentLesson)

      let currentLesson
      
      if (lessonStore.currentLesson ) {
        currentLesson = lessonStore.currentLesson 
        currentLesson.completed_modules = (currentLesson.completed_modules || 0) + 1
      }

      const isFinalModule = currentLesson &&
        (currentLesson.completed_modules ?? 0) >= (currentLesson.total_modules ?? 0)

      if (isFinalModule) {
        if (lesson) {
          pageCourseUnlockStore.setCourseDetails(
            lesson.title || '',
            lesson.description || '',
            lesson.image ? lesson.image.toString() : '/Human.webp',
          )
          pageCourseUnlockStore.openCourseModal = true

          await lessonStore.unlockLesson(lesson?.id as number)
          lesson.locked = false
          streakStore.postStreak()
        }
      }

      // await updateLessons()
    } catch (error) {
      console.error('Failed to complete module:', error)
    }
  }

  const nextModule = () => {
    if (!selectedModule.value) return

    const section = sectionStore.selectedSection?.modules

    console.log(section)
    const currentIndex = section?.findIndex((m) => m.id === selectedModule.value?.id) ?? -1
    if (section) {
      if (currentIndex < section.length - 1) {
        setSelectedModule(section[currentIndex + 1])
      }
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
    modules,
    fetchModules,
    fetchModulesBySection,
    selectedModule,
    setSelectedModule,
    isFinalQuizUnlocked,
    createModule,
    deleteModule,
    updateModule,
    unlockModule,
    completeModule,
    nextModule,
    previousModule,
  }
})
