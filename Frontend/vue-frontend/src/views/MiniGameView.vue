<template>
    <div class="h-fit">
        <p class="font-bold text-3xl mb-4">Mini Games</p>
        <Loading v-if="loading"></Loading>
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-14 md:gap-4 md:gap-y-10">
            <template v-for="game in minigame" :key="game.id">
                <!-- Playable card when user level equals required_level -->
                <RouterLink v-if="canPlay(game)"
                    :to="{ name: 'MiniGamesDetail', params: { gameId: game.id } }"
                    :style="{ backgroundColor: game.card_color }"
                    class="relative h-70 rounded-2xl p-5 hover:scale-105 transition-transform duration-300 ease-in-out">
                    <div class="relative">
                        <p class="pb-4 text-xl font-bold" :style="{ color: getTextColor(game.card_color) }">{{ game.name }}</p>
                        <div class="h-1 w-10 absolute bottom-0" :style="{ backgroundColor: getTextColor(game.card_color) }"></div>
                    </div>

                    <div class=" h-full flex items-center justify-center">
                        <img :src="game.thumbnail!" class="h-full size-45" :alt="`${game.name} Thumbnail`">
                    </div>
                    <div class="h-10 w-30 rounded-full bg-accent absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white font-bold shadow-lg hover:bg-accent-dark cursor-pointer">
                        <Play class="fill-white size-4 me-2"></Play>
                        Play
                    </div>
                </RouterLink>

                <!-- Locked card when user level does not equal required_level -->
                <div v-else
                    :style="{ backgroundColor: game.card_color }"
                    class="relative h-70 rounded-2xl p-5 bg-secondary cursor-not-allowed opacity-60"
                    aria-disabled="true">
                    <div class="bg-ternary rotate-0 absolute -top-2 right-0 rounded-full p-1 px-5 flex flex-row-reverse items-center gap-2 text-white font-semibold">
                        <p class="text-sm">Level {{ game.required_level ?? '-' }}</p> <Lock class="size-5"></Lock>
                    </div>
                    <div class="relative">
                        <p class="pb-4 text-xl font-bold" :style="{ color: getTextColor(game.card_color) }">{{ game.name }}</p>
                        <div class="h-1 w-10 absolute bottom-0" :style="{ backgroundColor: getTextColor(game.card_color) }"></div>
                    </div>

                    <div class=" h-full flex items-center justify-center">
                        <img :src="game.thumbnail!" class="h-full size-45 filter grayscale" :alt="`${game.name} Thumbnail`">
                    </div>
                    <div
                        class="h-10 w-30 rounded-full bg-ternary absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white font-bold shadow-lg cursor-not-allowed">
                        <Lock class="size-4 me-2"></Lock>
                        Locked
                    </div>
                </div>
            </template>
        </div>
    </div>

</template>

<script setup lang="ts">
// removed unused image imports
import { Play, Lock } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { MinigameService } from '@/services';
import type { Minigame } from '@/services/minigameService';
import Loading from '@/components/loading.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const loading = ref(false);
const minigame = ref<Minigame[]>([])
onMounted(() => {
    loading.value = true;
    try {
        MinigameService.get_minigame().then(data => {
            minigame.value = data;
        });
    } finally {
        loading.value = false;
    }
});

// Helper to determine if the game is playable based on user level
type MinigameWithReq = Minigame & { required_level: number | null };
function canPlay(game: MinigameWithReq): boolean {
  const userLevel = authStore?.User?.level as number | undefined;
  const requiredLevel = game.required_level;
  if (userLevel == null || requiredLevel == null) return false;
  return userLevel >= requiredLevel;
}

// Compute text color (black/white) based on background brightness
function getTextColor(bgColor?: string): string {
  if (!bgColor) return '#ffffff';
  const rgb = parseColorToRGB(bgColor);
  if (!rgb) return '#ffffff';
  const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b; // Rec. 709
  return luminance > 180 ? '#000000' : '#ffffff';
}

function parseColorToRGB(color: string): { r: number; g: number; b: number } | null {
  const c = color.trim().toLowerCase();
  // #rgb or #rrggbb
  const hexMatch = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  // rgb(r,g,b) or rgba(r,g,b,a)
  const rgbMatch = c.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map(p => parseFloat(p.trim()));
    if (parts.length >= 3) {
      return { r: clamp255(parts[0]), g: clamp255(parts[1]), b: clamp255(parts[2]) };
    }
  }
  return null;
}

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
</script>
