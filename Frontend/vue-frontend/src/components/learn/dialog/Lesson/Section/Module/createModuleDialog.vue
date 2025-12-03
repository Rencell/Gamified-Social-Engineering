<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
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
import type { ModuleTest } from '@/services/moduleService';
import { Checkbox } from '@/components/ui/checkbox';
import { useModuleStore } from '@/stores/module';
import { useRoute } from 'vue-router';
import { useSectionStore } from '@/stores/sections';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
const lessonStore = useLessonStore();
const moduleStore = useModuleStore();
const sectionStore = useSectionStore();
const route = useRoute();


const props = defineProps<{
    sectionId?: number;
}>();

const formData = ref<Partial<ModuleTest>>({
    title: '',
    final: false,
    lesson:  0,
    section: props.sectionId || null,
});

// Add validation state for title
const errors = ref<{ title?: string }>({});
const touched = ref<{ title: boolean }>({ title: false });

const validate = () => {
    const e: typeof errors.value = {};
    if (!formData.value.title || formData.value.title.trim().length === 0) {
        e.title = 'Title is required.';
    }
    errors.value = e;
    return Object.keys(e).length === 0;
};

// Function to handle saving the form data
const saveModule = () => {
    touched.value.title = true;
    if (!validate()) return;
    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    moduleStore.createModule(formData.value);
    formData.value.title = '';
    formData.value.final = false;
    errors.value = {};
    touched.value.title = false;
};

const hasFinalModule = computed(() => {
    return sectionStore.sections.filter((section) => section.id === props.sectionId).some((section) => {
        return section.modules.some((mod) => mod.final);
    });
});

watch(() => formData.value.final, (newLesson) => {
    if (newLesson) {
        formData.value.title = 'Final Module';
    }else {
        formData.value.title = '';
    }
    // Re-validate on change
    if (touched.value.title) validate();
});


</script>

<template>
    <Dialog>
        <DialogTrigger>
            <Button>
                <Plus /> Create New Lesson
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new lesson. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Form Fields -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Title</Label>
                    <Input v-model="formData.title" type="text" placeholder="Enter module title"
                           @blur="touched.title = true; validate()"
                           @input="touched.title && validate()" />
                    <p v-if="touched.title && errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
                </div>
            </div>

            <DialogFooter>
                
                <div class="space-y-2 flex items-center">
                    <div class="flex gap-4">
                        
                        <p class="text-xs" v-show="hasFinalModule">(You can only add one Final Module)  </p>
                        <Checkbox v-model="formData.final" :disabled="hasFinalModule">
                                
                        </Checkbox> 
                        <Label>Is Final?</Label>
                    </div>
                </div>
                <DialogClose as-child>
                    <Button @click="saveModule" :disabled="!validate()" :class="[{ 'opacity-50 cursor-not-allowed': !validate() }]">Save Module</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    
</template>