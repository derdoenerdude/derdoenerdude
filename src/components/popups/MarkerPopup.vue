<template>
  <KebabPopup v-if="marker.type === 'kebab'" :marker="marker" />
  <pre v-else>{{ marker }}</pre>
</template>

<script lang="ts" setup>
import type { Marker } from '~/api/types';
import KebabPopup from '~/components/popups/KebabPopup.vue';

defineProps<{
  marker: Marker;
}>();
</script>
