<template>
  <LearningContent :content-id="content_order">
    <RecursiveContent v-for="item in sortedContentItems" 
      
      :key="item.id" 
      :item="item"
      :siblings="item.children || []"
      :component-map="componentMap"
      @onUpdate="handleContentUpdate" 
      @onDelete="handleDeleteComponent" 
      @onCreate="handleAddComponent"
      @onReorder="handleReorderComponent" />
  </LearningContent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import RecursiveContent from './recurse.vue';
import { ContentService } from '@/services/index.ts';
import type { Content } from '@/services/contentService.ts';
import { defaultPropsMap, type LearningType } from './UI/learningRegistry.ts';
import { componentMap } from './UI/learningRegistry.ts';
import LearningContent from './UI/Learning/Core/LearningContent.vue';

interface ContentItem {
  id: number;
  type: string;
  props: Record<string, any>;
  item_order: number;
  content: number;
  parent: number | null;
  children?: ContentItem[];
}

const props = defineProps<{
  content_order: number;
}>();

const contentItems = ref<Content[]>([]);


onMounted(async () => {
  
  await ContentService.get_contentitems_by_parent(props.content_order).then((response) => {
    contentItems.value = response;
  }).catch((error) => {
    console.error("Error fetching content items:", error);
  });
})


const handleContentUpdate = async(id: number, $event: string) => {
  
  try {
    const propsObj = typeof $event === "string" ? JSON.parse($event) : $event;
    await ContentService.patch(id, { props: propsObj }); // partial update
    
    contentItems.value = contentItems.value.map((item) =>
      item.id === id ? { ...item, props: { ...propsObj } } : item
    );
    console.log("Updated content item:", contentItems.value);
  } catch (error) {
    console.error("Failed to update content item:", error);
  }
}

const handleDeleteComponent = async (id: number) => {
  if (!confirm("Are you sure you want to delete this component and all its children? This action cannot be undone.")) {
    return;
  }

  const deleteItemAndChildren = (itemId: number): number[] => {
    const children = contentItems.value.filter((item) => item.parent === itemId);
    const childIds = children.flatMap((child) => deleteItemAndChildren(child.id));
    return [itemId, ...childIds];
  };

  const idsToDelete = deleteItemAndChildren(id);
  try {
    await ContentService.deleteMultiple(idsToDelete);
    contentItems.value = contentItems.value.filter(item => !idsToDelete.includes(item.id));
  } catch (error) {
    console.error("Failed to delete items from database:", error);
  }
};

const handleAddComponent = async (type: LearningType, parentId?: number) => {

  const defaultProps = (defaultPropsMap[type as keyof typeof defaultPropsMap]) || { text: 'Default Text' };

  const parentItems = contentItems.value.filter((item) => item.parent === (parentId || null))
  const maxOrder = parentItems.length > 0 ? Math.max(...parentItems.map((item) => item.item_order)) : 0
  

  const newItem: ContentItem = {
    id: 0,
    type,
    props: defaultProps,
    item_order: maxOrder + 1,
    content: props.content_order,
    parent: parentId || null,
  }

  try {
    const response = await ContentService.create(newItem as Content)
    contentItems.value.push(response)

    // Wait for DOM update, then scroll to the newly added element and highlight it
    await nextTick()
    const el = document.getElementById(`content-item-${response.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      el.classList.remove('newly-created')
      
      void (el as HTMLElement).offsetWidth
      el.classList.add('newly-created')
      el.addEventListener('animationend', () => {
        el.classList.remove('newly-created')
      }, { once: true })
    }
  } catch (error) {
    console.error("Error creating content item:", error);
    return;
  }
}


const handleReorderComponent = async (id: number, direction: "up" | "down") => {
  
  const item = contentItems.value.find((item) => item.id === id);
  if (!item) return;

  // Get siblings (items with the same parent)
  const siblings = contentItems.value
    .filter((sibling) => sibling.parent === item.parent)
    .sort((a, b) => a.item_order - b.item_order);

  const currentIndex = siblings.findIndex((sibling) => sibling.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= siblings.length) return;

  // Swap the item_order values
  const currentItem = siblings[currentIndex];
  const targetItem = siblings[targetIndex];
  const tempOrder = currentItem.item_order;

  try {
    // Update the database
    await Promise.all([
      ContentService.patch(currentItem.id, { item_order: targetItem.item_order }),
      ContentService.patch(targetItem.id, { item_order: tempOrder }),
    ]);

    // Update the local state
    contentItems.value = contentItems.value.map((item) => {
      if (item.id === currentItem.id) {
        return { ...item, item_order: targetItem.item_order };
      }
      if (item.id === targetItem.id) {
        return { ...item, item_order: tempOrder };
      }
      return item;
    });
  } catch (error) {
    console.error("Failed to reorder components:", error);
  }
};

function buildTree(items: Content[]): Content[] {
  const map = new Map<number, Content>();
  const roots: Content[] = [];

  // Initialize map with copies of items, adding empty children arrays
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // Build the tree
  items.forEach((item) => {
    if (item.parent !== null) {
      const parent = map.get(item.parent);
      if (parent) {
        parent.children!.push(map.get(item.id)!);
      }
    } else {
      roots.push(map.get(item.id)!);
    }
  });

  // Sort children recursively by item_order
  function sortChildren(nodes: Content[]): void {
    nodes.sort((a, b) => a.item_order - b.item_order);
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  }

  sortChildren(roots);

  console.log("Built tree:", roots);
  return roots;
}

const sortedContentItems = computed(() => buildTree(contentItems.value));
</script>

<style>
@keyframes newItemHighlight {
  0% { background-color: rebeccapurple; }
  100% { background-color: transparent; }
}

/* global so it applies to the element in child component */
.newly-created {
  
  animation: newItemHighlight 2s ease-out forwards;
}
</style>