import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LessonService } from '@/services'
import type { Lesson_test } from '@/services/lessonService'
import lessonService from '@/services/lessonService'
import { toast } from 'vue-sonner'
import router from '@/router'

export const useLessonStore = defineStore('Lesson', () => {
  const lessons = ref<Lesson_test[]>([])
  const currentLesson = ref<Lesson_test | null>(null)
  const latestLesson = ref<Lesson_test | null>(null)
  const latestPercentageLesson = ref(0)

  interface LatestLessonStatus {
    user: number
    lesson_test: number
    percentage: number
    module_count: number
    completed_module_count: number
  }

  const latestLessonStatus = ref<LatestLessonStatus | null>(null)


  const toast_notification = (message: string) => {
    toast.success(message, {
      action: {
        label: 'Close',
        onClick: () => console.log('Closed notification'),
      },
      position: 'top-right',
    })
  }
  
  const fetchLessons = async () => {
    try {
      lessons.value = await LessonService.get_all_test()
      const unlockedLessons = await LessonService.get_unlocked_lessons_test()

      lessons.value = lessons.value.map((lesson) => ({
        ...lesson,
        locked: !unlockedLessons.includes(lesson.slug),
      }))

    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const fetchLatestLesson = async () => {
    if (latestLesson.value) {
      return
    }

    try {
      const data = await LessonService.get_latest_lesson()
      latestPercentageLesson.value = data.percentage
      latestLessonStatus.value = data
      const foundLesson = lessons.value?.find((lesson) => lesson.id === data.lesson_test)
      latestLesson.value = foundLesson || null
    } catch (error) {
      console.error('Failed to fetch unlocked modules:', error)
    }
  }

  const unlockLesson = async (lessonId: number) => {
    try {
      if (lessons.value.length === 0) return
      await LessonService.unlock_lesson_test(lessonId)
    } catch (error) {
      console.error('Failed to unlock lesson:', error)
    }
  }

  const createLesson = async (lessonData: Lesson_test) => {
    try {
      const formData = new FormData()
      formData.append('title', lessonData.title)
      formData.append('bg', lessonData.bg)
      formData.append('description', lessonData.description)

      if (lessonData.lesson_order !== null) {
        formData.append('lesson_order', String(lessonData.lesson_order))
      }

      if (lessonData.image) {
        formData.append('image', lessonData.image) // actual File object
      }

      const newLesson = await LessonService.create_lesson_test(formData)
      const add_unlocked = {
        ...newLesson,
        locked: true
      }
      lessons.value.push(add_unlocked)
      if (newLesson) {
        toast_notification(`Lesson "${newLesson.title}" created successfully!`)
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    }
  }

  const updateLesson = async (lessonId: number, lessonData: Partial<Lesson_test>) => {
    try {
      const formData = new FormData()
      formData.append('title', lessonData.title!)
      formData.append('bg', lessonData.bg!)
      formData.append('description', lessonData.description!)
      if (lessonData.lesson_order !== null) {
        formData.append('lesson_order', String(lessonData.lesson_order))
      }

      if (lessonData.image instanceof File) {
        formData.append('image', lessonData.image)
      }
      const updatedLesson = await LessonService.update_lesson_test(lessonId, formData)
      const index = lessons.value.findIndex((l) => l.slug === updatedLesson.slug)
      if (index !== -1) {
        lessons.value[index] = updatedLesson
        currentLesson.value = updatedLesson
      }
      toast_notification(`Lesson "${updatedLesson.title}" updated successfully!`)
    } catch (error) {
      console.error('Error updating lesson:', error)
    }
  }

  const deleteLesson
   = async (lessonId: number) => {
    try {
      await LessonService.delete_lesson_test(lessonId)
      lessons.value = lessons.value.filter((lesson) => lesson.id !== lessonId)
      if (currentLesson.value?.id === lessonId) {
        currentLesson.value = lessons.value.length > 0 ? lessons.value[0] : null
      }
      toast_notification('Lesson deleted successfully')
      
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const setCurrentLesson = (lessonId: string) => {
    currentLesson.value = lessons.value.find((lesson) => lesson.slug === lessonId) || null
  }

  const addObjective = async (newObjective: string[]) => {
    if (!currentLesson.value) return
    currentLesson.value.objective = newObjective
    try {
      await lessonService.update_lesson_partial_test(currentLesson.value.id || 0, {
        objective: newObjective,
      })
    } catch (error) {
      console.error('Error adding objective:', error)
    }
  }
  return {
    fetchLessons,
    fetchLatestLesson,
    latestLesson,
    latestLessonStatus,
    latestPercentageLesson,
    lessons,
    setCurrentLesson,
    createLesson,
    updateLesson,
    deleteLesson,
    currentLesson,
    unlockLesson,
    addObjective,
  }
})
