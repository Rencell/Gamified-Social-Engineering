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
import type { Cosmetic } from '@/services/cosmeticService';
import { useCosmeticStore } from '@/stores/cosmetic';
import { useUploadContent } from '@/composables/useUploadContent';


const formData = ref<Partial<Cosmetic>>({
    name: '',
    type: '',
    image: '',
    price: 0,
    rive_code: 0
});

// Function to handle saving the form data
const cosmeticStore = useCosmeticStore();
const saveCosmetic = () => {
    cosmeticStore.createCosmetic(formData.value);
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
    <Dialog>
        <DialogTrigger asChild>
            <!-- This div will be clickable and trigger the dialog -->
            <div class="rounded-lg border-4 border-secondary border-dashed flex flex-col justify-center items-center p-4 cursor-pointer hover:border-accent hover:bg-accent/10 transition w-full h-full">
                <Plus :size="24" class="mb-2" />
                <span class="text-sm font-medium">Add New Item</span>
            </div>
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
                
                <Label for="item-type">Item type:</Label>
                <select id="item-type" v-model="formData.type" class="w-full p-2 border rounded bg-background">
                    <option value="" disabled>Select item type</option>
                    <option value="background">Background</option>
                    <option value="avatar">Avatar</option>
                </select>
                
                <Label for="item-price">Price:</Label>
                <Input id="item-price" v-model="formData.price" type="number" placeholder="Price"></Input>
                
                <Label for="item-image">Upload Image:</Label>
                <Input id="item-image" type="file" @change="onFileChange"></Input>

                <div v-if="formData.type === 'avatar'" class="space-y-4">
                    <Label for="item-rave-id">Rave Id:</Label>
                    <Input id="item-rave-id" type="text" v-model="formData.rive_code" @change="onFileChange"></Input>
                </div>
            </div>

            <DialogFooter>
                <Button @click="saveCosmetic">Save Item</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>