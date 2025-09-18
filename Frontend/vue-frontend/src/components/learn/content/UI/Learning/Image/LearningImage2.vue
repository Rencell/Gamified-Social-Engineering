<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input/index.ts';
import { Label } from '@/components/ui/label/index.ts';
import { Button } from '@/components/ui/button';
import { ContentService } from '@/services';
import { useEditableText } from '@/composables/useEditableText';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-vue-next';
import type { Content } from '@/services/contentService';
import { useImageUrl } from "@/composables/useImageUrl";
const props = defineProps<{
  image?: string
  source?: string
  item?: Content
  siblings?: Content[]
}>()
const fullscreen = ref(false);

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};


const fullImageUrl = computed(() => useImageUrl(props.image));


const previewUrl = ref<string | null>(fullImageUrl.value ?? null);
const selectedFile = ref<File | null>(null);

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    selectedFile.value = file;

    // Clean up previous preview
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
  } else {
    selectedFile.value = null;
    previewUrl.value = props.image ?? null;
    // updateProps(previewUrl.value);
  }
}

const changeUpdate = ref(false);
async function uploadImage() {
  if (!selectedFile.value) {
    alert("Please select an image first");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile.value as Blob);
  if (props.item && props.item.id !== undefined) {
    formData.append("content_item", String(props.item.id));
  } else {
    console.error("props.item is undefined or missing 'id'");
    return;
  }
  const response = await ContentService.uploadImage(formData);

  const data = response;
  console.log("Uploaded:", data);
  const url = new URL(data.image);
  const path = url.pathname;
  changeUpdate.value = true;
  updateProps({ image: path })
}

const emit = defineEmits(['giveProps', 'signalDelete']); // Define emits
const { editable, updateProps, deleteComponent, reorderComponent }
  = useEditableText({ image: props.image || null }, emit)


const canMoveUp = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index > 0;
});

const canMoveDown = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index < props.siblings.length - 1;
});

</script>

<template>
  <div v-if="fullscreen" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    @click="toggleFullscreen">
    <img :src="previewUrl ?? undefined" alt="Fullscreen image" class="max-w-full max-h-full object-contain" />
  </div>
  <div class="relative mb-5 w-full h-100 sm:h-auto bg-background p-3 rounded-xl">
    <img v-if="previewUrl" :src="previewUrl" alt="Learning content image" class="w-full h-full object-cover rounded-xl"
      @click="toggleFullscreen" />

  </div>
  <template v-if="editable">
    <div class="space-y-2 bg-background p-4 rounded-lg mb-5 group relative">
      <Label for="picture">Picture</Label>
      <Input id="picture" type="file" @change="onFileChange"></Input>

      <Button v-if="previewUrl" @click="uploadImage">Upload</Button>
      <span v-if="changeUpdate" class="text-xs text-green-400 ms-2">Updated Successfully</span>

      <div class="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button v-show="canMoveUp" @click="reorderComponent('up')" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Up">
          <ChevronUp class="w-3 h-3" />
        </Button>
        <Button v-show="canMoveDown" @click="reorderComponent('down')" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Down">
          <ChevronDown class="w-3 h-3" />
        </Button>

        <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponent">
          <Trash2 class="w-4 h-4" color="red" />
        </Button>
      </div>
    </div>
  </template>

</template>

<style scoped>
/* Disable transitions for the fullscreen div */
.fixed {
  transition: none !important;
}
</style>