<template>
  <div class="flex flex-col min-h-0 flex-grow">
    <div class="flex pb-2 mb-2 border-b-1 dark:border-dark-100 space-x-2 items-center">
      <i-ph-info />
      <span class="text-lg">Döner-Dude Map</span>
    </div>
    <div class="flex flex-col gap-2 m-2 text-center text-l">
      <p class="mb-2">Finde den besten Döner in Kiel!</p>
      <p class="mb-2">So kannst du das Projekt unterstützen:</p>
      <Button href="https://www.instagram.com/derdoenerdude/"
        ><i-mdi-instagram class="mr-2" />Follow @derdoenerdude</Button
      >
      <Button href="https://github.com/derdoenerdude/derdoenerdude"
        ><i-mdi-github class="mr-2" />Develop on Github</Button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '~/components/atomic/Button.vue';

export default defineComponent({
  name: 'AboutPopup',
  components: { Button },
});
</script>
