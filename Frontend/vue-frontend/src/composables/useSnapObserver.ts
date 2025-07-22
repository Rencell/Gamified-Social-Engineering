// composables/useSnapObserver.ts
import { onMounted, onBeforeUnmount } from 'vue';

export function useSnapObserver(callback: (entry: IntersectionObserverEntry) => void, options?: IntersectionObserverInit) {
  let observer: IntersectionObserver;

  onMounted(() => {
    const snapElements = document.querySelectorAll('.reset-content');

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options ?? { threshold: 0.5 });

    snapElements.forEach(el => observer.observe(el));
  });

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });
}
