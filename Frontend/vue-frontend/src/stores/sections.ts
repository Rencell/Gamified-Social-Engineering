import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceService } from '@/services'
import type { Section } from '@/services/sectionService'
import type { ModuleTest } from '@/services/moduleService'
import { useModuleStore } from './module'

export const useSectionStore = defineStore('pageSection', () => {
  const sections = ref<Section[]>([])
  const moduleStore = useModuleStore()
  const selectedSection = ref<Section | null>(null)
  const fetchSection = async (lessonId: number) => {
    try {
      console.log('Fetching sections for lesson:', lessonId)
      sections.value = await ServiceService.get_sections(lessonId)

      console.log('Fetched sections:', sections.value)
      sections.value.forEach(async section => {
        section.modules = (await moduleStore.fetchModulesBySection(section.modules as ModuleTest[])) || []
      })
      console.log('Sections fetched:', sections.value)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const setSelectedSection = (sectionId: number) => {
    if (!sections.value.length) {
      console.warn('No sections available to select from.')
      selectedSection.value = null
      return
    }
    selectedSection.value = sections.value.find(section => section.id === sectionId) || null
  }

  const createSection = async (data: Partial<Section>) => {
    try {
      const newSection = await ServiceService.create_section(data)
      sections.value.push(newSection)
      console.log('Section created:', newSection)
    } catch (error) {
      console.error('Error creating section:', error)
    }
  }

  const deleteSection = async (sectionId: number) => { 
    try {
      // await ServiceService.delete_section(sectionId)
      sections.value = sections.value.filter(section => section.id !== sectionId)
      console.log('Section deleted:', sectionId)
    }
    catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const updateSection = async(data: Section) => {
    try {
      await ServiceService.update_section(data)
      const index = sections.value.findIndex(section => section.id === data.id)
      if (index !== -1) {
        sections.value[index] = Object.assign(sections.value[index], data)
        console.log(sections.value[index])

        console.log('Section updated:', sections.value)
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const Modules = (section: Section) => {
    const modules = section.modules as ModuleTest[]
    return modules
  }
  return { fetchSection, sections, Modules, selectedSection, setSelectedSection, createSection, deleteSection, updateSection }
})
