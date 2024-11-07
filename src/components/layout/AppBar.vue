<template>
  <div
    class="absolute left-0 right-0 top-0 z-20 mx-2 mt-2 h-12 flex items-center justify-center border-1 border-gray-200 rounded-md bg-white py-4 shadow-xl md:left-1/2 md:right-auto md:w-96 md:transform dark:border-dark-800 dark:bg-dark-400 dark:text-gray-300 md:-translate-x-1/2"
  >
    <div class="flex cursor-pointer select-none items-center p-2">
      <i-ic-baseline-arrow-back v-if="$route.name === 'search'" class="h-6 w-6" @click="$router.back()" />
      <router-link v-else :to="{ name: 'home' }">
        <img
          :src="prefersColorSchemeDark ? doenerdudeIcon : doenerdudeIconTransparent"
          alt="Döner-Dude Logo"
          class="h-6 w-6"
        >
      </router-link>
    </div>
    <div class="flex flex-grow">
      <input
        v-model="internalSearchInput"
        type="text"
        class="h-full w-full bg-transparent focus:outline-transparent"
        placeholder="Suchen ..."
        autofocus
        @keydown.escape="$router.back()"
        @click="$router.push({ name: 'search' })"
      >
    </div>
    <router-link
      v-if="$route.name !== 'about' && $route.name !== 'search'"
      :to="{ name: 'about' }"
      class="flex items-center p-2"
      aria-label="Über Döner-Dude Map"
    >
      <i-ph-info />
    </router-link>
    <router-link
      v-else-if="$route.name === 'about'"
      :to="{ name: 'home' }"
      class="flex items-center p-2"
      aria-label="Über Döner-Dude Map"
    >
      <i-ph-info class="h-6 w-6" />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import doenerdudeIcon from '~/assets/doenerdude.png';
import doenerdudeIconTransparent from '~/assets/doenerdude-transparent.png';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';

const props = defineProps<{
  searchInput: string;
}>();

const emit = defineEmits<(e: 'update:search-input', searchInput: string) => void>();

const route = useRoute();
const router = useRouter();

const prefersColorSchemeDark = usePrefersColorSchemeDark();

const searchInput = toRef(props, 'searchInput');
const internalSearchInput = computed({
  get() {
    return searchInput.value;
  },
  set(_searchInput: string) {
    emit('update:search-input', _searchInput);

    if (_searchInput.length > 0 && route.name !== 'search') {
      void router.push({ name: 'search' });
    }
  },
});
</script>
