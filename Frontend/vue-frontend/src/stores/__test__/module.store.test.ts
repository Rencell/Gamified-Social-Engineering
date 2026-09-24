import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock toast (used by store but not relevant to logic tested here)
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

// Mock dependent stores (module store imports these)
const lessonStoreMock = {
  currentLesson: { id: 1, locked: false },
  lessons: [],
  unlockLesson: vi.fn(),
}
vi.mock('@/stores/lesson', () => ({
  useLessonStore: () => lessonStoreMock,
}))

const sectionStoreMock = {
  selectedSection: null as null | { modules: Array<{ id: number; locked?: boolean }> },
  fetchSection: vi.fn(),
  setSelectedSection: vi.fn(),
}
vi.mock('@/stores/sections', () => ({
  useSectionStore: () => sectionStoreMock,
}))

const streakStoreMock = {
  postStreak: vi.fn(),
}
vi.mock('@/stores/pageStreak', () => ({
  useStreakStore: () => streakStoreMock,
}))

const courseUnlockStoreMock = {
  setCourseDetails: vi.fn(),
  openCourseModal: false,
}
vi.mock('@/stores/pageCourseUnlock', () => ({
  useCourseUnlockStore: () => courseUnlockStoreMock,
}))

const authStoreMock = {
  User: { is_admin: false },
}
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authStoreMock,
}))

// Mock services used by module store
vi.mock('@/services', () => ({
  ModuleService: {
    get_all_test: vi.fn(),
    get_unlocked_modules_test: vi.fn(),
    unlock_module: vi.fn(),
    create_module_test: vi.fn(),
    update_module_test: vi.fn(),
    delete_module_test: vi.fn(),
  },
}))

import { ModuleService } from '@/services'
import { useModuleStore } from '@/stores/module'
import type { ModuleTest } from '@/services/moduleService'

type TestModule = Pick<ModuleTest, 'id' | 'slug' | 'title' | 'final' | 'module_order' | 'section' | 'unlocks_lesson'> & {
  locked?: boolean
}

const makeModule = (overrides: Partial<TestModule> = {}): TestModule => ({
  id: 1,
  slug: 'm-1',
  title: 'M1',
  final: false,
  module_order: 1,
  section: 1,
  unlocks_lesson: null as unknown as number,
  ...overrides,
})

describe('Module store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    // reset mocks to sane defaults per test
    lessonStoreMock.currentLesson = { id: 1, locked: false }
    lessonStoreMock.lessons = []
    sectionStoreMock.selectedSection = null
    courseUnlockStoreMock.openCourseModal = false
    authStoreMock.User.is_admin = false
  })

  it('fetchModules merges locked state from unlocked slugs and sorts final last', async () => {
    ;(
      ModuleService.get_all_test as unknown as {
        mockResolvedValue: (v: ModuleTest[]) => void
      }
    ).mockResolvedValue([
      makeModule({ id: 1, slug: 'a', final: false, module_order: 2 }),
      makeModule({ id: 2, slug: 'b', final: true, module_order: 99 }),
      makeModule({ id: 3, slug: 'c', final: false, module_order: 1 }),
    ] as unknown as ModuleTest[])

    ;(
      ModuleService.get_unlocked_modules_test as unknown as {
        mockResolvedValue: (v: string[]) => void
      }
    ).mockResolvedValue(['a'])

    const store = useModuleStore()
    await store.fetchModules('lesson-1')

    expect(ModuleService.get_all_test).toHaveBeenCalledWith('lesson-1')
    expect(ModuleService.get_unlocked_modules_test).toHaveBeenCalledTimes(1)

    const bySlug = new Map(store.modules.map((m) => [m.slug, m]))
    expect(bySlug.get('a')?.locked).toBe(false)
    expect(bySlug.get('c')?.locked).toBe(true)
    expect(bySlug.get('b')?.locked).toBe(true)

    // sortModules: non-final ordered by module_order, final always last
    expect(store.modules.map((m) => m.slug)).toEqual(['c', 'a', 'b'])
  })

  it('setSelectedModule blocks selecting final module when not all non-final are unlocked', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const store = useModuleStore()

    // seed store state
    store.modules = [
      makeModule({ id: 1, slug: 'm1', final: false, locked: false }),
      makeModule({ id: 2, slug: 'm2', final: false, locked: true }),
      makeModule({ id: 3, slug: 'final', final: true, locked: true }),
    ] as unknown as ModuleTest[]

    store.selectedModule = store.modules[0]

    // attempt to select final module while another required module is still locked
    store.setSelectedModule(store.modules[2])

    expect(warn).toHaveBeenCalledWith('Final Quiz is locked. Complete all modules first.')
    expect(store.selectedModule?.slug).toBe('m1')

    warn.mockRestore()
  })

  it('setSelectedModule allows selecting final module when all non-final are unlocked', () => {
    const store = useModuleStore()

    store.modules = [
      makeModule({ id: 1, slug: 'm1', final: false, locked: false }),
      makeModule({ id: 2, slug: 'm2', final: false, locked: false }),
      makeModule({ id: 3, slug: 'final', final: true, locked: true }),
    ] as unknown as ModuleTest[]

    store.setSelectedModule(store.modules[2])
    expect(store.selectedModule?.slug).toBe('final')
  })
})
