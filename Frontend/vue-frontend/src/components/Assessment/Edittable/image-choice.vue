<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { computed, ref, onMounted } from 'vue';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import type { Question } from '@/services/assessmentService';
import { useAssessmentStore } from '@/stores/assessment';

const assessmentStore = useAssessmentStore();
const image1 = useUploadContentQuiz();
const image2 = useUploadContentQuiz();

const props = defineProps<{
    question: Question;
}>();

const quizData = computed(() => props.question);

// Add a local state to track selected answer when no options exist
const localSelectedAnswer = ref<"image1" | "image2">("image1");

const quizanswer = computed({
  get() {
    // If no options exist yet, return local state
    if (!quizData.value.options || quizData.value.options.length === 0) {
      return localSelectedAnswer.value;
    }
    
    // If options exist, find the correct one
    const correct = quizData.value.options.find(o => o.is_correct);
    if (!correct) {
      return localSelectedAnswer.value; // Fallback to local state
    }
    
    // Return based on which option is correct
    return correct.id === quizData.value.options[0]?.id ? "image1" : "image2";
  },
  set(id: "image1" | "image2") {
    // Always update local state
    localSelectedAnswer.value = id;
    
    // If options exist, update them
    if (quizData.value.options && quizData.value.options.length >= 2) {
      quizData.value.options.forEach((opt, index) => {
        opt.is_correct = 
          (id === "image1" && index === 0) ||
          (id === "image2" && index === 1);
      });
    }
  }
});

const toggleCorrectAnswer = ref(false);

function setCorrectAnswer(id: "image1" | "image2") {
  toggleCorrectAnswer.value = true;
  quizanswer.value = id;
  console.log('Selected answer:', quizanswer.value); // Remove alert for better UX
}

// Initialize local state when component mounts
onMounted(() => {
  if (quizData.value.options && quizData.value.options.length >= 2) {
    const correct = quizData.value.options.find(o => o.is_correct);
    if (correct) {
      const index = quizData.value.options.indexOf(correct);
      localSelectedAnswer.value = index === 0 ? "image1" : "image2";
    }
  }
});

const toggleChange = ref(false);
const toggle = () => {
    toggleChange.value = !toggleChange.value;
};

const saveChanges = async () => {
    toggle();
    setTimeout(() => {
        toggle();
    }, 1000); // Use setTimeout instead of setInterval
    await assessmentStore.updateQuestions(quizData.value);
};

function addOption() {
    if (quizData.value.options && quizData.value.options.length >= 2) {
        updateOption();
        return;
    }
    
    // Create both options at once to ensure consistency
    const options = [];
    
    if (image1.selectedFile.value) {
        const option1 = {
            id: Date.now(), // Generate unique ID
            text: 'Image Option 1',
            question: quizData.value.id as number,
            image: image1.selectedFile.value,
            is_correct: localSelectedAnswer.value === 'image1'
        };
        options.push(option1);
    }
    
    if (image2.selectedFile.value) {
        const option2 = {
            id: Date.now() + 1, // Generate unique ID
            text: 'Image Option 2', 
            question: quizData.value.id as number,
            image: image2.selectedFile.value,
            is_correct: localSelectedAnswer.value === 'image2'
        };
        options.push(option2);
    }
    
    // Add options to store
    options.forEach(option => {
        assessmentStore.addOption(option);
    });
    
    // Update local quiz data
    if (!quizData.value.options) {
        quizData.value.options = [];
    }
    quizData.value.options.push(...options);
}

const updateOption = async () => {
    if (!quizData.value.options || quizData.value.options.length < 2) return;
    
    if (toggleCorrectAnswer.value) { 
        await assessmentStore.updateOption({
            is_correct: localSelectedAnswer.value === 'image1', 
            id: quizData.value.options[0].id
        });   
        await assessmentStore.updateOption({
            is_correct: localSelectedAnswer.value === 'image2', 
            id: quizData.value.options[1].id
        });
        toggleCorrectAnswer.value = false; // Reset flag
    } 
    
    if (!image1.changeUpdate.value && !image2.changeUpdate.value) return;

    if (image1.selectedFile.value && quizData.value.options[0]) {
        await assessmentStore.updateOption({
            image: image1.selectedFile.value, 
            id: quizData.value.options[0].id
        });   
    }
    if (image2.selectedFile.value && quizData.value.options[1]) {
        await assessmentStore.updateOption({
            image: image2.selectedFile.value, 
            id: quizData.value.options[1].id
        });   
    }
}

// Helper computed to check if we can save
const canSave = computed(() => {
  return (image1.changeUpdate.value || image2.changeUpdate.value) || toggleCorrectAnswer.value;
});
</script>

<template>
    <!-- Question Section -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                Question Content
                <Badge variant="secondary" class="text-xs">Required</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <div>
                <label class="text-sm font-medium text-foreground mb-2 block">Question Text</label>
                <Textarea 
                    v-model="quizData.text" 
                    placeholder="Enter your question here..."
                    class="min-h-[100px] resize-none !bg-background" 
                />
            </div>
            <div class="flex justify-end mt-4 items-center gap-3">
                <p v-if="toggleChange" class="text-green-500 text-sm">Save Success</p>
                <Button @click="saveChanges">Save Changes</Button>
            </div>
        </CardContent>
    </Card>

    <!-- Answer Options -->
    <Card>
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    Two Image Options
                </CardTitle>
            </div>
            
            <div class="flex gap-4 w-full mt-5">
                <div class="flex-1 cursor-pointer">
                    <Input type="file" class="mb-5 !bg-background" @change="image1.onFileChange" />
                    <div 
                        class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
                        :class="{ 'border-accent': quizanswer === 'image1' }"
                        @click="setCorrectAnswer('image1')"
                    >
                        <img 
                            v-if="image1.selectedFile.value || (quizData.options && quizData.options[0]?.image)"
                            :src="image1.selectedFile.value ? String(image1.previewUrl.value) : String(quizData.options[0]?.image)" 
                            alt="Image 1" 
                            class="h-full object-cover"
                        >
                        <div v-else class="text-gray-400 text-center">
                            <p>Upload image...</p>
                        </div>
                    </div>
                    <p 
                        class="text-center mt-5" 
                        :class="quizanswer === 'image1' ? 'brightness-100 font-semibold text-accent' : 'brightness-50'"
                    >
                        Image 1
                    </p>
                </div>
                
                <div class="flex-1 cursor-pointer">
                    <Input type="file" class="mb-5 !bg-background" @change="image2.onFileChange" />
                    <div 
                        class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
                        :class="{ 'border-accent': quizanswer === 'image2' }"
                        @click="setCorrectAnswer('image2')"
                    >
                        <img 
                            v-if="image2.selectedFile.value || (quizData.options && quizData.options[1]?.image)"
                            :src="image2.selectedFile.value ? String(image2.previewUrl.value) : String(quizData.options[1]?.image)"
                            alt="Image 2" 
                            class="h-full object-cover"
                        >
                        <div v-else class="text-gray-400 text-center">
                            <p>Upload image...</p>
                        </div>
                    </div>
                    <p 
                        class="text-center mt-5" 
                        :class="quizanswer === 'image2' ? 'brightness-100 font-semibold text-accent' : 'brightness-50'"
                    >
                        Image 2
                    </p>
                </div>
            </div>
            
            <div class="flex justify-end mt-4">
                <Button 
                    @click="addOption"
                    :disabled="!canSave"
                    class="gap-2"
                >
                    Save Images
                </Button>
            </div>
        </CardHeader>
    </Card>
</template>