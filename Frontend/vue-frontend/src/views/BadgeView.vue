<script setup lang="ts">
import { ArrowLeft, Lock } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useBadgesStore } from '@/stores/badges';
import { onMounted, ref } from 'vue';
import type { Badge } from '@/services/badgeService';
import { BadgeService } from '@/services';
import AddBadge from '@/components/home/badge/addBadge.vue'
import UpdateBadge from '@/components/home/badge/updateBadge.vue'
import { useAuthStore } from '@/stores/auth';
import { Badge as badgeUi} from '@/components/ui/badge';

const badgesStore = useBadgesStore();

const isUnlocked = (badgeName: string) => {
  if (useAuthStore().User.is_admin) return true;
  return badgesStore.badgesUnlocked.some((b) => b.badge.name === badgeName);
};

const isClaimable = (badgeName: string) => {
  return badgesStore.badgesClaimable.some((b) => b.name === badgeName);
};

const claiming = ref<Record<string, boolean>>({});

const claimBadge = async (badge: Badge) => {
  if (isUnlocked(badge.name) || !isClaimable(badge.name)) return;

  try {
    claiming.value[badge.name] = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await BadgeService.create((badge as any).id);

    await badgesStore.fetchBadges();
    await badgesStore.fetchBadgesClaimable();

    // show modal with claimed badge details
    badgesStore.openClaimedBadgeModal({ name: badge.name, image: badge.image });
  } catch (e) {
    console.error('Failed to claim badge:', e);
  } finally {
    claiming.value[badge.name] = false;
  }
};

// Tooltip state for mobile/tap
const openTooltip = ref<string | null>(null);

const toggleTooltip = (badgeName: string) => {
  openTooltip.value = openTooltip.value === badgeName ? null : badgeName;
};

const closeTooltip = () => {
  openTooltip.value = null;
};

onMounted(async () => {
  await badgesStore.fetchBadges();
  await badgesStore.fetchBadgesClaimable();
});
</script>

<template>
  <RouterLink :to="{ name: 'Profile' }">
    <div class="flex gap-2 mb-5 text-sm items-center text-accent">
      <ArrowLeft :size="15"></ArrowLeft> Back
    </div>
  </RouterLink>

  <p class="text-2xl font-bold">Badges</p>

  <div v-if="badgesStore.isLoading" class="text-center text-gray-500">
    Loading badges...
  </div>

  <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
    <div class="p-6 space-y-3 rounded-lg relative transition" v-for="badge in badgesStore.badges" :key="badge.name"
      :class="(!isUnlocked(badge.name) && !isClaimable(badge.name)) ? 'opacity-60 grayscale' : ''" @click="closeTooltip">
      
      <div class="relative group">
        <img :src="badge.image" :alt="badge.name" class="mx-auto" />

        <!-- Tooltip for locked/claimable badges -->
        <div v-if="!isUnlocked(badge.name)" class="absolute inset-0 flex items-center justify-center">
          <!-- Tap/click this overlay to toggle tooltip on mobile -->
          <div class="relative rounded-full bg-black/50 p-2" :title="badge.description || badge.name" @click.stop="toggleTooltip(badge.name)">
            <!-- Tooltip bubble: shows on hover (desktop) or when tapped (mobile) -->
            <div v-if="badge.description"
              class="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 rounded-md bg-black/80 px-3 py-2 text-center text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              :class="openTooltip === badge.name ? 'opacity-100' : ''"
              role="tooltip">
              {{ badge.description }}
            </div>

            <button v-if="isClaimable(badge.name)" type="button"
              class="flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
              :disabled="claiming[badge.name]" @click.stop.prevent="claimBadge(badge)"
              :aria-label="`Claim badge: ${badge.name}`">
              <Lock class="text-white" :size="18" />
              {{ claiming[badge.name] ? 'Claiming…' : 'Claim' }}
            </button>

            <Lock v-else class="text-white" :size="18" :aria-label="`Locked badge: ${badge.name}`" />
          </div>
        </div>
      </div>

      <p class="text-md text-center font-display font-bold truncate">
        {{ badge.name }}
      </p>

      <badgeUi v-show="!badge.has_rule && useAuthStore().User.is_admin" class="absolute top-2">
        No rule
      </badgeUi>

      <UpdateBadge :data="badge"/>
    </div>

    <AddBadge />

  </div>
</template>