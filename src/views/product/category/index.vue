<template>
  <el-card shadow="hover">
    <!-- 
      lazy 懒加载
      :load="load" 懒加载时触发的函数
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        children 当前行的子节点
        hasChildren 是否有子节点
     -->
    <el-table
      :data="categoryList"
      border
      :row-key="getRowKey"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类id" prop="id" />
      <el-table-column label="分类名称" prop="name" />
      <el-table-column label="操作">
        <el-button type="primary" :icon="Plus" size="small" />
        <el-button type="warning" :icon="Edit" size="small" />
        <el-button type="danger" :icon="Delete" size="small" />
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "XCategory",
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";
import type {
  CategoryList,
  CategoryItem,
} from "@/api/product/model/categoryModel";

const categoryList = ref<CategoryList>([]);

// 请求一级分类数据
onMounted(async () => {
  const res = await getCategory1ListApi();
  categoryList.value = res.map((categoryItem) => {
    return {
      ...categoryItem,
      hasChildren: true, // 声明当前节点拥有子节点
      level: 1, // 一级分类
    };
  });
});

// 点击图标>, 触发当前函数
const load = async (
  row: CategoryItem,
  treeNode: unknown,
  resolve: (data: CategoryList) => void
) => {
  if (row.level === 1) {
    // 请求二级分类数据
    const res = await getCategory2ListApi(row.id);
    // 将这个数据添加到当前数据children中，内容就会作为当前数据的子节点展示
    resolve(
      res.map((categoryItem) => {
        return {
          ...categoryItem,
          hasChildren: true, // 声明当前节点拥有子节点
          level: 2, // 二级分类
        };
      })
    );
  } else if (row.level === 2) {
    const res = await getCategory3ListApi(row.id);
    resolve(
      res.map((categoryItem) => {
        return {
          ...categoryItem,
          // hasChildren: false, // 声明当前节点拥有子节点
          level: 3, // 二级分类
        };
      })
    );
  }
};

// 设置元素key
const getRowKey = (row: CategoryItem) => {
  return row.level + "" + row.id;
};
</script>

<style scoped></style>
