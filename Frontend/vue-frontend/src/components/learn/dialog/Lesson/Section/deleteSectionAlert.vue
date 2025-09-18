<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-vue-next";
import { useSectionStore } from "@/stores/sections";
const sectionStore = useSectionStore();
defineProps<{
  sectionId: number | undefined
}>()

const deleteSection = (sectionId: number) => {
  sectionStore.deleteSection(sectionId);
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
        <Button variant="ghost" size="icon"><Trash2 class="text-destructive size-5"></Trash2></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="sectionId !== undefined && deleteSection(sectionId)">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>