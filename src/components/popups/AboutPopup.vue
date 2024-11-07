<template>
  <div class="min-h-0 flex flex-grow flex-col overflow-y-auto">
    <div class="mb-2 flex items-center border-b-1 pb-2 space-x-2 dark:border-dark-100">
      <i-ph-info />
      <span class="text-lg">Döner-Dude Map</span>
    </div>
    <div class="text-l m-2 flex flex-col gap-2 text-center">
      <p class="mb-2">
        Finde den besten Döner in Kiel!
      </p>
      <p class="mb-2">
        So kannst du das Projekt unterstützen:
      </p>
      <Button href="https://www.instagram.com/derdoenerdude/">
        <i-mdi-instagram class="mr-2" />Follow @derdoenerdude
      </Button>
      <Button href="https://github.com/derdoenerdude/derdoenerdude">
        <i-mdi-github class="mr-2" />Develop on Github
      </Button>
      <Button href="https://boomerang.ju60.de/share/P4gp79cu/derdoenerdude">
        <i-ion-md-analytics class="mr-2" />Analytics
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atomic/Button.vue';
</script>
