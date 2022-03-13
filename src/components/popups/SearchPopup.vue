<template>
  <div class="flex flex-col min-h-0 flex-grow">
    <div class="flex pb-2 mb-2 border-b-1 dark:border-dark-100 space-x-2 items-center">
      <i-ph-magnifying-glass-bold />
      <span class="text-lg">Suche</span>
    </div>
    <div v-if="searchResults.length === 0 && searchInput.length < 3" class="m-auto max-w-52 text-center text-xl">
      <p>Suche nach einem Döner deiner Wahl</p>
    </div>
    <div v-else-if="searchResults.length === 0 && searchInput.length >= 3" class="m-auto max-w-52 text-center text-xl">
      <p>Zu deiner Suche existiert anscheinend kein Eintrag.</p>
    </div>
    <div class="flex flex-col overflow-y-auto">
      <router-link
        v-for="searchResult in searchResults"
        :key="searchResult.refIndex"
        :to="{
          name: 'map-marker',
          params: { markerType: 'kebab', markerId: searchResult.item.properties.name },
        }"
        class="flex py-2 not-last:border-b-1 dark:border-dark-300 max-w-full"
        @click="$emit('update:search-input', '')"
      >
        <i-dashicons-food class="mr-2" />
        <div class="">
          {{ searchResult.item.properties.name }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Fuse from 'fuse.js';
import { computed, defineComponent, toRef } from 'vue';

import reviews from '~/assets/reviews.json';

export default defineComponent({
  name: 'SearchPopup',

  props: {
    searchInput: {
      type: String,
      default: '',
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:search-input': (_searchInput: string) => true,
  },

  setup(props) {
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
        return [];
      }
      // limit to max 20 results
      return searchIndex.value.search(searchInput.value).slice(0, 20);
    });

    return { searchResults };
  },
});
</script>
