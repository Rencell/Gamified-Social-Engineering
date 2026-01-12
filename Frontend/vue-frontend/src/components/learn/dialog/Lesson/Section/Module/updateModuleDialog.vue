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
import { Wrench } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ModuleTest } from '@/services/moduleService';
import { useModuleStore } from '@/stores/module';
import { useLessonStore } from '@/stores/lesson';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
import { Spinner } from '@/components/ui/spinner';

const moduleStore = useModuleStore();
const lessonStore = useLessonStore();

const props = defineProps<{
    module: ModuleTest
}>()
const formData = ref<Partial<ModuleTest>>({
    id: props.module.id || 0,
    title: props.module.title || '',
    section: props.module.section || 0,
    lesson:  0,
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
const loading = ref(false);
const saveModule = async () => {
    if (loading.value) return;
    touched.value.title = true;
    if (!validate()) return;
    formData.value.lesson = props.module.lesson || lessonStore.currentLesson?.id || 0;
    loading.value = true;
    try {
        await moduleStore.updateModule(formData.value);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Dialog>
        <DialogTrigger>
            
            <Button size="sm" variant="ghost"><Wrench /></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Module</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new module. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Form Fields -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>Title</Label>
                    <Input v-model="formData.title" type="text" placeholder="Enter module title" @blur="touched.title = true; validate()" @input="validate()" />
                    <p v-if="touched.title && errors.title" class="text-red-500">{{ errors.title }}</p>
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button @click="saveModule" :disabled="loading">
                        <Spinner v-if="loading" class="mr-2" />
                        Save Module
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>