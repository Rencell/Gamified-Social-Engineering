<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeService } from '@/services';
import type { Badge, BadgeRule } from '@/services/badgeService';
import { useBadgesStore } from '@/stores/badges';

const open = ref(false);
const tab = ref<'create' | 'rule'>('create');
const saving = ref(false);

const badgesStore = useBadgesStore();

// ---- Badge form (Create tab)
const badgeForm = ref<{ name: string; description: string; image: File | null; is_active: boolean }>({
  name: '',
  description: '',
  image: null,
  is_active: true,
});

const createdBadge = ref<Badge | null>(null);

function onBadgeFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  badgeForm.value.image = target.files?.[0] ?? null;
}

const canCreateBadge = computed(() => {
  return badgeForm.value.name.trim().length > 0 && badgeForm.value.description.trim().length > 0;
});

const saveBadge = async () => {
  if (saving.value || !canCreateBadge.value) return;

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('name', badgeForm.value.name);
    fd.append('description', badgeForm.value.description);
    fd.append('is_active', String(badgeForm.value.is_active));
    if (badgeForm.value.image) fd.append('image', badgeForm.value.image);

    createdBadge.value = await BadgeService.admin_create_badge(fd);

    // refresh list
    await badgesStore.fetchBadges();

    // move to rule tab
    tab.value = 'rule';
  } finally {
    saving.value = false;
  }
};

// ---- Rule form (Rule tab)
const ruleForm = ref<Omit<BadgeRule, 'badge_id'>>({
  type: 'count',
  target_value: 1,
  target_entity: 'module',
  target_entity_id: null,
});

const ruleTargetEntityIdModel = computed({
  get: () => (ruleForm.value.target_entity_id ?? ''),
  set: (v: string | number) => {
    const n = typeof v === 'number' ? v : Number(String(v));
    ruleForm.value.target_entity_id = Number.isFinite(n) && n > 0 ? n : null;
  },
});

const canCreateRule = computed(() => {
  if (!createdBadge.value?.id) return false;
  if (!ruleForm.value.target_value || ruleForm.value.target_value < 1) return false;
  // target_entity_id only needed for lesson/module rules (backend allows null but eligibility checks may require it)
  if ((ruleForm.value.target_entity === 'lesson' || ruleForm.value.target_entity === 'module') && !ruleForm.value.target_entity_id) {
    return false;
  }
  return true;
});

const saveRule = async () => {
  if (saving.value || !canCreateRule.value || !createdBadge.value) return;

  saving.value = true;
  try {
    await BadgeService.admin_create_rule({
      badge_id: createdBadge.value.id,
      ...ruleForm.value,
      target_entity_id: ruleForm.value.target_entity_id ?? null,
    });

    // close + reset
    open.value = false;
    tab.value = 'create';
    createdBadge.value = null;
    badgeForm.value = { name: '', description: '', image: null, is_active: true };
    ruleForm.value = { type: 'count', target_value: 1, target_entity: 'module', target_entity_id: null };

    await badgesStore.fetchBadges();
    await badgesStore.fetchBadgesClaimable();
  } finally {
    saving.value = false;
  }
};

const onOpenChange = (v: boolean) => {
  open.value = v;
  if (!v) {
    // reset when closing
    tab.value = 'create';
    createdBadge.value = null;
    badgeForm.value = { name: '', description: '', image: null, is_active: true };
    ruleForm.value = { type: 'count', target_value: 1, target_entity: 'module', target_entity_id: null };
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogTrigger asChild>
      <div
        class="rounded-lg border-4 border-secondary border-dashed flex flex-col justify-center items-center p-4 cursor-pointer hover:border-accent hover:bg-accent/10 transition w-full h-full"
      >
        <Plus :size="24" class="mb-2" />
        <span class="text-sm font-medium">Add New Badge</span>
      </div>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Badge</DialogTitle>
        <DialogDescription>
          Create the badge first, then add its rule.
        </DialogDescription>
      </DialogHeader>

      <!-- Tabs -->
      <div class="flex gap-2 border-b pb-2">
        <button
          type="button"
          class="px-3 py-2 text-sm rounded-t-md"
          :class="tab === 'create' ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'"
          @click="tab = 'create'"
        >
          Create
        </button>

        <button
          type="button"
          class="px-3 py-2 text-sm rounded-t-md"
          :disabled="!createdBadge"
          :class="[
            tab === 'rule' ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground',
            !createdBadge ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          @click="createdBadge && (tab = 'rule')"
        >
          Rule
        </button>
      </div>

      <!-- Tab content -->
      <div v-if="tab === 'create'" class="space-y-4 pt-4">
        <div v-if="createdBadge" class="text-sm text-emerald-600">
          Created: <span class="font-semibold">{{ createdBadge.name }}</span> (id: {{ createdBadge.id }})
        </div>

        <div class="space-y-2">
          <Label for="badge-name">Badge name</Label>
          <Input id="badge-name" v-model="badgeForm.name" type="text" placeholder="Enter badge name" />
        </div>

        <div class="space-y-2">
          <Label for="badge-description">Description</Label>
          <Input id="badge-description" v-model="badgeForm.description" type="text" placeholder="Enter description" />
        </div>

        <div class="space-y-2">
          <Label for="badge-image">Upload Image</Label>
          <Input id="badge-image" type="file" @change="onBadgeFileChange" />
        </div>

        <div class="flex items-center gap-2">
          <input id="badge-active" type="checkbox" v-model="badgeForm.is_active" />
          <Label for="badge-active">Active</Label>
        </div>

        <DialogFooter>
          <Button :disabled="saving || !canCreateBadge" @click="saveBadge">
            {{ saving ? 'Saving…' : 'Save Badge' }}
          </Button>
        </DialogFooter>
      </div>

      <div v-else class="space-y-4 pt-4">
        <div class="text-sm">
          Badge: <span class="font-semibold">{{ createdBadge?.name }}</span>
        </div>

        <div class="space-y-2">
          <Label for="rule-type">Rule type</Label>
          <select id="rule-type" v-model="ruleForm.type" class="w-full p-2 border rounded bg-background">
            <option value="count">Count</option>
            <option value="completion">Completion</option>
            <option value="streak">Streak</option>
          </select>
        </div>

        <div class="space-y-2">
          <Label for="rule-target-entity">Target entity</Label>
          <select id="rule-target-entity" v-model="ruleForm.target_entity" class="w-full p-2 border rounded bg-background">
            <option value="module">Module</option>
            <option value="lesson">Lesson</option>
            <option value="quiz">Quiz</option>
            <option value="login">Login</option>
          </select>
        </div>

        <div class="space-y-2">
          <Label for="rule-target-value">Target value</Label>
          <Input id="rule-target-value" v-model.number="ruleForm.target_value" type="number" min="1" />
        </div>

        <div v-if="ruleForm.target_entity === 'lesson' || ruleForm.target_entity === 'module'" class="space-y-2">
          <Label for="rule-target-entity-id">Target entity id</Label>
          <Input id="rule-target-entity-id" v-model="ruleTargetEntityIdModel" type="number" min="1" />
          <p class="text-xs text-muted-foreground">
            For lesson/module rules this is required (e.g., lesson id or module id).
          </p>
        </div>

        <DialogFooter>
          <Button :disabled="saving || !canCreateRule" @click="saveRule">
            {{ saving ? 'Saving…' : 'Save Rule' }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>