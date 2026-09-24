import { SimulationService } from "@/services";
import type { SimulationGuide } from "@/services/simulationService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSimulationStore = defineStore('pageSimulation', () => {

    const simulationGuides = ref<SimulationGuide[]>();

    const getDialogService = async (type: string) => {
        try {
            simulationGuides.value = await SimulationService.simulationGuides.get_type(type);
        } catch (error) {
            console.error('Failed to load DialogService:', error);
        }
    }   

    return {
        simulationGuides,
        getDialogService,
    }
  })