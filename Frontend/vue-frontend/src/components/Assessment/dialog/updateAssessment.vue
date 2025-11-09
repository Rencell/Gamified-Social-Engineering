<script setup lang="ts">
import { computed, ref } from 'vue';
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
import { Pen, Plus, Wrench } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Assessment } from '@/services/assessmentService';
import { useCosmeticStore } from '@/stores/cosmetic';
import { useUploadContent } from '@/composables/useUploadContent';
import { useAssessmentStore } from '@/stores/assessment';



const props = defineProps<{
    data?: Partial<Assessment>;
}>();

const formData = computed(() => ({
    ...props.data,
}));

// Function to handle saving the form data
const assessmentStore = useAssessmentStore();
const updateAssessment = () => {
    assessmentStore.update(formData.value as Assessment);
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

const handleClick = (event: Event) => {
  event.stopPropagation();
  event.preventDefault();
  // Any additional logic
};
</script>

<template>
    <Dialog>
        
        <DialogTrigger asChild>
            <!-- This div will be clickable and trigger the dialog -->
            <Button @click.stop="handleClick"><Wrench></Wrench></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Assessment</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new item. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Your existing form fields -->
            <div class="space-y-4">
                <Label for="item-name">Name:</Label>
                
                <Input id="item-name" v-model="formData.name" type="text" placeholder="Enter item name"></Input>
                
                <Label for="item-price">Price:</Label>
                <Input id="item-price" v-model="formData.bg" type="color" placeholder="Price"></Input>
                
                <Label for="item-image">Upload Image:</Label>
                <Input id="item-image" type="file" @change="onFileChange"></Input>

                <Label for="item-duration">Duration:</Label>
                <Input id="item-duration" v-model="formData.duration" type="number" placeholder="Enter item duration"></Input>
            </div>

            <DialogFooter>
                <Button @click="updateAssessment">Update Assessment</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>