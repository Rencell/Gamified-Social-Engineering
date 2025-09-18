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
import { useModuleStore } from "@/stores/module";
import { onMounted } from "vue";
import type { ModuleTest } from "@/services/moduleService";
import { useSectionStore } from "@/stores/sections";
const moduleStore = useModuleStore();
const sectionStore = useSectionStore(); 
defineProps<{
  module: ModuleTest
}>()

const deleteModule = (moduleId: number) => {
  moduleStore.deleteModule(moduleId);
  sectionStore.sections.filter(section => {
    section.modules = section.modules.filter(mod => mod.id !== moduleId);
  });
}


</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
        <Button size="sm" variant="ghost" ><Trash2 class="text-red-500"></Trash2></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          module and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="deleteModule(module.id!)">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>