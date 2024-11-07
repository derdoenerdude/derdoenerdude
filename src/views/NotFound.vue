<template>
  <div class="h-full w-full flex flex-col items-center justify-center">
    <p class="mb-8 text-2xl">
      Whoa 404, either we broke something or you had a typing mishap :-/
    </p>
    <span>Back to <router-link class="text-blue-400" replace :to="{ name: 'home' }">home</router-link></span>
  </div>
</template>
