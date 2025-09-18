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


// Function to handle saving the form data
const saveModule = () => {
    formData.value.lesson = lessonStore.currentLesson?.id || 0;
    moduleStore.createModule(formData.value);
    formData.value.title = '';
    formData.value.final = false;
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
                    <Input v-model="formData.title" type="text" placeholder="Enter module title" />
                    
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
                <Button @click="saveModule">Save Module</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    
</template>