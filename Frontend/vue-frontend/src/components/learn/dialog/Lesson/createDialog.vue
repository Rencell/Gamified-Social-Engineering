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
    await lessonStore.createLesson(formData.value);
    open.value = false;
};


function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    formData.value.image = file;

  } else {
    formData.value.image = null!;
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
                    <Input v-if="field.type !== 'textarea' && field.type !== 'file'" v-model="formData[field.key] as string" :type="field.type"
                        :placeholder="field.placeholder" />
                    <Input v-else-if="field.type === 'file'" @change="onFileChange" :type="field.type"
                        :placeholder="field.placeholder" />
                    <Textarea v-else v-model="formData[field.key] as string" :placeholder="field.placeholder" />
                </div>
            </div>

            <DialogFooter>
                <Button @click="saveLesson">Save Lesson</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>