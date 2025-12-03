<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLessonStore } from '@/stores/lesson';

interface LessonForm {
    title: string
    slug: string
    image: File | string | undefined
    bg: string
    lesson_order: number | null
    description: string
    locked?: boolean
    objective: string[]
}
// control dialog open state
const open = ref(false);

// Reactive object to hold the form data
const formData = ref<LessonForm>({
    title: '',
    slug: '',
    image: null!,
    bg: '',
    lesson_order: null,
    description: '',
    objective: [],
});

// Validation state and helpers
const errors = ref<Partial<Record<keyof LessonForm, string>>>({});
const setError = (key: keyof LessonForm, message?: string) => {
  if (message) errors.value[key] = message; else delete errors.value[key];
};
const validateField = (key: keyof LessonForm) => {
  const v = formData.value[key] as any;
  switch (key) {
    case 'title':
      setError('title', !v || String(v).trim().length < 3 ? 'Title is required (min 3 characters).' : undefined);
      break;
    case 'image':
      if (!v) setError('image', 'Image is required.');
      else if (v instanceof File && !v.type?.startsWith('image/')) setError('image', 'File must be an image.');
      else setError('image');
      break;
    case 'bg':
      setError('bg', !v ? 'Background is required.' : undefined);
      break;
    case 'description':
      setError('description', !v || String(v).trim().length < 10 ? 'Description must be at least 10 characters.' : undefined);
      break;
    default:
      break;
  }
};
const validateForm = () => {
  (['title','image','bg','description'] as (keyof LessonForm)[]).forEach(validateField);
  return Object.keys(errors.value).length === 0;
};

// Array of field configurations
const fields: Array<{ key: keyof LessonForm; label: string; type: string; placeholder: string }> = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter lesson title' },
    { key: 'image', label: 'Image', type: 'file', placeholder: 'Upload an image' },
    { key: 'bg', label: 'Background', type: 'color', placeholder: 'Enter background color or image URL' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter lesson description' },
];

// Function to handle saving the form data
const lessonStore = useLessonStore();
const saveLesson = async () => {
    if (!validateForm()) return;
    await lessonStore.createLesson(formData.value);
    open.value = false;
};


function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    formData.value.image = file;
    validateField('image');
  } else {
    formData.value.image = null!;
    validateField('image');
  }
}

</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger>
            <Button>
                <Plus /> Create New Module
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new lesson. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Form Fields -->
            <div class="space-y-4">
                <div v-for="field in fields" :key="field.key" class="space-y-2">
                    <Label>{{ field.label }}</Label>
                    <!-- text/color inputs -->
                    <Input
                      v-if="field.type !== 'textarea' && field.type !== 'file'"
                      v-model="formData[field.key] as string"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      @blur="validateField(field.key)"
                      required
                    />
                    <!-- file input -->
                    <Input
                      v-else-if="field.type === 'file'"
                      @change="onFileChange"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      accept="image/*"
                      required
                    />
                    <!-- textarea -->
                    <Textarea
                      v-else
                      v-model="formData[field.key] as string"
                      :placeholder="field.placeholder"
                      @blur="validateField(field.key)"
                      required
                    />

                    <!-- inline error -->
                    <p v-if="errors[field.key]" class="text-red-500 text-sm">{{ errors[field.key] }}</p>
                </div>
            </div>

            <DialogFooter>
                <Button @click="saveLesson">Save Lesson</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>