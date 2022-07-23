<template>
  <div id="map" class="w-full h-full" />
</template>

<script lang="ts">
// eslint-disable-next-line no-restricted-imports
import 'maplibre-gl/dist/maplibre-gl.css';

import type { FeatureCollection, Point } from 'geojson';
import { AttributionControl, GeolocateControl, Map, NavigationControl, SymbolLayerSpecification } from 'maplibre-gl';
import { computed, defineComponent, onMounted, PropType, Ref, toRef, watch } from 'vue';

import { KebabProperties, Marker } from '~/api/types';
import doenerdudeIcon from '~/assets/doenerdude.png';
import doenerdudeIconTransparent from '~/assets/doenerdude-transparent.png';
import reviews from '~/assets/reviews.json';
import { usePrefersColorSchemeDark } from '~/compositions/usePrefersColorScheme';

export default defineComponent({
  name: 'Map',

  props: {
    selectedMarker: {
      type: Object as PropType<Marker>,
      default: () => ({}),
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    markerClick: (_marker?: Marker) => true,
  },

  setup(props, { emit }) {
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

    const kebabLayer: Ref<SymbolLayerSpecification> = computed(() => ({
      id: 'kebab',
      type: 'symbol',
      source: 'geojson',
      paint: {
        'text-color': prefersColorSchemeDark.value ? 'white' : 'black',
      },
      layout: {
        'text-field': ['get', 'score'],
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

    function flyTo(center: [number, number]) {
      if (!map) {
        return;
      }

      map.flyTo({
        center,
        padding: {
          bottom: 500, // TODO use 3/4 of screen height
        },
        zoom: 16,
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
      map.addControl(attributionControl);

      map.addControl(new NavigationControl({}), 'bottom-right');

      map.addControl(new GeolocateControl({}), 'bottom-right');

      map.on('load', () => {
        // eslint-disable-next-line promise/prefer-await-to-callbacks
        map.loadImage(icon.value, (error, image) => {
          if (error) {
            throw error;
          }
          if (!image) {
            throw new Error('Image not found');
          }
          map.addImage('doenerdude', image);
          map.addSource('geojson', {
            type: 'geojson',
            data: reviewsGeoJson,
          });

          map.addLayer(kebabLayer.value);
        });

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

        flyTo(feature.geometry.coordinates as [number, number]);
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
      } else {
        map.setStyle(brightMapStyle);
      }
    });
  },
});
</script>
