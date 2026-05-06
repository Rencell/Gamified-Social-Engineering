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
import { Input, InputProfanity } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLessonStore } from '@/stores/lesson';
import { useSectionStore } from '@/stores/sections';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
import { Spinner } from '@/components/ui/spinner';
import type { Section } from '@/services/sectionService';
const lessonStore = useLessonStore();
const sectionStore = useSectionStore();

const formData = ref<Partial<Section>>({
    name: '',
    description: '',
    lesson: 0,
});

const inputProfanityFilter = ref(false);
const textAreaProfanityFilter = ref(false);

// Add validation state
const errors = ref<{ name?: string; description?: string }>({});
const touched = ref<{ name: boolean; description: boolean }>({ name: false, description: false });

const validate = () => {
    if (inputProfanityFilter.value || textAreaProfanityFilter.value) {
        return false;
    }

    const e: typeof errors.value = {};
    if (!formData.value.name || formData.value.name.trim().length === 0) {
        e.name = 'Title is required.';
    }
    const descLen = (formData.value.description || '').trim().length;
    if (descLen > 5) {
        e.description = 'Description must be at least 5 characters.';
    }
    errors.value = e;
    return Object.keys(e).length === 0;
};

// Function to handle saving the form data
const loading = ref(false);
const saveSection = async () => {
    if (inputProfanityFilter.value || textAreaProfanityFilter.value) {
        alert('Please remove inappropriate language from the form before saving.');
        return;
    }
    if (loading.value) return;
    touched.value = { name: true, description: true };
    if (!validate()) return;

    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    loading.value = true;
    try {
        await sectionStore.createSection(formData.value as Section);
        formData.value.name = '';
        formData.value.description = '';
        errors.value = {};
        touched.value = { name: false, description: false };
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    
    <Dialog>
        <DialogTrigger>
            <Button>
                <Plus /> Create Section
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new lesson. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Form Fields -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Title</Label>
                    <InputProfanity 
                        v-model="formData.name" 
                        v-model:is-profane="inputProfanityFilter"
                        type="text" 
                        placeholder="Enter module title"
                        @blur="touched.name = true; validate()"
                        @input="touched.name && validate()" 
                    />
                    <p v-if="touched.name && errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Description</Label>
                    <InputProfanity 
                        v-model="formData.description" 
                        v-model:is-profane="textAreaProfanityFilter"
                        type="text" 
                        placeholder="Enter module description"
                        @blur="touched.description = true; validate()"
                        @input="touched.description && validate()" 
                    />
                    <p v-if="touched.description && errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
                </div>
            </div>

            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="saveSection" :disabled="!validate() || loading" :class="[{ 'opacity-50 cursor-not-allowed': !validate() || loading }]">
                        <template v-if="loading">
                            <Spinner class="mr-2" /> Saving...
                        </template>
                        <template v-else>
                            Save Section
                        </template>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    
</template>