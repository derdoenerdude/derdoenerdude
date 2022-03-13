<template>
  <div v-if="kebab" class="flex flex-col min-h-0 flex-grow">
    <div class="flex pb-2 mb-2 border-b-1 dark:border-dark-100 space-x-2 items-center">
      <img v-if="prefersColorSchemeDark" src="../../assets/doenerdude.png" alt="Döner-Dude Logo" />
      <img v-else src="../../assets/doenerdude-transparent.png" alt="Döner-Dude Logo" />
      <div class="flex flex-col text-center w-full">
        <span class="text-lg mb-2 font-bold">{{ kebab.properties.name }}</span>
        <span class="text-lg">{{ kebab.properties.score }}/15</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Button :href="kebab.properties.url"><i-ph-instagram-logo class="mr-2" />Review auf Instagram</Button>
      <Button :href="`https://www.google.com/maps/search/?api=1&query=${kebab.properties.name}+Kiel`"
        ><i-logos-google-maps class="mr-2" />In Google Maps anzeigen</Button
      >
      <Button :href="`geo:${kebab.geometry.coordinates[1]},${kebab.geometry.coordinates[0]}`"
        ><i-ph-map-pin-line class="mr-2" />In beliebiger Karten-App anzeigen</Button
      >
    </div>
  </div>
  <NoData v-else>404 - Döner nicht gefunden!</NoData>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRef } from 'vue';

import { Marker } from '~/api/types';
import reviews from '~/assets/reviews.json';
import NoData from '~/components/NoData.vue';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';

export default defineComponent({
  name: 'KebabPopup',

  components: { NoData },

  props: {
    marker: {
      type: Object as PropType<Marker>,
      required: true,
    },
  },

  setup(props) {
    const marker = toRef(props, 'marker');
    const prefersColorSchemeDark = usePrefersColorSchemeDark();

    const kebab = computed(() => reviews.features.find(({ properties }) => properties.name === marker.value.id));
    return { kebab, prefersColorSchemeDark };
  },
});
</script>
