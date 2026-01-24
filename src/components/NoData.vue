<template>
  <div class="flex flex-grow flex-col items-center">
    <i-ph-empty-bold class="mt-auto text-3xl" />
    <p class="my-2 text-lg">
      <slot />
    </p>
    <Button :to="{ name: 'home' }" class="mb-4 mt-auto" replace>
      <i-ph-x-bold class="mr-2" /><span>Schließen</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atomic/Button.vue';
</script>
