<template>
  <KebabPopup v-if="marker.type === 'kebab'" :marker="marker" />
  <pre v-else>{{ marker }}</pre>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Marker } from '~/api/types';
import KebabPopup from '~/components/popups/KebabPopup.vue';

export default defineComponent({
  name: 'MarkerPopup',

  components: { KebabPopup },

  props: {
    marker: {
      type: Object as PropType<Marker>,
      required: true,
    },
  },
});
</script>
