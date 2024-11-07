<template>
  <div id="map" ref="mapElement" class="h-full w-full" />
</template>

<script lang="ts" setup>
import type { FeatureCollection, Point } from 'geojson';

import type { SymbolLayerSpecification } from 'maplibre-gl';
import type { Ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { AttributionControl, GeolocateControl, Map, NavigationControl } from 'maplibre-gl';
import { computed, onMounted, ref, toRef, watch } from 'vue';
import type { KebabProperties, Marker } from '~/api/types';

import doenerdudeIcon from '~/assets/doenerdude.png';
import doenerdudeIconTransparent from '~/assets/doenerdude-transparent.png';
import reviews from '~/assets/reviews.json';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';
import 'maplibre-gl/dist/maplibre-gl.css';

const props = withDefaults(
  defineProps<{
    selectedMarker?: Partial<Marker>;
  }>(),
  {
    selectedMarker: () => ({}),
  },
);

const emit = defineEmits<(e: 'markerClick', marker?: Marker) => void>();

let map: Map;

const prefersColorSchemeDark = usePrefersColorSchemeDark();

// TODO configurable tiles server
const darkMapStyle = 'https://tiles.slucky.de/styles/gray-matter/style.json';
const brightMapStyle = 'https://tiles.slucky.de/styles/bright-matter/style.json';

const selectedMarker = toRef(props, 'selectedMarker');

const icon = computed(() => {
  if (prefersColorSchemeDark.value) {
    return doenerdudeIcon;
  }

  return doenerdudeIconTransparent;
});

const reviewsGeoJson = reviews as FeatureCollection<Point, KebabProperties>;
reviewsGeoJson.features = reviewsGeoJson.features.map(feature => ({
  ...feature,
  properties: {
    ...feature.properties,
    scoreLabel: `${feature.properties.score}/${feature.properties.maximumPossibleScore}`,
  },
}));

const kebabLayer: Ref<SymbolLayerSpecification> = computed(() => ({
  id: 'kebab',
  type: 'symbol',
  source: 'geojson',
  paint: {
    'text-color': prefersColorSchemeDark.value ? 'white' : 'black',
  },
  layout: {
    'text-field': ['get', 'scoreLabel'],
    'text-font': ['Metropolis Regular', 'Klokantech Noto Sans Regular'],
    'text-size': 18,
    'text-offset': [1, 0.2],
    'text-anchor': 'left',
    'icon-image': 'doenerdude',
    'icon-size': 0.25,
    'icon-rotation-alignment': 'map',
    'icon-allow-overlap': true,
    'text-allow-overlap': ['step', ['zoom'], false, 15, true],
  },
}));

const mapElement = ref(null);
const { width, height } = useElementSize(mapElement);

function flyTo(center: [number, number]) {
  if (!map) {
    return;
  }

  map.flyTo({
    center,
    padding: {
      // 768: md breakpoint
      // 320: sidebar width w-80
      left: width.value >= 768 ? 320 : 0,
      bottom: width.value >= 768 ? 0 : height.value * (1 / 2),
    },
  });
}

const selectedMarkerItem = computed(() => {
  const marker = selectedMarker.value;
  if (!marker) {
    return undefined;
  }
  return reviewsGeoJson.features.find(({ properties }) => properties.name === marker.id);
});

watch(selectedMarkerItem, (_selectedMarkerItem) => {
  if (!map || !_selectedMarkerItem) {
    return;
  }

  flyTo(_selectedMarkerItem.geometry?.coordinates as [number, number]);
});

onMounted(async () => {
  map = new Map({
    container: 'map',
    style: prefersColorSchemeDark.value ? darkMapStyle : brightMapStyle,
    minZoom: 11,
    maxZoom: 18,
    center: [10.1283, 54.3266],
    zoom: 12,
    // [west, south, east, north]
    maxBounds: [9.8, 54.21, 10.44, 54.52],
    attributionControl: false,
  });

  const attributionControl = new AttributionControl({ compact: true });
  map.addControl(attributionControl, 'bottom-left');

  map.addControl(new NavigationControl({}), 'bottom-right');

  map.addControl(new GeolocateControl({}), 'bottom-right');

  async function loadContent() {
    const image = await map.loadImage(icon.value);
    map.addImage('doenerdude', image.data);
    map.addSource('geojson', {
      type: 'geojson',
      data: reviewsGeoJson,
    });

    map.addLayer(kebabLayer.value);
  }

  map.on('load', () => {
    void loadContent();

    if (selectedMarkerItem.value) {
      flyTo(selectedMarkerItem.value.geometry?.coordinates as [number, number]);
    }
  });

  map.on('mouseenter', 'kebab', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'kebab', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['kebab'],
    });

    // Deselect marker when the map is clicked
    if (features.length === 0) {
      emit('markerClick');
      return;
    }

    const feature = features[0] as unknown as {
      geometry: Point;
      properties: KebabProperties;
    };

    // Prevent reloading the same marker
    if (feature.properties.name === selectedMarker.value.id) {
      return;
    }

    emit('markerClick', { type: 'kebab', id: feature.properties.name });
  });

  map.on('drag', () => {
    if (selectedMarker.value !== null) {
      emit('markerClick');
    }
  });
});

// TODO: fix re-rendering of map content
watch(prefersColorSchemeDark, () => {
  if (prefersColorSchemeDark.value) {
    map.setStyle(darkMapStyle);
  }
  else {
    map.setStyle(brightMapStyle);
  }
});
</script>

<style scoped>
#map :deep(.maplibregl-ctrl-attrib) {
  @apply dark:bg-dark-400;
}

#map :deep(.maplibregl-ctrl-attrib a) {
  @apply dark:text-gray-300;
}

#map :deep(.maplibregl-ctrl-attrib-button) {
  @apply dark:(filter invert);
}

#map :deep(.maplibregl-ctrl-group) {
  @apply dark:bg-dark-400;
}

.dark #map :deep(.maplibregl-ctrl-group:not(:empty)) {
  box-shadow: 0 0 0 2px rgb(60 60 60);
}

#map :deep(.maplibregl-ctrl-group button + button) {
  @apply dark:border-t-dark-100;
}

#map :deep(.maplibregl-ctrl button .maplibregl-ctrl-icon) {
  @apply dark:(filter invert);
}
</style>
