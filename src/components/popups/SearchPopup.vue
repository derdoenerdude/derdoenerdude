<template>
  <div class="flex flex-col min-h-0 flex-grow">
    <div class="flex pb-2 mb-2 border-b-1 dark:border-dark-100 space-x-2 items-center">
      <i-ph-magnifying-glass-bold />
      <span class="text-lg">Suche</span>
    </div>
    <div v-if="searchResults.length === 0 && searchInput.length >= 3" class="m-auto max-w-52 text-center text-xl">
      <p>Zu deiner Suche existiert anscheinend kein Eintrag.</p>
    </div>
    <div class="flex flex-col overflow-y-auto">
      <router-link
        v-for="searchResult in searchResults"
        :key="searchResult.properties.url"
        :to="{
          name: 'map-marker',
          params: { markerType: 'kebab', markerId: searchResult.properties.name },
        }"
        class="flex py-2 not-last:border-b-1 dark:border-dark-300 max-w-full"
        @click="emit('update:search-input', '')"
      >
        <i-dashicons-food class="mr-2" />
        <div class="">
          {{ searchResult.properties.name }}
        </div>
        <div class="ml-auto bg-light-600 dark:bg-dark-300 rounded-lg w-10 min-w-10 flex justify-center max-h-6">
          {{ searchResult.properties.score }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Fuse from 'fuse.js';
import { computed, toRef } from 'vue';

import reviews from '~/assets/reviews.json';

const props = withDefaults(
  defineProps<{
    searchInput: string;
  }>(),
  {
    searchInput: '',
  },
);

const emit = defineEmits<{
  (e: 'update:search-input', searchInput: string): void;
}>();

const searchInput = toRef(props, 'searchInput');
const searchData = reviews.features;
const searchIndex = computed(
  () =>
    new Fuse(searchData, {
      includeScore: true,
      keys: ['properties.name'],
      threshold: 0.6,
    }),
);

const searchResults = computed(() => {
  if (searchInput.value === '' || searchInput.value.length < 1) {
    return [...searchData].sort((a, b) => b.properties.score - a.properties.score);
  }
  // limit to max 20 results
  return searchIndex.value
    .search(searchInput.value)
    .slice(0, 20)
    .map((result) => result.item);
});
</script>
