<template>
  <div class="flex flex-col items-center flex-grow">
    <i-fa-solid-ban class="text-3xl mt-auto" />
    <p class="my-2 text-lg"><slot /></p>
    <Button :to="{ name: 'home' }" class="mt-auto mb-4" replace>
      <i-fa-close class="mr-2" /><span>Schließen</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atomic/Button.vue';
</script>
