import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

type ContentItem = { id: number; content_order: number }
type ComponentItem = { id: number; component: unknown }

// Mock components imported by the store (we don't render them in unit tests)
vi.mock('@/components/learn/content/cowntent.vue', () => ({
  default: { name: 'CowntentStub' },
}))
vi.mock('@/components/learn/content/UI/Learning/Highlight/Citation.vue', () => ({
  default: { name: 'CitationStub' },
}))

// Mock module store dependency
vi.mock('@/stores/module', () => ({
  useModuleStore: () => ({
    selectedModule: { id: 1 },
  }),
}))

// Mock services that the content store uses
vi.mock('@/services', () => ({
  ContentService: {
    get_contents_by_module: vi.fn(),
    get_quizzes: vi.fn(),
    update_quiz: vi.fn(),
    delete: vi.fn(),
    create_content: vi.fn(),
    patch_content: vi.fn(),
  },
  ModuleService: {
    get_module_sources: vi.fn(),
  },
}))

import { ContentService, ModuleService } from '@/services'
import { useContentStore } from '@/stores/content'

describe('Content store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('fetchContents() sets contents, sorts by content_order, and builds components', async () => {
    ;(
      ContentService.get_contents_by_module as unknown as {
        mockResolvedValue: (v: ContentItem[]) => void
      }
    ).mockResolvedValue([
      { id: 2, content_order: 2 },
      { id: 1, content_order: 1 },
    ])

    // no citations by default
    ;(
      ModuleService.get_module_sources as unknown as {
        mockResolvedValue: (v: unknown[]) => void
      }
    ).mockResolvedValue([])

    const store = useContentStore()
    await store.fetchContents(123)

    expect(ContentService.get_contents_by_module).toHaveBeenCalledWith(123)
    expect(store.contents.map((c) => (c as ContentItem).id)).toEqual([1, 2])

    // components created in the same order as sorted contents
    expect(store.components.map((c) => c.id)).toEqual([1, 2])
  })

  it('fetchContents() adds Citation component when module sources exist', async () => {
    ;(
      ContentService.get_contents_by_module as unknown as {
        mockResolvedValue: (v: ContentItem[]) => void
      }
    ).mockResolvedValue([{ id: 1, content_order: 1 }])

    ;(
      ModuleService.get_module_sources as unknown as {
        mockResolvedValue: (v: unknown[]) => void
      }
    ).mockResolvedValue([{ id: 999 }])

    const store = useContentStore()
    await store.fetchContents(1)

    expect(ModuleService.get_module_sources).toHaveBeenCalledWith(1)
    expect(store.components.map((c) => c.id)).toEqual([1, 1000])
  })

  it('createContent() appends to contents and components using selected module id', async () => {
    ;(
      ContentService.create_content as unknown as {
        mockResolvedValue: (v: ContentItem) => void
      }
    ).mockResolvedValue({ id: 10, content_order: 1 })

    const store = useContentStore()
    expect(store.contents).toHaveLength(0)
    expect(store.components).toHaveLength(0)

    await store.createContent()

    expect(ContentService.create_content).toHaveBeenCalledWith({ modules: 1 })
    expect(store.contents.map((c) => (c as ContentItem).id)).toEqual([10])
    expect(store.components.map((c) => c.id)).toEqual([10])
  })

  it('deleteContent() removes items from contents and components', async () => {
    ;(
      ContentService.delete as unknown as {
        mockResolvedValue: (v: void) => void
      }
    ).mockResolvedValue(undefined)

    const store = useContentStore()

    // seed state
    ;(store.contents as unknown as ContentItem[]).push(
      { id: 1, content_order: 1 },
      { id: 2, content_order: 2 },
    )
    ;(store.components as unknown as ComponentItem[]).push(
      { id: 1, component: { name: 'X' } },
      { id: 2, component: { name: 'Y' } },
    )

    await store.deleteContent(2)

    expect(ContentService.delete).toHaveBeenCalledWith(2)
    expect(store.contents.map((c) => (c as ContentItem).id)).toEqual([1])
    expect(store.components.map((c) => c.id)).toEqual([1])
  })

  it('fetchContentQuiz() sets contentQuiz', async () => {
    const quiz = { id: 55, question: 'Q' }
    ;(
      ContentService.get_quizzes as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue(quiz)

    const store = useContentStore()
    await store.fetchContentQuiz(9)

    expect(ContentService.get_quizzes).toHaveBeenCalledWith(9)
    expect((store.contentQuiz as unknown as { id: number }).id).toBe(55)
  })

  it('updateContentsQuiz() calls update_quiz with current contentQuiz', async () => {
    // The store calls alert() on success
    vi.stubGlobal('alert', vi.fn())

    ;(
      ContentService.update_quiz as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue({})

    const store = useContentStore()
    ;(store.contentQuiz as unknown as { id: number; payload: string }) = { id: 77, payload: 'payload' }

    await store.updateContentsQuiz()

    expect(ContentService.update_quiz).toHaveBeenCalledWith(77, store.contentQuiz)

    vi.unstubAllGlobals()
  })

  it('handleReorderComponent() swaps content_order and re-sorts components', async () => {
    ;(
      ContentService.patch_content as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue({})

    const store = useContentStore()

    // Seed two sibling contents with order 1 and 2
    ;(store.contents as unknown as ContentItem[]).push(
      { id: 1, content_order: 1 },
      { id: 2, content_order: 2 },
    )
    ;(store.components as unknown as ComponentItem[]).push(
      { id: 1, component: { name: 'A' } },
      { id: 2, component: { name: 'B' } },
    )

    await store.handleReorderComponent(2, 'up')

    // swapped
    const c1 = store.contents.find((c) => (c as ContentItem).id === 1) as unknown as ContentItem
    const c2 = store.contents.find((c) => (c as ContentItem).id === 2) as unknown as ContentItem

    expect(c1.content_order).toBe(2)
    expect(c2.content_order).toBe(1)

    // component order follows new content_order
    expect(store.components.map((c) => c.id)).toEqual([2, 1])

    // patch called for both items
    expect(ContentService.patch_content).toHaveBeenCalledTimes(2)
  })
})
