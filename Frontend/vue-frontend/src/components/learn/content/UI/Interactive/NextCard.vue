<template>

  <div v-if="editable" class="space-y-4">
    <Card>
      <CardContent class="flex justify-between">
        <div class="flex gap-2 items-center">
          <Button size="sm" @click="addCard()">
            <Plus></Plus>
            Add Step
          </Button>
          <Button @click="saveHandler" class="bg-green-700" size="sm">
            <Check></Check>
            Save Changes
          </Button>
          <p v-if="successMessage" class="text-xs text-green-500" v-show="successMessage">
            Save success!
          </p>
        </div>

        <div>
          <Button v-show="canMoveUp" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Up"
            @click="reorderComponent('up')">
            <ChevronUp class="w-3 h-3" />
          </Button>
          <Button v-show="canMoveDown" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Down"
            @click="reorderComponent('down')">
            <ChevronDown class="w-3 h-3" />
          </Button>

          <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponent">
            <Trash2 class="w-4 h-4" color="red" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>

  <div class="py-20 w-full flex-center overflow-auto rounded-xl">
    <div class="w-2xl flex justify-between items-center">
      <!-- Stepback -->
      <div>
        <div
          :class="['cursor-pointer w-13 h-13 rounded-full bg-black flex-center transition-opacity duration-500', currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer']"
          @click="previousTip">
          <StepBack />
        </div>
      </div>

      <!-- Card Content -->
      <div v-if="currentIndex === 0"
        class="motion-preset-slide-right motion-delay-500 gap-4 w-lg shadow-xl rounded-lg bg-primary p-10 h-fit flex-center flex-col text-black">
        <strong class="text-center text-2xl">Five Steps to Protect from Phishing</strong>
        <img src="https://picsum.photos/id/1/600/200" alt="Step Image" />
        <p class="text-center text-sm/6">
          By taking the following steps promptly and systematically, you can significantly reduce the risk of falling
          victim to phishing attacks.
        </p>
        <Button @click="nextTip">Next</Button>
      </div>

      <div v-else :key="currentTip.id"
        class="motion-preset-slide-right motion-delay-500 gap-4 w-lg shadow-md border-1 border-gray-200 rounded-lg bg-white p-10 h-fit flex-center flex-col text-black">
        <div v-if="editable" class="w-full">
          <Input v-model="currentTip.head"></Input>
          <div class="relative my-5 w-full bg-background p-3 rounded-xl">
            
            <img :src="String(image.previewUrl.value) || useImageUrl(currentTip.image)!" class=" rounded-lg" alt="Step Image" />
            <div class="flex mt-5 gap-3" >
              <Input type="file" @change="image.onFileChange"></Input>
              <Button @click="handleUploadImage">Save Changes</Button>
            </div>
          </div>
          <Textarea v-model="currentTip.text"></Textarea>
        </div>

        <div v-else class="flex flex-col items-center gap-4">
          <div class="py-2 px-7 font-bold text-lg bg-accent rounded-lg absolute text-white -top-5">
            Step {{ currentTip.id }}
          </div>
          <strong class="text-center text-2xl">
            {{ currentTip.head }}</strong>
          <div class="relative mb-5 w-full bg-background p-3 rounded-xl">
  
            <img :src="useImageUrl(currentTip.image)!" class=" rounded-lg" alt="Step Image" />
          </div>
          <p class="text-center text-sm/6 font-semibold">{{ currentTip.text }}</p>
        </div>


        <div class="flex gap-3 text-gray-500">
          <div v-for="index in data.length" :key="index" :class="[
            'text-black border-2 rounded-full w-7 h-7 flex-center',
            currentTip.id === index ? 'border-accent' : 'border-ternary',
          ]">
            <p v-if="index !== data.length">{{ index }}</p>
            <p v-else>✔</p>
          </div>
        </div>
      </div>

      <!-- Stepforward -->
      <div
        :class="['w-13 h-13 rounded-full bg-black flex-center transition-opacity duration-500', currentIndex === data.length ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer']"
        @click="nextTip">
        <StepForward />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { useEditableText } from '@/composables/useEditableText';
import { useImageUrl } from '@/composables/useImageUrl';
import { useUploadContent } from '@/composables/useUploadContent';
import type { Content } from '@/services/contentService';
import { Check, ChevronDown, ChevronUp, Plus, StepBack, StepForward, Trash2 } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const image = useUploadContent();

// Props
const props = defineProps<{
  data: { id: number; head: string; text: string, image: string }[];
  item?: Content
  siblings?: Content[];
}>();

const data = computed(() => props.data || []);
// State
const currentIndex = ref(0);

// Computed Property for Current Tip
const currentTip = computed(() => data.value[currentIndex.value - 1]);

// Methods
const nextTip = () => {
  image.previewUrl.value = null;
  if (currentIndex.value < data.value.length) {
    currentIndex.value++;
  }
};

const previousTip = () => {
  image.previewUrl.value = null;
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const successMessage = ref(false);
const saveHandler = () => {

  updateProps({ data: data.value })
  successMessage.value = true;
  setTimeout(() => {
    successMessage.value = false;
  }, 2000);
}


async function handleUploadImage() {
  await image.uploadImage(
    { item: { id: props.item?.id }, image: currentTip.value.image},
    (data) => {
      if (currentTip.value) {
        currentTip.value.image = data.image;
      }
    }
  );
  saveHandler();
}

const addCard = () => {
  const newId = data.value.length + 1;
  data.value.push({
    id: newId,
    head: `New Step ${newId}`,
    text: 'New step description.',
    image: '/media/content_images/Website.png'
  });
};

// Emits an event when an image is selected
const emit = defineEmits(['imageSelected', 'showDown', 'giveProps']);

const { editable, updateProps, deleteComponent, reorderComponent }
  = useEditableText(null, emit)

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

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-sm\/6 {
  line-height: 1.6;
}
</style>