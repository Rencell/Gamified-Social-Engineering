import { onMounted } from 'vue'
import { useRewardStore } from '@/stores/reward'
import { useLearningStore } from '@/stores/learning'

interface UseModuleRewardOptions {
  emit: (...args: any[]) => void;
  totalLength: number
}

export function useModuleReward({ emit, totalLength }: UseModuleRewardOptions) {
  const rewardStore = useRewardStore()
  const learningStore = useLearningStore()

  onMounted(() => {
    emit('completeModule', false)
    if (!learningStore.selectedModule?.interactive) {
      
    }
  })
}
