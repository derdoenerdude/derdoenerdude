<template>
  <div
    class="shadow-all absolute bottom-0 left-0 right-0 z-10 w-full flex flex-col bg-white transition md:top-0 md:h-auto md:w-80 dark:border-dark-800 md:rounded-none dark:bg-dark-400 dark:text-gray-300"
    :class="{
      'overflow-hidden max-h-0': actualSize === 'closed',
      'h-1/2': size === '1/2' && actualSize === 'default',
      'h-3/4': size === '3/4' && actualSize === 'default',
      'p-4 pb-0 pt-2': actualSize !== 'closed' && actualSize !== 'full',
      'rounded-t-2xl': actualSize !== 'full',
      'rounded-none p-4 pt-16': actualSize === 'full',
      'opacity-80': actualSize === 'closing',
      'fade': !dragging,
    }"
    :style="{ height: isOpen ? (height === undefined ? undefined : `${height}px`) : 0 }"
    @touchmove="move"
    @touchend="drop"
  >
    <div class="w-full pb-4 pt-4 -mt-4 md:hidden" @touchstart="drag">
      <div v-show="actualSize !== 'full'" class="mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-500" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    size: '3/4' | '1/2';
  }>(),
  {
    size: '3/4',
  },
);

const emit = defineEmits<(e: 'close') => void>();

const dragging = ref(false);
const height = ref<number>();
const isOpen = toRef(props, 'isOpen');
const size = toRef(props, 'size');

const actualSize = computed(() => {
  if (!isOpen.value) {
    return 'closed';
  }

  if (dragging.value) {
    if (height.value === undefined) {
      return 'closed';
    }

    const percentage = height.value / window.innerHeight;
    if ((size.value === '1/2' && percentage > 0.6) || (size.value === '3/4' && percentage > 0.85)) {
      return 'maximizing';
    }

    if ((size.value === '1/2' && percentage < 0.4) || (size.value === '3/4' && percentage < 0.65)) {
      return 'closing';
    }

    return 'defaulting';
  }

  if (height.value === 0) {
    return 'closed';
  }

  if (height.value === window.innerHeight) {
    return 'full';
  }

  return 'default';
});

function drag(e: TouchEvent) {
  dragging.value = true;
  height.value = window.innerHeight - e.touches[0].clientY;
}

function move(e: TouchEvent) {
  if (!dragging.value) {
    return;
  }
  height.value = window.innerHeight - e.touches[0].clientY;
}

function drop() {
  if (!dragging.value) {
    return;
  }

  if (actualSize.value === 'maximizing') {
    height.value = window.innerHeight;
  }
  else if (actualSize.value === 'closing') {
    height.value = undefined;
    emit('close');
  }
  else if (actualSize.value === 'defaulting') {
    height.value = undefined;
  }

  dragging.value = false;
}
</script>

<style scoped>
.fade {
  transition: height 0.15s ease;
}
</style>
