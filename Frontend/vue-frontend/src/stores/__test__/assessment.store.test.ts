import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the service imported by the store
vi.mock('@/services/assessmentService', () => ({
  default: {
    get_all: vi.fn(),
    detail: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),

    fetch_completed_assessment: vi.fn(),
    resume_assessment: vi.fn(),
    initialize_assessment: vi.fn(),
    timeout_assessment: vi.fn(),
    current_session: vi.fn(),

    get_questions: vi.fn(),
    save_answer: vi.fn(),
    patchQuestion: vi.fn(),
    createQuestion: vi.fn(),
    deleteQuestion: vi.fn(),

    patchOption: vi.fn(),
    createOption: vi.fn(),
    deleteOption: vi.fn(),

    fetch_assessment_rewards: vi.fn(),
    assessment_claim_reward: vi.fn(),
  },
}))

import assessmentService from '@/services/assessmentService'
import { useAssessmentStore } from '@/stores/assessment'
import type { Assessment, AssessmentSession, Question, Option } from '@/services/assessmentService'

describe('Assessment store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('fetch() populates assessments from service', async () => {
    const mockAssessments: Assessment[] = [
      {
        id: 1,
        name: 'A1',
        slug: 'a1',
        lesson: 1,
        description: 'desc',
      } as Assessment,
    ]

    ;(assessmentService.get_all as unknown as { mockResolvedValue: (v: Assessment[]) => void }).mockResolvedValue(
      mockAssessments,
    )

    const store = useAssessmentStore()
    await store.fetch()

    expect(assessmentService.get_all).toHaveBeenCalledTimes(1)
    expect(store.assessments).toEqual(mockAssessments)
  })

  it('detail(slug) sets currentAssessment', async () => {
    const mock: Assessment = { id: 2, name: 'A2', slug: 'a2', lesson: 1 } as Assessment
    ;(assessmentService.detail as unknown as { mockResolvedValue: (v: Assessment) => void }).mockResolvedValue(mock)

    const store = useAssessmentStore()
    await store.detail('a2')

    expect(assessmentService.detail).toHaveBeenCalledWith('a2')
    expect(store.currentAssessment).toEqual(mock)
  })

  it('create(data) pushes created assessment into assessments', async () => {
    const created: Assessment = { id: 3, name: 'New', slug: 'new', lesson: 1 } as Assessment
    ;(assessmentService.create as unknown as { mockResolvedValue: (v: Assessment) => void }).mockResolvedValue(created)

    const store = useAssessmentStore()
    expect(store.assessments.length).toBe(0)

    await store.create({ name: 'New', bg: '#fff', duration: 5, description: 'x', difficulty_level: 'easy', question_count: 1 })

    expect(assessmentService.create).toHaveBeenCalledTimes(1)
    expect(store.assessments[0]).toEqual(created)
  })

  it('update(data) replaces assessment in list when ids match', async () => {
    const store = useAssessmentStore()
    store.assessments = [{ id: 10, name: 'Old', slug: 'old', lesson: 1 } as Assessment]

    const updated: Assessment = { id: 10, name: 'Updated', slug: 'old', lesson: 1 } as Assessment
    ;(assessmentService.patch as unknown as { mockResolvedValue: (v: Assessment) => void }).mockResolvedValue(updated)

    await store.update({ id: 10, name: 'Updated' })

    expect(assessmentService.patch).toHaveBeenCalledTimes(1)
    expect(store.assessments[0].name).toBe('Updated')
  })

  it('existing_session(session_id) sets currentAssessment and currentSession', async () => {
    const assessment: Assessment = { id: 1, name: 'A1', slug: 'a1', lesson: 1 } as Assessment
    const session: AssessmentSession = {
      session_id: 's1',
      status: 'in_progress',
      started_at: '2025-01-01',
      score: null,
      assessment,
      current_question_index: 0,
      completed_questions: [],
      completed_at: null,
      user: 'u1',
    }

    ;(
      assessmentService.current_session as unknown as { mockResolvedValue: (v: AssessmentSession) => void }
    ).mockResolvedValue(session)

    const store = useAssessmentStore()
    await store.existing_session('s1')

    expect(assessmentService.current_session).toHaveBeenCalledWith('s1')
    expect(store.currentSession?.session_id).toBe('s1')
    expect(store.currentAssessment?.slug).toBe('a1')
  })

  it('initialize_questions(assessment_id) populates currentQuestion', async () => {
    const questions: Question[] = [
      {
        id: 1,
        question_type: 'multiple_choice',
        text: 'Q1',
        order: 1,
        assessment: 99,
        options: [],
      },
    ]

    ;(
      assessmentService.get_questions as unknown as { mockResolvedValue: (v: Question[]) => void }
    ).mockResolvedValue(questions)

    const store = useAssessmentStore()
    await store.initialize_questions(99)

    expect(assessmentService.get_questions).toHaveBeenCalledWith(99)
    expect(store.currentQuestion).toEqual(questions)
  })

  it('updateOption updates the option inside currentQuestion state', async () => {
    const store = useAssessmentStore()

    store.currentQuestion = [
      {
        id: 11,
        question_type: 'multiple_choice',
        text: 'Q',
        order: 1,
        assessment: 1,
        options: [
          { id: 100, question: 11, text: 'A', is_correct: false } as Option,
          { id: 101, question: 11, text: 'B', is_correct: true } as Option,
        ],
      } as Question,
    ]

    const patched: Option = { id: 100, question: 11, text: 'A2', is_correct: true } as Option
    ;(
      assessmentService.patchOption as unknown as { mockResolvedValue: (v: Option) => void }
    ).mockResolvedValue(patched)

    await store.updateOption({ id: 100, text: 'A2', is_correct: true })

    expect(assessmentService.patchOption).toHaveBeenCalledTimes(1)
    expect(store.currentQuestion[0].options.find((o) => o.id === 100)?.text).toBe('A2')
    expect(store.currentQuestion[0].options.find((o) => o.id === 100)?.is_correct).toBe(true)
  })

  it('claim_reward returns rewarded boolean', async () => {
    ;(
      assessmentService.assessment_claim_reward as unknown as { mockResolvedValue: (v: { rewarded: boolean }) => void }
    ).mockResolvedValue({ rewarded: true })

    const store = useAssessmentStore()
    const rewarded = await store.claim_reward(123)

    expect(assessmentService.assessment_claim_reward).toHaveBeenCalledWith(123)
    expect(rewarded).toBe(true)
  })
})
