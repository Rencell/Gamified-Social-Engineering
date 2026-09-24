import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services', () => ({
  ServiceService: {
    get_sections: vi.fn(),
    create_section: vi.fn(),
    delete_section: vi.fn(),
    update_section: vi.fn(),
  },
}))

// Mock the module store used internally by the section store.
// IMPORTANT: return a stable singleton so the store under test and the test itself
// reference the same mocked instance.
const moduleStoreMock = {
  fetchModulesBySection: vi.fn(),
}
vi.mock('@/stores/module', () => ({
  useModuleStore: () => moduleStoreMock,
}))

import { ServiceService } from '@/services'
import { useSectionStore } from '@/stores/sections'
import { useModuleStore } from '@/stores/module'

type TestModule = { id: number; title?: string }

type TestSection = {
  id: number
  title?: string
  modules: TestModule[]
}

describe('Section store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('fetchSection loads sections and resolves modules via moduleStore', async () => {
    const moduleStore = useModuleStore() as unknown as {
      fetchModulesBySection: ReturnType<typeof vi.fn>
    }

    moduleStore.fetchModulesBySection.mockResolvedValue([{ id: 99, title: 'Resolved' }] satisfies TestModule[])

    ;(
      ServiceService.get_sections as unknown as {
        mockResolvedValue: (v: TestSection[]) => void
      }
    ).mockResolvedValue([
      { id: 1, title: 'S1', modules: [{ id: 10 }] },
      { id: 2, title: 'S2', modules: [{ id: 20 }, { id: 21 }] },
    ])

    const store = useSectionStore()
    await store.fetchSection(123)

    expect(ServiceService.get_sections).toHaveBeenCalledWith(123)
    expect(store.sections).toHaveLength(2)

    // fetchSection uses forEach(async ...), so the function returns before modules are resolved.
    // Wait until the expected module replacement has occurred (or time out).
    await vi.waitFor(() => {
      expect((store.sections[0] as unknown as TestSection).modules).toEqual([{ id: 99, title: 'Resolved' }])
      expect((store.sections[1] as unknown as TestSection).modules).toEqual([{ id: 99, title: 'Resolved' }])
    })

    expect(moduleStore.fetchModulesBySection).toHaveBeenCalledTimes(2)
  })

  it('setSelectedSection sets null and warns when no sections exist', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const store = useSectionStore()
    store.setSelectedSection(1)

    expect(store.selectedSection).toBeNull()
    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })

  it('setSelectedSection selects a section by id', () => {
    const store = useSectionStore()

    store.sections = [
      { id: 1, title: 'S1', modules: [] },
      { id: 2, title: 'S2', modules: [] },
    ] as unknown as typeof store.sections

    store.setSelectedSection(2)

    expect(store.selectedSection?.id).toBe(2)
  })
})
