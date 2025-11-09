import { defineStore } from 'pinia'
import { ref } from 'vue'
import assessmentService from '@/services/assessmentService'
import type { Assessment, Question, AssessmentSession } from '@/services/assessmentService'
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

  const initialize_assessment = async (assessment_id: number) => {
    try {
      const session = await assessmentService.initialize_assessment(assessment_id);
      
      return session;
    } catch (error) {
      console.error('Error initializing assessment:', error);
      throw error;
    }
  };

  const initialize_questions = async (assessment_id: number) => {
    try {
      currentQuestion.value = await assessmentService.get_questions(assessment_id);
      
    }
    catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  const existing_session = async (session_id: string) => {
    try {
      const session = await assessmentService.current_session(session_id);
      currentAssessment.value = session.assessment;
      currentSession.value = session;
    } catch (error) {
      console.error('Error fetching existing session:', error);
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
    initialize_assessment,
    initialize_questions,
    existing_session,
  }
})
