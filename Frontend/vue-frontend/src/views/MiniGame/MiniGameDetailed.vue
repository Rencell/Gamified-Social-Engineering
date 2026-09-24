<template>
    <RouterLink :to="{ name: 'MiniGames' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    
    
    <Loading v-if="loading"></Loading>
    <component v-else class="border-7 border-ternary rounded-2xl" :is="game"></component>

</template>

<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import Error from '@/components/MiniGames/errorPage.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { MinigameService } from '@/services';
import type { Minigame } from '@/services/minigameService';
import { useAuthStore } from '@/stores/auth';
import Loading from '@/components/loading.vue';
const modules = import.meta.glob('/src/components/MiniGames/**/game.vue') as Record<string, () => Promise<{ default: import('vue').Component }>>;

const route = useRoute();
const gameId = route.params.gameId as string;
const authStore = useAuthStore();
const thegame = ref('');
const loading = ref(false);
function sanitizeToPath(id: string) {
  return (id || '').replace(/\\+/g, '/').replace(/\/+$/, '') + '/'
}

onMounted(() => {
    loading.value = true;
    const numericId = Number(gameId);
    const directPath = sanitizeToPath(typeof gameId === 'string' ? gameId : '');
    const directModulePath = `/src/components/MiniGames/${directPath}game.vue`;

    try {
      // If a local component exists for the given param, prefer it directly.
      if (modules[directModulePath]) {
        thegame.value = directPath;
        return;
      }

      if (!Number.isNaN(numericId)) {
        MinigameService.get_minigame_by_id(numericId).then((minigame: Minigame) => {
          // Enforce lock: if user level != required_level, show Error component
          const userLevel = authStore?.User?.level ?? 0;
          const req = minigame.required_level ?? null;
          if (req !== null && userLevel < req) {
            thegame.value = '';
            return;
          }

          const path = (minigame.route_path || '').replace(/\\+/g, '/').replace(/\/+$/, '') + '/';
          thegame.value = path;
        }).catch(() => {
          // Fallback to direct path if local component exists, otherwise error
          thegame.value = modules[directModulePath] ? directPath : '';
        });
      } else {
        thegame.value = directPath;
      }
    } finally {
      loading.value = false;
    }
});

const game = computed(() => {
    if (!thegame.value) return Error;
    const path = `/src/components/MiniGames/${thegame.value}game.vue`;
    if (modules[path]) {
        return defineAsyncComponent(modules[path]);
    }
    return Error;
});

</script>