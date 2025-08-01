<script setup lang="ts">
import Register from './register.vue'
import CheckInbox from './checkInbox.vue'
import { computed, ref, onMounted } from 'vue';
import Login from './login.vue'
import { useRoute } from 'vue-router';

const route = useRoute();

type ComponentKey = 'register' | 'inbox' | 'login';
const selectedComponent = ref<ComponentKey>('login');

const components: Record<ComponentKey, any> = {
  'register': Register,
  'inbox': CheckInbox,
  'login': Login,
};

const computedComponent = computed(() => {
  return components[selectedComponent.value];
});

const switchComponent = (component: ComponentKey) => {
  selectedComponent.value = component;
};

onMounted(() => {
  if (route.path.includes('/login')) {
    selectedComponent.value = 'login';
  } else if (route.path.includes('/register')) {
    selectedComponent.value = 'register';
  }
});

</script>

<template>
  <div class="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2 ">
    <!-- Left side - Illustration -->
    <div class="hidden lg:flex lg:flex-1 items-center justify-center p-8 border-r border-slate-800">
      <div class="max-w-xl">

        <h1 class="text-2xl font-bold text-white mb-4">Join the global fight against cybercrime</h1>
      </div>
    </div>

    <!-- Right side - Sign up form -->
    <div class="flex-1 lg:max-w-md xl:max-w-full flex items-center justify-center p-8 relative">
      <component :is="computedComponent" @switchComponent="switchComponent" />
    </div>
  </div>
</template>
