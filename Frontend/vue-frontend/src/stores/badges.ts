import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BadgeService } from '@/services';
import type { Badge, UserBadge } from '@/services/badgeService';

export const useBadgesStore = defineStore('badges', () => {
  // State
  const badges = ref<Badge[]>([]);
  const badgesUnlocked = ref<UserBadge[]>([]);

  // badge claim modal
  const openBadgeModal = ref(false);
  const claimedBadge = ref<Pick<Badge, 'name' | 'image'> | null>(null);

  const badgesClaimable = ref<Badge[]>([]);
  const isLoading = ref(false);

  // Actions
  const fetchBadges = async () => {
    try {
      isLoading.value = true;
      const getListBadges = await BadgeService.get_all();
      const getUserCompletedBadges = await BadgeService.get_user_badge();

      badges.value = getListBadges;
      badgesUnlocked.value = getUserCompletedBadges;
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBadgesClaimable = async () => {
    try {
      isLoading.value = true;
      const response = await BadgeService.get_badge_claimable();
      badgesClaimable.value = response;
    } catch (error) {
      console.error('Error fetching claimable badges:', error);
    }
    finally {
      isLoading.value = false;
    }
  };

  const openClaimedBadgeModal = (badge: Pick<Badge, 'name' | 'image'>) => {
    claimedBadge.value = { name: badge.name, image: badge.image };
    openBadgeModal.value = true;
  };

  const closeBadgeModal = () => {
    openBadgeModal.value = false;
    claimedBadge.value = null;
  }

  return {
    badges,
    badgesUnlocked,
    badgesClaimable,
    isLoading,

    openBadgeModal,
    claimedBadge,
    openClaimedBadgeModal,

    fetchBadges,
    fetchBadgesClaimable,
    closeBadgeModal,
  };
});