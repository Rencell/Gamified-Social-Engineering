# Reusable Learning Store Strategy

## 1. Problem Analysis

The current `learning.ts` store is tightly coupled to the "Phishing" lesson. The `phishingModules` array is hardcoded, and the navigation functions (`nextModule`, `previousModule`) only operate on this specific array. This makes it difficult to add new lessons without duplicating the entire store's logic, leading to an unmaintainable and non-scalable architecture.

## 2. Proposed Data Structure

To create a reusable system, we need to decouple the lesson data from the store's logic. We will define a generic structure for lessons and modules.

### Module Interface

The `Module` interface will remain the same:

```typescript
export interface Module {
  title: string;
  component: object; // Vue component
  interactive?: boolean;
}
```

### Lesson Interface

We will introduce a `Lesson` interface:

```typescript
export interface Lesson {
  id: string; // e.g., 'phishing', 'password-security'
  title: string;
  description: string;
  modules: Module[];
}
```

### Centralized Lesson Data

All lesson data will be stored in a separate file, for example, `src/data/lessons.ts`. This file will export an object or a Map containing all available lessons.

**Example (`src/data/lessons.ts`):**

```typescript
import { Lesson } from '@/stores/learning';

// Import all module components
import PhishingIntro from '@/views/Learn/Phishing/Modules/introduction.vue';
// ... other phishing components

export const lessons: Record<string, Lesson> = {
  phishing: {
    id: 'phishing',
    title: 'Phishing Awareness',
    description: 'Learn to identify and protect yourself from phishing attacks.',
    modules: [
      { title: 'Introduction', component: PhishingIntro },
      // ... other modules
    ]
  },
  'password-security': {
    id: 'password-security',
    title: 'Password Security',
    description: 'Master the art of creating and managing strong passwords.',
    modules: [
      // ... modules for this lesson
    ]
  }
};
```

## 3. Refactored Store Design (`learning.ts`)

The `useLearningStore` will be refactored to manage the state of the *currently active* lesson.

### State

```typescript
import { lessons } from '@/data/lessons';

// ...

const state = () => ({
  lessons: lessons, // All available lessons
  currentLessonId: null as string | null,
  selectedModule: null as Module | null,
});
```

### Getters

```typescript
const getters = {
  currentLesson: (state) => {
    if (!state.currentLessonId) return null;
    return state.lessons[state.currentLessonId];
  },
  currentModules: (state) => {
    const lesson = getters.currentLesson(state);
    return lesson ? lesson.modules : [];
  }
};
```

### Actions

```typescript
const actions = {
  loadLesson(lessonId: string) {
    if (!this.lessons[lessonId]) {
      console.error(`Lesson with id '${lessonId}' not found.`);
      return;
    }
    this.currentLessonId = lessonId;
    // Set the first module as the selected one by default
    this.selectedModule = this.lessons[lessonId].modules[0] || null;
  },

  setSelectedModule(module: Module) {
    this.selectedModule = module;
  },

  nextModule() {
    const modules = this.currentModules;
    const currentIndex = modules.findIndex(m => m.title === this.selectedModule?.title);
    if (currentIndex !== -1 && currentIndex < modules.length - 1) {
      this.selectedModule = modules[currentIndex + 1];
    }
  },

  previousModule() {
    const modules = this.currentModules;
    const currentIndex = modules.findIndex(m => m.title === this.selectedModule?.title);
    if (currentIndex > 0) {
      this.selectedModule = modules[currentIndex - 1];
    }
  }
};
```

## 4. Example Usage in a Component

A component would first load a lesson and then use the store's state and actions to render the UI and handle navigation.

```vue
<script setup lang="ts">
import { useLearningStore } from '@/stores/learning';
import { onMounted } from 'vue';

const learningStore = useLearningStore();
const route = useRoute();

onMounted(() => {
  // Assuming the lesson ID comes from the route params
  const lessonId = route.params.lessonId as string;
  learningStore.loadLesson(lessonId);
});
</script>

<template>
  <div v-if="learningStore.currentLesson">
    <h1>{{ learningStore.currentLesson.title }}</h1>
    
    <ModuleSidebar>
      <ModuleSidebarItem 
        v-for="module in learningStore.currentModules" 
        :key="module.title" 
        :active="module.title === learningStore.selectedModule?.title"
        @click="learningStore.setSelectedModule(module)"
      >
        {{ module.title }}
      </ModuleSidebarItem>
    </ModuleSidebar>

    <ModuleContent :is="learningStore.selectedModule?.component" />

    <button @click="learningStore.previousModule">Previous</button>
    <button @click="learningStore.nextModule">Next</button>
  </div>
</template>
```

This strategy effectively decouples the data from the logic, making the learning store highly reusable and scalable for any number of future lessons.
