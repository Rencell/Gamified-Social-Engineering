<script setup lang="ts">
import { useModuleStore } from '@/stores/module';
import { ModuleService } from '@/services';
import { onMounted, ref, computed, watch } from 'vue';
import type { ModuleSource } from '@/services/moduleService';
import { useAuthStore } from '@/stores/auth';

// Give the component a multi-word name for linters
defineOptions({ name: 'LearningCitation' });

interface SourceItem {
  label?: string;         // e.g., "[1]"
  text: string;           // full citation text (can include <em> via v-html if needed)
  href?: string;          // optional link
  linkText?: string;      // optional link display text
}

const props = defineProps<{
  title?: string;
  sources: SourceItem[];
}>();

const module = useModuleStore();
const moduleSource = ref<ModuleSource[]>([]);

// Local editable toggle
const isEditable = ref(false);
const toggleEditable = () => {
  if (editingId.value !== null && isEditable.value) {
    // if turning off, cancel edit
    cancelEdit();
  }
  isEditable.value = !isEditable.value;
};

// Local UI state for CRUD
const loading = ref<boolean>(false);
const errorMsg = ref<string | null>(null);

// Form state for create
const newTitle = ref<string>('');
const newUrl = ref<string>('');

// Edit state
const editingId = ref<number | null>(null);
const editTitle = ref<string>('');
const editUrl = ref<string>('');

watch(isEditable, (val) => {
  if (!val) cancelEdit();
});

const normalizedSources = computed<SourceItem[]>(() => {
  if (moduleSource.value && moduleSource.value.length > 0) {
    return moduleSource.value.map((s, idx) => ({
      label: `[${idx + 1}]`,
      text: s.title,
      href: s.url,
    }));
  }
  return (props.sources || []).map((s, idx) => ({
    label: s.label ?? `[${idx + 1}]`,
    text: s.text,
    href: s.href,
    linkText: s.linkText,
  }));
});

function getErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

async function fetchSources() {
  if (!module.selectedModule) return;
  try {
    loading.value = true;
    errorMsg.value = null;
    moduleSource.value = await ModuleService.get_module_sources(module.selectedModule.id!);
  } catch (e: unknown) {
    errorMsg.value = getErrorMessage(e, 'Failed to load sources');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // Fetch contents or perform any setup logic if needed
  if (module.selectedModule) {
    await fetchSources();
  }
});

// Create
async function addSource() {
  if (!module.selectedModule || !isEditable.value) return;
  if (!newTitle.value.trim() || !newUrl.value.trim()) {
    errorMsg.value = 'Title and URL are required';
    return;
  }
  try {
    loading.value = true;
    errorMsg.value = null;
    await ModuleService.create_module_source({
      module_test: module.selectedModule.id!,
      title: newTitle.value.trim(),
      url: newUrl.value.trim(),
    });
    newTitle.value = '';
    newUrl.value = '';
    await fetchSources();
  } catch (e: unknown) {
    errorMsg.value = getErrorMessage(e, 'Failed to add source');
  } finally {
    loading.value = false;
  }
}

// Start edit
function startEdit(ms: ModuleSource) {
  if (!isEditable.value) return;
  editingId.value = ms.id;
  editTitle.value = ms.title;
  editUrl.value = ms.url;
}

function cancelEdit() {
  editingId.value = null;
  editTitle.value = '';
  editUrl.value = '';
}

// Update
async function saveEdit() {
  if (!isEditable.value) return;
  if (editingId.value == null) return;
  if (!editTitle.value.trim() || !editUrl.value.trim()) {
    errorMsg.value = 'Title and URL are required';
    return;
  }
  try {
    loading.value = true;
    errorMsg.value = null;
    await ModuleService.update_module_source({
      id: editingId.value,
      title: editTitle.value.trim(),
      url: editUrl.value.trim(),
    });
    cancelEdit();
    await fetchSources();
  } catch (e: unknown) {
    errorMsg.value = getErrorMessage(e, 'Failed to update source');
  } finally {
    loading.value = false;
  }
}

// Delete
async function deleteSource(id: number) {
  if (!isEditable.value) return;
  if (!confirm('Delete this source?')) return;
  try {
    loading.value = true;
    errorMsg.value = null;
    await ModuleService.delete_module_source(id);
    await fetchSources();
  } catch (e: unknown) {
    errorMsg.value = getErrorMessage(e, 'Failed to delete source');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="mt-10 border-t border-gray-800 pt-6 w-full sm:w-2xl px-4">
      <div class="mb-3 flex items-center justify-between">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-500">
          {{ props.title ?? 'Sources' }}
        </p>
        <button
          v-if="useAuthStore().User.is_admin"
          class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
          @click="toggleEditable"
        >
          {{ isEditable ? 'Done' : 'Edit' }}
        </button>
      </div>

      <!-- Status -->
      <div v-if="loading" class="mb-3 text-xs text-gray-500">Loading...</div>
      <div v-if="errorMsg" class="mb-3 text-xs text-red-500">{{ errorMsg }}</div>

      <!-- List -->
      <ul class="space-y-2 text-sm text-gray-400">
        <li v-for="(s, idx) in normalizedSources" :key="idx" class="flex gap-2 items-start">
          <span class="text-gray-600">{{ s.label ?? `[${idx + 1}]` }}</span>
          <span>
            <!-- If you need inline italic/em tags from text, switch to v-html carefully -->
            {{ s.text }}
            <a
              v-if="s.href"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-1 text-blue-400 hover:underline"
            >
              {{ s.linkText ?? s.href }}
            </a>
          </span>
        </li>
      </ul>

      <!-- CRUD only visible when editable AND module-selected (API-driven) -->
      <div v-if="module.selectedModule && isEditable" class="mt-6 w-full">
        <!-- Existing module sources with edit/delete -->
        <div class="space-y-3">
          <div
            v-for="ms in moduleSource"
            :key="ms.id"
            class="flex flex-col gap-1 rounded border border-gray-700 p-3"
          >
            <div v-if="editingId !== ms.id" class="flex items-start justify-between">
              <div>
                <p class="text-sm text-gray-200">{{ ms.title }}</p>
                <a :href="ms.url" target="_blank" rel="noopener" class="text-xs text-blue-400 hover:underline">{{ ms.url }}</a>
              </div>
              <div class="flex gap-2">
                <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" @click="startEdit(ms)">Edit</button>
                <button class="rounded bg-red-700 px-2 py-1 text-xs hover:bg-red-600" @click="deleteSource(ms.id)">Delete</button>
              </div>
            </div>
            <div v-else class="flex flex-col gap-2">
              <input
                v-model="editTitle"
                type="text"
                placeholder="Title"
                class="w-full rounded border border-gray-600 bg-gray-800 p-2 text-sm text-gray-200"
              />
              <input
                v-model="editUrl"
                type="url"
                placeholder="https://example.com"
                class="w-full rounded border border-gray-600 bg-gray-800 p-2 text-sm text-gray-200"
              />
              <div class="flex gap-2">
                <button class="rounded bg-blue-700 px-3 py-1 text-xs hover:bg-blue-600" @click="saveEdit">Save</button>
                <button class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600" @click="cancelEdit">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create new -->
        <div class="mt-4 rounded border border-gray-700 p-3">
          <p class="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Add Source</p>
          <div class="flex flex-col gap-2">
            <input
              v-model="newTitle"
              type="text"
              placeholder="Title"
              class="w-full rounded border border-gray-600 bg-gray-800 p-2 text-sm text-gray-200"
            />
            <input
              v-model="newUrl"
              type="url"
              placeholder="https://example.com"
              class="w-full rounded border border-gray-600 bg-gray-800 p-2 text-sm text-gray-200"
            />
            <button class="self-start rounded bg-green-700 px-3 py-1 text-xs hover:bg-green-600" @click="addSource">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>