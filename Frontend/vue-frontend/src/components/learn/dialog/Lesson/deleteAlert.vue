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
import { useLessonStore } from "@/stores/lesson";
const lessonStore = useLessonStore();
defineProps<{
  lessonId: number | undefined
}>()

const deleteLesson = (lessonId: number) => {
  lessonStore.deleteLesson(lessonId);
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
        <Button size="sm" variant="ghost" ><Trash2 class="text-red-500 size-6"></Trash2></Button>
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
        <AlertDialogAction @click="lessonId !== undefined && deleteLesson(lessonId)">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>