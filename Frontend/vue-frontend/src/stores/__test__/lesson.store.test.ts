import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the service module used by the store
vi.mock('@/services', () => ({
  LessonService: {
    get_all_test: vi.fn(),
    get_unlocked_lessons_test: vi.fn(),
    get_latest_lesson: vi.fn(),
    unlock_lesson_test: vi.fn(),
    create_lesson_test: vi.fn(),
    update_lesson_test: vi.fn(),
    delete_lesson_test: vi.fn(),
  },
}))

import { LessonService } from '@/services'
import { useLessonStore } from '@/stores/lesson'
import type { Lesson_test } from '@/services/lessonService'

type TestLesson = Pick<Lesson_test, 'id' | 'slug' | 'title' | 'bg' | 'description' | 'lesson_order' | 'image' | 'objective'> & {
  locked?: boolean
}

const makeLesson = (overrides: Partial<TestLesson> = {}): TestLesson => ({
  id: 1,
  slug: 'lesson-1',
  title: 'L1',
  bg: '',
  description: '',
  lesson_order: null,
  image: '',
  objective: [],
  ...overrides,
})

describe('Lesson store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('fetchLessons merges locked state from unlocked slugs', async () => {
    ;(
      LessonService.get_all_test as unknown as {
        mockResolvedValue: (v: Lesson_test[]) => void
      }
    ).mockResolvedValue([makeLesson({ id: 1, slug: 'lesson-1', title: 'L1' }), makeLesson({ id: 2, slug: 'lesson-2', title: 'L2' })] as unknown as Lesson_test[])

    ;(
      LessonService.get_unlocked_lessons_test as unknown as {
        mockResolvedValue: (v: string[]) => void
      }
    ).mockResolvedValue(['lesson-2'])

    const store = useLessonStore()
    await store.fetchLessons()

    expect(LessonService.get_all_test).toHaveBeenCalledTimes(1)
    expect(LessonService.get_unlocked_lessons_test).toHaveBeenCalledTimes(1)

    const l1 = (store.lessons as unknown as TestLesson[]).find((l) => l.slug === 'lesson-1')
    const l2 = (store.lessons as unknown as TestLesson[]).find((l) => l.slug === 'lesson-2')

    expect((store.lessons as unknown as TestLesson[])).toHaveLength(2)
    expect(l1?.locked).toBe(true)
    expect(l2?.locked).toBe(false)
  })

  it('fetchLatestLesson uses existing lessons to map latestLesson + percentage', async () => {
    const store = useLessonStore()

    // Seed store lessons so fetchLatestLesson can find it by id
    store.lessons = [makeLesson({ id: 10, slug: 'a', title: 'A' }), makeLesson({ id: 11, slug: 'b', title: 'B' })] as unknown as Lesson_test[]

    ;(
      LessonService.get_latest_lesson as unknown as {
        mockResolvedValue: (v: {
          user: number
          lesson_test: number
          percentage: number
          module_count: number
          completed_module_count: number
        }) => void
      }
    ).mockResolvedValue({
      user: 1,
      lesson_test: 11,
      percentage: 42,
      module_count: 10,
      completed_module_count: 4,
    })

    await store.fetchLatestLesson()

    expect(LessonService.get_latest_lesson).toHaveBeenCalledTimes(1)
    expect(store.latestPercentageLesson).toBe(42)
    expect(store.latestLessonStatus?.lesson_test).toBe(11)
    expect((store.latestLesson as unknown as TestLesson | null)?.id).toBe(11)
  })

  it('fetchLatestLesson is a no-op when latestLesson is already cached', async () => {
    const store = useLessonStore()
    store.latestLesson = makeLesson({ id: 123, slug: 'cached', title: 'Cached' }) as unknown as Lesson_test

    await store.fetchLatestLesson()

    expect(LessonService.get_latest_lesson).not.toHaveBeenCalled()
  })
})
