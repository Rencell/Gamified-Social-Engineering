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
import { Label } from '@/components/ui/label';
import type { Assessment } from '@/services/assessmentService';
import { useAssessmentStore } from '@/stores/assessment';
const formData = ref<Partial<Assessment>>({
    name: '',
    bg: '',
    image: '',
    duration: 0,
    description: 'description',
    difficulty_level: 'begginer',
    question_count: 0,
    instructions: []
});


function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    formData.value.image = file;

  } else {
    formData.value.image = null!;
  }
}

const submitForm = () => {
    useAssessmentStore().create(formData.value as any);
};

</script>

<template>
    <Dialog>
        <DialogTrigger asChild>
            <Button>
                <Plus /> Create New Assessment
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new item. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Your existing form fields -->
            <div class="space-y-4">
                <Label for="item-name">Item name:</Label>
                <Input id="item-name" v-model="formData.name" type="text" placeholder="Enter item name"></Input>
                
                <Label for="item-image">Upload Image:</Label>
                <Input id="item-image" type="file" @change="onFileChange"></Input>

                <Label for="item-bg">Background Color:</Label>
                <Input id="item-bg" v-model="formData.bg" type="color" placeholder="Enter item type"></Input>

                <Label for="item-duration">Item duration:</Label>
                <Input id="item-duration" v-model="formData.duration" type="number" placeholder="Enter item duration"></Input>
            </div>

            <DialogFooter>
                <Button @click="submitForm">Save Item</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>