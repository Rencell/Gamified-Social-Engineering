<template>
  <div class="flex-1">
    <div class="h-fit bg-secondary rounded-xl p-7 space-y-5 border-b-4 border-1 border-ternary">
      <p class="text-xl font-bold"> Day Streak</p>
      <p class="text-sm font-semibold text-primary/50">Do a lesson or quiz to keep the streak going</p>
      <div>
        <Card class="bg-background/70 border-ternary border-2">
          <CardContent class="grid grid-cols-7 gap-3">
            <div
              class="flex flex-col items-center gap-2"
              v-for="(day, index) in daysOfWeek"
              :key="index"
            >
              <div class="text-sm font-bold">{{ day }}</div>
              <!-- Check if the day is active -->
              <img
                v-if="isActive(index)"
                :src="fire"
                class="w-10"
                alt="Active Day"
              />
              <img
                v-else
                :src="fire_greyed"
                class="w-10"
                alt="Inactive Day"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import fire from '/Learning/fire.svg';
import fire_greyed from '/Learning/fire-greyed.svg';
import { Card, CardContent } from '@/components/ui/card';
import { useStreakStore } from '@/stores/pageStreak';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';

const streakStore = useStreakStore();

// Days of the week (Sunday → Saturday)
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const activeDays = ref<string[]>(); // Array of active days in "YYYY-MM-DD" format

onMounted(async () => {
  await streakStore.updateStreak();
  const res = streakStore.data;
  activeDays.value = res?.active_days; // Populate active days
});

const isActive = (dayIndex: number): boolean => {
  const weekStart = dayjs().startOf('week'); 
  const date = weekStart.add(dayIndex, 'day').format('YYYY-MM-DD');

  return (activeDays.value ?? []).includes(date);
}
</script>