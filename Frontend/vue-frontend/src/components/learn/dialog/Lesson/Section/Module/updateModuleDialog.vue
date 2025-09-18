<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const moduleStore = useModuleStore();


const props = defineProps<{
    module: ModuleTest
}>()
const formData = ref<Partial<ModuleTest>>({
    id: props.module.id || 0,
    title: props.module.title || '',
    section: props.module.section || 0,
    lesson:  0,
});

// Function to handle saving the form data
const saveModule = () => {
    formData.value.lesson = props.module.lesson || 0;
    moduleStore.updateModule(formData.value);
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
                    <Input v-model="formData.title" type="text" placeholder="Enter module title" />
                    
                </div>
            </div>

            <DialogFooter>
               
                <Button @click="saveModule">Save Module</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>