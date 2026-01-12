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
import { Wrench } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeService } from '@/services';
import type { Badge, BadgeRule } from '@/services/badgeService';
import { useBadgesStore } from '@/stores/badges';

const props = defineProps<{
  data: Badge;
}>();

const open = ref(false);
const tab = ref<'update' | 'rule'>('update');
const saving = ref(false);
const hasRule = ref(false);
const badgesStore = useBadgesStore();

// keep a local editable copy (computed spread is read-only and not safe with v-model)
const formData = ref<Partial<Badge>>({
  id: props.data.id,
  name: props.data.name,
  description: props.data.description,
  is_active: props.data.is_active ?? true,
  image: props.data.image,
});

const imageFile = ref<File | null>(null);
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  imageFile.value = target.files?.[0] ?? null;
}

// Rule tab: create/update
const ruleForm = ref<BadgeRule>({
  badge_id: props.data.id,
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

const canSaveRule = computed(() => {
  if (!ruleForm.value.target_value || ruleForm.value.target_value < 1) return false;
  if ((ruleForm.value.target_entity === 'lesson' || ruleForm.value.target_entity === 'module') && !ruleForm.value.target_entity_id) {
    return false;
  }
  return true;
});

const updateBadge = async () => {
  if (saving.value) return;
  saving.value = true;
  try {
    const fd = new FormData();
    if (formData.value.name != null) fd.append('name', String(formData.value.name));
    if (formData.value.description != null) fd.append('description', String(formData.value.description));
    if (formData.value.is_active != null) fd.append('is_active', String(formData.value.is_active));
    if (imageFile.value) fd.append('image', imageFile.value);

    // PATCH badge/<id>/
    await BadgeService.admin_update_badge(props.data.id, fd);

    await badgesStore.fetchBadges();
    await badgesStore.fetchBadgesClaimable();
    open.value = false;
  } finally {
    saving.value = false;
  }
};

const saveRule = async () => {
  if (saving.value || !canSaveRule.value) return;
  saving.value = true;
  try {
    if(!hasRule.value) {
      // create new rule
      await BadgeService.admin_create_rule({
        ...ruleForm.value,
        target_entity_id: ruleForm.value.target_entity_id ?? null,
      });
      hasRule.value = true;
      return;
    }else {
      await BadgeService.admin_update_rule(ruleForm.value.badge_id, {
        ...ruleForm.value,
        target_entity_id: ruleForm.value.target_entity_id ?? null,
      });
    }

    await badgesStore.fetchBadges();
    await badgesStore.fetchBadgesClaimable();
    open.value = false;
  } finally {
    saving.value = false;
  }
};

async function loadRule() {
  try {
    const existing = await BadgeService.get_badge_rule(props.data.id);
    
    hasRule.value = !!existing;
    if (existing) {
      ruleForm.value = {
        badge_id: props.data.id,
        type: existing.type,
        target_value: existing.target_value,
        target_entity: existing.target_entity,
        target_entity_id: existing.target_entity_id ?? null,
      };
    } else {
      ruleForm.value = {
        badge_id: props.data.id,
        type: 'count',
        target_value: 1,
        target_entity: 'module',
        target_entity_id: null,
      };
    }
  } catch {
    // keep defaults on error
  }
}

const onOpenChange = async (v: boolean) => {
  open.value = v;
  if (v) {
    tab.value = 'update';
    formData.value = {
      id: props.data.id,
      name: props.data.name,
      description: props.data.description,
      is_active: props.data.is_active ?? true,
      image: props.data.image,
    };
    imageFile.value = null;

    // prefill rule if it exists
    await loadRule();
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogTrigger asChild>
      <Button>
        <Wrench />
        <span class="text-sm font-medium">Update Badge</span>
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Badge</DialogTitle>
        <DialogDescription>
          Update badge info, or manage the rule.
        </DialogDescription>
      </DialogHeader>

      <!-- Tabs -->
      <div class="flex gap-2 border-b pb-2">
        <button
          type="button"
          class="px-3 py-2 text-sm rounded-t-md"
          :class="tab === 'update' ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'"
          @click="tab = 'update'"
        >
          Update
        </button>

        <button
          type="button"
          class="px-3 py-2 text-sm rounded-t-md"
          :class="tab === 'rule' ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'"
          @click="tab = 'rule'"
        >
          Rule
        </button>
      </div>

      <div v-if="tab === 'update'" class="space-y-4 pt-4">
        <div class="space-y-2">
          <Label for="badge-name">Badge name</Label>
          <Input id="badge-name" v-model="formData.name" type="text" placeholder="Enter badge name" />
        </div>

        <div class="space-y-2">
          <Label for="badge-description">Description</Label>
          <Input id="badge-description" v-model="formData.description" type="text" placeholder="Enter description" />
        </div>

        <div class="flex items-center gap-2">
          <input id="badge-active" type="checkbox" v-model="formData.is_active" />
          <Label for="badge-active">Active</Label>
        </div>

        <div class="space-y-2">
          <Label for="badge-image">Upload Image</Label>
          <Input id="badge-image" type="file" @change="onFileChange" />
        </div>

        <DialogFooter>
          <Button :disabled="saving" @click="updateBadge">
            {{ saving ? 'Saving…' : 'Save Changes' }}
          </Button>
        </DialogFooter>
      </div>

      <div v-else class="space-y-4 pt-4">
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
        </div>

        <DialogFooter>
          <Button :disabled="saving || !canSaveRule" @click="saveRule">
            {{ saving ? 'Saving…' : 'Save Rule' }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>