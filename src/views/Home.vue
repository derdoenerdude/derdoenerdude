<template>
  <div class="relative h-full w-full items-center justify-center overflow-hidden">
    <Map :selected-marker="selectedMarker" @marker-click="selectedMarker = $event" />
    <DetailsPopup :is-open="!!selectedMarker" size="1/2" @close="selectedMarker = undefined">
      <MarkerPopup v-if="selectedMarker" :marker="selectedMarker" />
    </DetailsPopup>

    <DetailsPopup :is-open="$route.name === 'search'" size="1/2" @close="$router.replace({ name: 'home' })">
      <SearchPopup v-model:search-input="searchInput" />
    </DetailsPopup>

    <DetailsPopup :is-open="$route.name === 'about'" size="1/2" @close="$router.replace({ name: 'home' })">
      <AboutPopup />
    </DetailsPopup>

    <AppBar v-model:search-input="searchInput" />
  </div>
</template>

<script lang="ts" setup>
import type { Marker } from '~/api/types';
import { computed, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import DetailsPopup from '~/components/DetailsPopup.vue';
import AppBar from '~/components/layout/AppBar.vue';
import Map from '~/components/map/Map.vue';
import AboutPopup from '~/components/popups/AboutPopup.vue';
import MarkerPopup from '~/components/popups/MarkerPopup.vue';
import SearchPopup from '~/components/popups/SearchPopup.vue';

const route = useRoute();
const router = useRouter();
const selectedMarker = computed<Marker | undefined>({
  get() {
    if (route.name !== 'map-marker') {
      return undefined;
    }

    return {
      type: route.params.markerType,
      id: route.params.markerId,
    } as Marker;
  },
  set(marker) {
    if (!marker) {
      void router.replace({ name: 'home' });
      return;
    }
    void router.replace({ name: 'map-marker', params: { markerType: marker.type, markerId: marker.id } });
  },
});

const searchInput = ref('');
</script>
