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
import { Edit2, Plus, Wrench } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLessonStore } from '@/stores/lesson';

interface LessonForm {
    id?: number
    title: string
    slug: string
    image: File | string | undefined
    bg: string
    lesson_order: number | null
    description: string
    locked?: boolean
}

const props = defineProps<{ lesson: LessonForm }>();

// Reactive object to hold the form data
const formData = ref<Partial<LessonForm>>({
    title: props.lesson.title,
    slug: props.lesson.slug,
    image: props.lesson.image,
    bg: props.lesson.bg,
    lesson_order: props.lesson.lesson_order,
    description: props.lesson.description,
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
const saveLesson = () => {
    lessonStore.updateLesson(props.lesson.id!, formData.value);
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

const open = ref(false);

</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger>
            <Button variant="ghost">
                <Wrench class="size-6" />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Lesson</DialogTitle>
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
                <Button @click="saveLesson">Update Lesson</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>