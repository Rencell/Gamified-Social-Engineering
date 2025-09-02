import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BadgeService } from '@/services';
import type { Badge, UserBadge } from '@/services/badgeService';

export const useBadgesStore = defineStore('badges', () => {
  // State
  const badges = ref<Badge[]>([]);
  const badgesUnlocked = ref<UserBadge[]>([]);
  const isLoading = ref(false);

  // Actions
  const fetchBadges = async () => {
    try {
      isLoading.value = true;
      const response = await BadgeService.get_all();
      const response2 = await BadgeService.get_user_badge();

      badges.value = response;
      badgesUnlocked.value = response2;
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const getBadgeSrc = (name: string) => {
    // Check if unlocked
    const isUnlocked = badgesUnlocked.value.some((b) => b.badge.name === name);
    return `/badges/${name.replace(/\s+/g, '')}Badge${isUnlocked ? '' : '_locked'}.svg`;
  };


  return {
    badges,
    badgesUnlocked,
    isLoading,
    fetchBadges,
    getBadgeSrc,
  };
});