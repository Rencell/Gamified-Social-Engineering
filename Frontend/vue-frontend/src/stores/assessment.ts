import { defineStore } from 'pinia'
import { ref } from 'vue'
import assessmentService from '@/services/assessmentService'
import type { Assessment, Question, AssessmentSession, Option } from '@/services/assessmentService'
export const useAssessmentStore = defineStore('assessment', () => {
  // State
  const assessments = ref<Assessment[]>([])
  const currentAssessment = ref<Assessment | null>(null)
  const currentQuestion = ref<Question[]>([])
  const currentSession = ref<AssessmentSession | null>(null)
  const courseName = ref('')

  const fetch = async () => {
    try {
      assessments.value = await assessmentService.get_all()
    } catch (error) {
      console.error('Error fetching assessments:', error)
    }
  }

  const create = async (data: Partial<Assessment>) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name || '')
      formData.append('bg', data.bg || '')
      formData.append('duration', data.duration?.toString() || '0')
      formData.append('description', data.description || '')
      formData.append('difficulty_level', data.difficulty_level || '')
      formData.append('question_count', data.question_count?.toString() || '0')
      formData.append('instructions', JSON.stringify(data.instructions || []))
      if (data.image) {
        formData.append('image', data.image)
      }

      console.log('Creating assessment with data:', data)
      const newAssessment = await assessmentService.create(formData)
      assessments.value.push(newAssessment)
    } catch (error) {
      console.error('Error creating assessment:', error)
    }
  }

  const update = async (data: Partial<Assessment>) => {
    try {
      const formData = new FormData()
      if (data.name) formData.append('name', data.name)
      if (data.bg) formData.append('bg', data.bg)
      if (data.duration !== undefined) formData.append('duration', data.duration.toString())
      if (data.description) formData.append('description', data.description)
      if (data.difficulty_level) formData.append('difficulty_level', data.difficulty_level)
      if (data.question_count) formData.append('question_count', data.question_count.toString())
      if (data.instructions) formData.append('instructions', JSON.stringify(data.instructions))

      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      console.log('Updating assessment with data:', data)
      const updatedAssessment = await assessmentService.patch(data.id as number, formData)
      const index = assessments.value.findIndex((assessment) => assessment.id === data.id)
      if (index !== -1) {
        assessments.value[index] = updatedAssessment
      }
    } catch (error) {
      console.error('Error updating assessment:', error)
    }
  }

  const detail = async (slug: string) => {
    try {
      currentAssessment.value = await assessmentService.detail(slug)
    } catch (error) {
      console.error('Error fetching assessment details:', error)
    }
  }

  const has_completed_assessment = async (assessment_id: number) => {
    try {
      const session = await assessmentService.fetch_completed_assessment(assessment_id)

      return session
    } catch (error) {
      console.error('Error initializing assessment:', error)
      throw error
    }
  }

  const initialize_assessment = async (assessment_id: number) => {
    try {
      const session = await assessmentService.initialize_assessment(assessment_id)

      return session
    } catch (error) {
      console.error('Error initializing assessment:', error)
      throw error
    }
  }

  const resume_assessment = async (assessment_id: number) => {
    try {
      const session = await assessmentService.resume_assessment(assessment_id)

      return session
    } catch (error) {
      console.error('Error resuming assessment:', error)
      throw error
    }
  }

  const timeout_assessment = async (session_id: string) => {
    try {
      const session = await assessmentService.timeout_assessment(session_id)

      return session
    } catch (error) {
      console.error('Error timing out assessment:', error)
      throw error
    }
  }

  const initialize_questions = async (assessment_id: number | string) => {
    try {
      currentQuestion.value = await assessmentService.get_questions(assessment_id)
    } catch (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
  }

  const save_question_answer = async (data: { session_id: string; question_id: number; option_id: number | null; }) => {
    try {
      await assessmentService.save_answer(data);

      return
    } catch (error) {
      console.error('Error saving questions:', error)
    }
  }

  const existing_session = async (session_id: string) => {
    try {
      const session = await assessmentService.current_session(session_id)
      currentAssessment.value = session.assessment
      currentSession.value = session
    } catch (error) {
      console.error('Error fetching existing session:', error)
    }
  }

  const updateQuestions = async (data: Partial<Question>) => {
    try {
      const formData = new FormData()
      if (data.question_type) formData.append('question_type', data.question_type)
      if (data.text) formData.append('text', data.text)
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      await assessmentService.patchQuestion(data.id as number, formData)

    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  const addQuestion = async (data: Question) => {
    try { 
      const response = await assessmentService.createQuestion(data as unknown as any);
      currentQuestion.value.push(response);
    } catch (error) {
      console.error('Error adding question:', error)
    }
  }

  const updateOption = async (data: Partial<Option>) => {
    try {
      const formData = new FormData()
      if (data.text) formData.append('text', data.text)
      if (data.is_correct !== undefined) formData.append('is_correct', data.is_correct.toString())
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }
      const response = await assessmentService.patchOption(data.id as number, formData)
      currentQuestion.value.forEach((question) => {
        if (question.id === response.question) {
          const optionIndex = question.options.findIndex((option) => option.id === response.id);
          if (optionIndex !== -1) {
            console.log('Updating option at index:', response);
            question.options[optionIndex] = response;
          }
        }
      });

    } catch (error) {
      console.error('Error updating option:', error)
    }
  }

  const addOption = async (data: Option) => {

    try { 
      const formData = new FormData()
      if (data.text) formData.append('text', data.text)
      if (data.question) formData.append('question', data.question.toString())
      if (data.is_correct) formData.append('is_correct', data.is_correct.toString())
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }
      const response = await assessmentService.createOption(formData);
      currentQuestion.value.forEach((question) => {
        if (question.id === response.question) {
          question.options.push(response);
        }
      });
    } catch (error) {
      console.error('Error adding option:', error)
    }
  }

 

  return {
    courseName,
    currentAssessment,
    currentQuestion,
    currentSession,
    assessments,
    fetch,
    create,
    update,
    detail,
    has_completed_assessment,
    resume_assessment,
    timeout_assessment,
    initialize_assessment,
    initialize_questions,
    save_question_answer,
    existing_session,
    updateQuestions,
    addOption,
    addQuestion,
    updateOption
  }
})
