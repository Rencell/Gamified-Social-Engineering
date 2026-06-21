<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-vue-next";
import { useModuleStore } from '@/stores/module';
import { useContentStore } from '@/stores/content';
import Loading from '@/components/loading.vue'

const questionCount = ref<number>(1)
const promptInstructions = ref<string>('')
const isGenerating = ref(false)
const isDialogOpen = ref(false)

const module = useModuleStore();
const contentStore = useContentStore();

const generateQuiz = async() => {
  const moduleId = module.selectedModule?.id;
  if (moduleId == null) {
    console.warn('Cannot generate quiz: selected module id is missing.');
    return;
  }

  try {
    isGenerating.value = true
    await contentStore.generateQuizAI(moduleId, contentStore.contentQuiz.type, questionCount.value, promptInstructions.value);

    // Close dialog on success
    isDialogOpen.value = false
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>

  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button><Sparkles fill="white" /> Generate Quiz</Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Generate a random quiz?</DialogTitle>
        <DialogDescription>
          This will automatically generate a random set of questions based on this module’s content.
          You can review and edit the generated questions afterward.
        </DialogDescription>
      </DialogHeader>

      <div v-if="isGenerating" class="py-4">
        <Loading />
      </div>

      <div v-else class="space-y-2">
        <label class="text-sm font-medium">Number of questions</label>
        <input
          v-model.number="questionCount"
          type="number"
          min="1"
          max="50"
          class="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <p class="text-xs text-muted-foreground">Choose how many quiz questions to generate (1–50).</p>
      </div>

      <div v-if="!isGenerating" class="space-y-2">
        <label class="text-sm font-medium">Additional instructions (optional)</label>
        <textarea
          v-model="promptInstructions"
          rows="4"
          maxlength="300"
          placeholder="e.g., Focus on real-world scenarios, include 2 harder questions, avoid trick wording."
          class="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <p class="text-xs text-muted-foreground">
          Add up to 300 characters to guide the generated quiz (tone, difficulty, focus areas).
        </p>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button :disabled="isGenerating" variant="outline">Cancel</Button>
        </DialogClose>

        <!-- Do NOT wrap with DialogClose so it stays open while loading -->
        <Button :disabled="isGenerating" @click="generateQuiz">
          <template v-if="isGenerating">
            Generating...
          </template>
          <template v-else>
            <Sparkles fill="white" /> Generate
          </template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>