<template>
  <div v-if="kebab" class="min-h-0 flex flex-grow flex-col overflow-y-auto pb-2">
    <div class="mb-2 flex items-center border-b-1 pb-2 space-x-2 dark:border-dark-100">
      <img v-if="prefersColorSchemeDark" src="../../assets/doenerdude.png" alt="Döner-Dude Logo">
      <img v-else src="../../assets/doenerdude-transparent.png" alt="Döner-Dude Logo">
      <div class="w-full flex flex-col text-center">
        <span class="mb-2 text-lg font-bold">{{ kebab.properties.name }}</span>
        <span class="text-lg">{{ kebab.properties.score }}/{{ kebab.properties.maximumPossibleScore }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Button :href="kebab.properties.url">
        <i-ph-instagram-logo class="mr-2" />Review auf Instagram
      </Button>
      <Button :href="`https://www.google.com/maps/search/?api=1&query=${kebab.properties.name}+Kiel`">
        <i-logos-google-maps class="mr-2" />In Google Maps anzeigen
      </Button>
      <Button :href="`geo:${kebab.geometry.coordinates[1]},${kebab.geometry.coordinates[0]}`">
        <i-ph-map-pin-line class="mr-2" />In beliebiger Karten-App anzeigen
      </Button>
    </div>
    <div v-if="kebab.properties.oldReviews !== undefined" class="mt-4">
      <span class="italic">Frühere Reviews:</span>
      <div v-for="review in kebab.properties.oldReviews" :key="review.date">
        {{ new Date(review.date).toLocaleDateString('de-DE') }}: {{ review.score }}/{{ review.maximumPossibleScore }}
      </div>
    </div>
  </div>
  <NoData v-else>
    404 - Döner nicht gefunden!
  </NoData>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';

import type { Marker } from '~/api/types';
import reviews from '~/assets/reviews.json';
import Button from '~/components/atomic/Button.vue';
import NoData from '~/components/NoData.vue';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';

const props = defineProps<{
  marker: Marker;
}>();

const marker = toRef(props, 'marker');
const prefersColorSchemeDark = usePrefersColorSchemeDark();

const kebab = computed(() => reviews.features.find(({ properties }) => properties.name === marker.value.id));
</script>
