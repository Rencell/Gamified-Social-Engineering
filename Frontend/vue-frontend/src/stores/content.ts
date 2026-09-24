import { defineStore } from 'pinia'
import { ContentService } from '@/services'
import { ref } from 'vue'
import Cowntent from '@/components/learn/content/cowntent.vue'
import { useModuleStore } from './module'
import type { QuizQuestion } from '@/services/contentService'

export const useContentStore = defineStore('Content', () => {
  const moduleStore = useModuleStore()
  const contents = ref<any[]>([])
  const components = ref<{ id: number; component: any }[]>([])

  const fetchContents = async (moduleId: number) => {
    try {
      const response = await ContentService.get_contents_by_module(moduleId)
      console.log('Contents for module:', response)
      contents.value = response

      contents.value.sort((a, b) => a.content_order - b.content_order)
      // Clear components and repopulate
      components.value = []
      contents.value.forEach((content: any, index: number) => {
        components.value.push({
          id: content.id || index.toString(),
          component: Cowntent,
        })
      })
    } catch (error) {
      console.error('Error fetching contents:', error)
    }
  }

  const contentItems = ref<QuizQuestion>(null as any)

  const fetchContentQuiz = async (contentId: number) => {
    try {
      const response = await ContentService.get_quizzes(contentId)
      contentItems.value = response
      console.log('Fetched quiz data:', contentItems.value)
    } catch (error) {
      console.error('Error fetching quiz data:', error)
    }
  }

  const updateContentsQuiz = async() => {
    try {
      await ContentService.update_quiz(contentItems.value.id, contentItems.value)
      alert('Quiz updated successfully!')
    } catch (error) {
      console.error('Error updating quiz content:', error)
    }
  }

  const deleteContent = async (contentId: number | null) => {
    try {
      if (contentId != null) {
        await ContentService.delete(contentId)
        components.value = components.value.filter((c) => c.id !== contentId)
        contents.value = contents.value.filter((c) => c.id !== contentId)
        console.log(components.value)
      } else {
        console.error('Invalid contentId: Cannot delete content.')
      }
    } catch (error) {
      console.error(`Failed to delete content with ID: ${contentId}`, error)
    }
  }

  const createContent = async () => {
    try {
      if (moduleStore.selectedModule?.id != null) {
        const response = await ContentService.create_content({
          modules: moduleStore.selectedModule.id,
        })
        components.value.push({
          id: response.id || components.value.length,
          component: Cowntent,
        })
        contents.value.push(response)
        console.log(components.value)
      } else {
        console.error('Invalid module ID: Cannot create content.')
      }
    } catch (error) {
      console.error('Failed to create content:', error)
    }
  }

  const handleReorderComponent = async (id: number, direction: 'up' | 'down') => {
    const item = contents.value.find((item) => item.id === id)
    if (!item) return

    // Get siblings (items with the same parent)
    const siblings = contents.value.slice().sort((a, b) => a.content_order - b.content_order)

    const currentIndex = siblings.findIndex((sibling) => sibling.id === id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= siblings.length) return

    
    const currentItem = siblings[currentIndex]
    const targetItem = siblings[targetIndex]
    const tempOrder = currentItem.content_order
    
    try {
        // Update the database
        await Promise.all([
          ContentService.patch_content(currentItem.id, { content_order: targetItem.content_order }),
          ContentService.patch_content(targetItem.id, { content_order: tempOrder }),
        ]);
        contents.value = contents.value.map((item) => {
          if (item.id === currentItem.id) {
            return { ...item, content_order: targetItem.content_order }
          }
          if (item.id === targetItem.id) {
            return { ...item, content_order: tempOrder }
          }
          return item
        })
    
        components.value = components.value.sort((a, b) => {
          const itemA = contents.value.find((item) => item.id.toString() === a.id.toString())
          const itemB = contents.value.find((item) => item.id.toString() === b.id.toString())
    
          if (!itemA || !itemB) return 0
          return itemA.content_order - itemB.content_order
        })

    } catch (error) {
      console.error("Failed to reorder components:", error);
    }

  }

  return {
    contents,
    contentItems,
    fetchContents,
    fetchContentQuiz,
    components,
    deleteContent,
    createContent,
    updateContentsQuiz,
    handleReorderComponent,
  }
})
