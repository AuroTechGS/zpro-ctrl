<template>
  <div ref="threeContainer" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { initScene } from "../../assets/js/thressInit.js";
let threeContainer = ref(null);

onMounted(() => {
  initScene(threeContainer.value);
});
</script>

<style scoped>
/* 这里可以根据需要调整样式 */
</style>
