<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <TheSidebar />
    <div class="flex-1 flex flex-col ml-64">
      <TheHeader />
      <main class="flex-1 p-6 mt-14 overflow-y-auto">
        <slot />
      </main>
      <TheFooter />
    </div>

  </div>
</template>