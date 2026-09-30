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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/stores/content";
import { Trash2 } from "lucide-vue-next";
const contentStore = useContentStore();
defineProps<{
  ContentId: number | undefined
}>()

const deleteContent = async(contentId: number) => {
  try {
    await contentStore.deleteContent(contentId);
  } catch (e) {
    console.error(e);
  }
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
        <Button variant="outline" size="sm" class="h-8 w-8 p-0">
          <Trash2 class="w-4 h-4 text-red-500" />
        </Button>
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
        <AlertDialogAction @click="ContentId !== undefined && deleteContent(ContentId)">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>