<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { Bookmark, BarChart3, Clock, ChevronRight } from 'lucide-vue-next'

export interface LessonModuleRecommendation {
  id: number | string
  title: string
  description?: string
}

export interface LessonRecommendation {
  id?: number | string
  icon?: Component 
  iconUrl?: string
  slug?: string
  title: string
  instructor?: string
  description?: string

  difficulty?: string
  duration?: string
  rating?: number
  ratingCount?: number

  modules: LessonModuleRecommendation[]
}

const props = defineProps<{ lesson: LessonRecommendation }>()

const isExpanded = ref(false)

const moduleCountLabel = computed(() => {
  const n = props.lesson.modules?.length ?? 0
  return `${n} module${n === 1 ? '' : 's'} to review`
})
</script>

<template>
  
  <div
    class="group relative overflow-hidden rounded-2xl border border-border bg-secondary p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
  >
    <!-- Bookmark button -->
    <button
      type="button"
      class="absolute right-4 top-4 rounded-lg bg-background/80 p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
      aria-label="Bookmark lesson"
    >
      <Bookmark class="h-5 w-5 fill-current" />
    </button>

    <!-- Icon Section -->
    <div class="mb-6">
      <component v-if="lesson.icon" :is="lesson.icon" />
      <img v-else-if="lesson.iconUrl" :src="lesson.iconUrl" alt="" class="h-10 w-10 object-contain" />
    </div>

    <!-- Content Section -->
    <div class="space-y-3">
      <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson</div>
      <h3 class="text-xl font-bold text-foreground">{{ lesson.title }}</h3>

      <p v-if="lesson.description" class="text-sm text-foreground/80 line-clamp-2">
        {{ lesson.description }}
      </p>

      <!-- Metadata Row -->
      <div class="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
        <div v-if="lesson.difficulty" class="flex items-center gap-1">
          <BarChart3 class="h-4 w-4" />
          <span>{{ lesson.difficulty }}</span>
        </div>
        <div v-if="lesson.duration" class="flex items-center gap-1">
          <Clock class="h-4 w-4" />
          <span>{{ lesson.duration }}</span>
        </div>
        <div v-if="lesson.rating != null" class="flex items-center gap-1">
          <span>⭐ {{ lesson.rating }}</span>
          <span v-if="lesson.ratingCount != null" class="text-muted-foreground/60">
            ({{ Number(lesson.ratingCount).toLocaleString() }})
          </span>
        </div>
      </div>

      <div class="border-t border-ternary pt-3">
        <button
          type="button"
          @click="isExpanded = !isExpanded"
          class="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-background/50"
        >
          <div class="text-left">
            <p class="text-xs font-semibold text-foreground">{{ moduleCountLabel }}</p>
            <p class="text-xs text-muted-foreground">Related to your assessment gaps</p>
          </div>
          <ChevronRight
            class="h-4 w-4 text-muted-foreground transition-transform"
            :class="isExpanded ? 'rotate-90' : ''"
          />
        </button>
        
        <div v-if="isExpanded" class="mt-3 space-y-2">
          <a
            v-for="module in lesson.modules"
            :key="module.id"
            :href="`/learn/${lesson.slug}`"
            class="flex items-start gap-3 rounded-lg bg-background/40 p-3 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <div class="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-foreground">{{ module.title }}</p>
              <p v-if="module.description" class="text-xs text-muted-foreground">{{ module.description }}</p>
            </div>
            <ChevronRight class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
