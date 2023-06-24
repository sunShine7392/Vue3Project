<template>
  <div>
    <!-- 
      SpuList不禁用
      其他都要禁用
     -->
    <CategorySelector :disabled="isShow !== 1" />
    <SpuList v-if="isShow === 1" @setIsShow="setIsShow" />
    <AddOrUpdateSpu v-else-if="isShow === 2" @setIsShow="setIsShow" />
    <AddSku v-else @setIsShow="setIsShow" />
  </div>
</template>

<script lang="ts">
export default {
  name: "XSpu",
};
</script>

<script lang="ts" setup>
import { ref } from "vue";
import CategorySelector from "@/components/CategorySelector/index.vue";
import SpuList from "./components/SpuList.vue";
import AddOrUpdateSpu from "./components/AddOrUpdateSpu.vue";
import AddSku from "./components/AddSku.vue";

/*
  1 SpuList
  2 AddOrUpdateSpu
  3 AddSku
*/
const isShow = ref(1);

const setIsShow = (newVal: number) => {
  isShow.value = newVal;
};
</script>

<style scoped></style>
