import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseUnlockStore = defineStore('courseUnlock', () => {
    // State
    const openCourseModal = ref(false)
    const courseName = ref('')
    const courseDescription = ref('')
    const courseImage = ref('')
    // Actions

    const closeStreakModal = () => {
        openCourseModal.value = false;
    }

    
    const setCourseDetails = (name: string, description: string, image: string) => {
        courseName.value = name;
        courseDescription.value = description;
        courseImage.value = image;
    }

    return {
        courseName,
        courseDescription,
        courseImage,
        openCourseModal,
        closeStreakModal,
        setCourseDetails,
    }
})
