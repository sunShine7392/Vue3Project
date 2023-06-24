<template>
  <el-card shadow="hover">
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select placeholder="请选择一级分类" v-model="category1Id">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择二级分类" v-model="category2Id">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择三级分类" v-model="category3Id">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option
            v-for="c3 in category3List"
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
import { onMounted, ref, watch } from "vue";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";
import type { CategoryList } from "@/api/product/model/categoryModel";

const category1Id = ref();
const category2Id = ref();
const category3Id = ref();
const category1List = ref<CategoryList>([]);
const category2List = ref<CategoryList>([]);
const category3List = ref<CategoryList>([]);
// 1. 一上来请求一级分类列表
onMounted(async () => {
  category1List.value = await getCategory1ListApi();
});
// 2. 选择一级分类列表，请求二级分类列表
watch(category1Id, async (category1Id: number) => {
  category2List.value = await getCategory2ListApi(category1Id);
  // 清空一级和二级分类id
  category2Id.value = undefined;
  category3Id.value = undefined;
  category3List.value = [];
});
// 3. 选择二级分类列表，请求三级分类列表
watch(category2Id, async (category2Id: number) => {
  // 当重新选择一级分类id时，二级分类id由有值变成undefined，触发watch
  // 此时category2Id是undefined，不能请求数据
  if (!category2Id) return;
  category3List.value = await getCategory3ListApi(category2Id);
  category3Id.value = undefined;
});
</script>

<style scoped>
:deep(.el-form-item) {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
