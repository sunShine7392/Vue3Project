<template>
  <el-card shadow="hover">
    <el-form inline :disabled="disabled">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择一级分类"
          v-model="categoryStore.category1Id"
        >
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c1 in categoryStore.category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择二级分类"
          v-model="categoryStore.category2Id"
        >
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c2 in categoryStore.category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择三级分类"
          v-model="categoryStore.category3Id"
        >
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c3 in categoryStore.category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "CategorySelector",
};
</script>

<script lang="ts" setup>
/*
  1. 一上来请求一级分类列表
  2. 选择一级分类列表，请求二级分类列表
  3. 选择二级分类列表，请求三级分类列表
*/
import { onMounted, watch, onBeforeUnmount } from "vue";
import { useCategoryStore } from "@/stores/category";

defineProps<{
  disabled: boolean;
}>();

const categoryStore = useCategoryStore();

// 1. 一上来请求一级分类列表
onMounted(async () => {
  categoryStore.getCategory1List();
});

// 2. 选择一级分类列表，请求二级分类列表
watch(
  () => categoryStore.category1Id,
  () => {
    categoryStore.getCategory2List();
  }
);
// 3. 选择二级分类列表，请求三级分类列表
watch(
  () => categoryStore.category2Id,
  (category2Id) => {
    if (!category2Id) return;
    categoryStore.getCategory3List();
  }
);

onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped>
:deep(.el-form-item) {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
