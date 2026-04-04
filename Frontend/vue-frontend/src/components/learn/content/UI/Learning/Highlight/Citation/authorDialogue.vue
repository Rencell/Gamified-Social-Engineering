<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const isDialogOpen = ref(false)
const emit = defineEmits(['createAuthor']);

const fname = ref<string>('');
const lname = ref<string>('');

const addAuthor = () => {
  emit('createAuthor', fname.value.trim(), lname.value.trim());
  isDialogOpen.value = false; // Close the dialog after emitting the event\
  fname.value = ''; // Clear the input fields
  lname.value = '';
}
</script>

<template>

  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button size="sm">Add Author</Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Author</DialogTitle>
        <DialogDescription>
          This will add a new author to the citation.
        </DialogDescription>
      </DialogHeader>


        <Label class="text-sm font-medium">First Name:</Label>
        <Input
          v-model="fname"
          type="text"
          min="1"
          max="50"
          placeholder="First Name"    
        />
        
        <Label class="text-sm font-medium">Last Name (Optional)</Label>
        <Input
          v-model="lname"
          type="text"
          min="1"
          max="50"
          placeholder="Last Name"
        />

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">Cancel</Button>
        </DialogClose>

        <!-- Do NOT wrap with DialogClose so it stays open while loading -->
        <Button @click="addAuthor">
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>