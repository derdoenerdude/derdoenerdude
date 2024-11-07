<template>
  <div
    v-if="needRefresh"
    class="fixed bottom-0 left-0 right-0 z-20 mx-2 mb-2 flex flex-col items-center justify-center border-1 border-gray-200 rounded-md bg-white p-4 shadow-xl md:left-1/2 md:right-auto md:w-96 md:transform dark:border-dark-800 dark:bg-dark-400 dark:text-gray-300 md:-translate-x-1/2"
    role="alert"
  >
    <div class="mb-2 text-xl">
      <span>Eine neue Version ist verfügbar.</span>
    </div>

    <div class="w-full flex flex-row justify-center gap-x-4">
      <Button @click="updateServiceWorker(true)">
        Aktualisieren
      </Button>
      <Button @click="close">
        Abbrechen
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

import Button from '~/components/atomic/Button.vue';

const { needRefresh, updateServiceWorker } = useRegisterSW();

async function close() {
  needRefresh.value = false;
}
</script>
