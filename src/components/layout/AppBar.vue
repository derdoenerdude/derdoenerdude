<template>
  <div
    class="absolute top-0 left-0 right-0 mx-2 mt-2 h-12 flex rounded-md py-4 items-center justify-center bg-white border-1 border-gray-200 shadow-xl z-20 md:transform md:-translate-x-1/2 md:right-auto md:left-1/2 md:w-96 dark:bg-dark-400 dark:text-gray-300 dark:border-dark-800"
  >
    <div class="flex items-center cursor-pointer select-none p-2">
      <i-ic-baseline-arrow-back v-if="$route.name === 'search'" class="w-6 h-6" @click="$router.back()" />
      <router-link v-else :to="{ name: 'home' }">
        <img
          :src="prefersColorSchemeDark ? doenerdudeIcon : doenerdudeIconTransparent"
          alt="Döner-Dude Logo"
          class="w-6 h-6"
        />
      </router-link>
    </div>
    <div class="flex flex-grow">
      <input
        v-model="internalSearchInput"
        type="text"
        class="bg-transparent focus:outline-transparent w-full h-full"
        placeholder="Suchen ..."
        autofocus
        @keydown.escape="$router.back()"
        @click="$router.push({ name: 'search' })"
      />
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
      <i-ph-info class="w-6 h-6" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import doenerdudeIcon from '~/assets/doenerdude.png';
import doenerdudeIconTransparent from '~/assets/doenerdude-transparent.png';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';

export default defineComponent({
  name: 'AppBar',

  props: {
    searchInput: {
      type: String,
      required: true,
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:search-input': (_searchInput: string) => true,
  },

  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const prefersColorSchemeDark = usePrefersColorSchemeDark();

    const searchInput = toRef(props, 'searchInput');
    const internalSearchInput = computed({
      get() {
        return searchInput.value;
      },
      set(_searchInput: string) {
        searchInput.value = _searchInput;

        emit('update:search-input', _searchInput);

        if (_searchInput.length > 0 && route.name !== 'search') {
          void router.push({ name: 'search' });
        }
      },
    });

    return { internalSearchInput, prefersColorSchemeDark, doenerdudeIconTransparent, doenerdudeIcon };
  },
});
</script>
