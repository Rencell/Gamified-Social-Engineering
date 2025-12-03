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
import { useRouter } from "vue-router";
const router = useRouter();
const lessonStore = useLessonStore();
defineProps<{
  lessonId: number | undefined
}>()

const deleteLesson = async(lessonId: number) => {
  try {
    await lessonStore.deleteLesson(lessonId);
    router.replace({ name: 'Learn' }); // or router.push(...)
  } catch (e) {
    console.error(e);
  }
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