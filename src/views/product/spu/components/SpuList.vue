<template>
  <el-card shadow="hover" class="mt-20">
    <el-button
      type="primary"
      :icon="Plus"
      :disabled="!categoryStore.category3Id"
      @click="showAddSpu"
    >
      添加SPU
    </el-button>

    <el-table :data="spuList" border class="mt-20" v-loading="loading">
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column label="SPU名称" prop="spuName" />
      <el-table-column label="SPU描述" prop="description" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Plus"
            size="small"
            title="添加SKU"
            @click="showAddSku(row)"
          />
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            title="修改SPU"
            @click="showUpdateSpu(row)"
          />
          <el-button
            type="info"
            :icon="InfoFilled"
            size="small"
            title="查看SKU列表"
          />
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            title="删除SPU"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-20"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[3, 6, 9, 12]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSpuList"
      @size-change="getSpuList"
    />
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'SpuList',
};
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { InfoFilled, Plus, Delete, Edit } from '@element-plus/icons-vue';
import { getSpuListApi } from '@/api/product/spu';
import type { SpuList, AllSpuItem } from '@/api/product/model/spuModel';
import { useCategoryStore } from '@/stores/category';
import { useSpuStore } from '@/stores/spu';

const currentPage = ref(1);
const pageSize = ref(3);
const total = ref(0);
const spuList = ref<SpuList>([]);
const loading = ref(false);

const categoryStore = useCategoryStore();

const getSpuList = async () => {
  loading.value = true;
  const res = await getSpuListApi({
    page: currentPage.value,
    limit: pageSize.value,
    category3Id: categoryStore.category3Id as number,
  });
  spuList.value = res.records;
  total.value = res.total;
  loading.value = false;
};

watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) {
      // 重置数据
      spuList.value = [];
      // 重置分页器
      currentPage.value = 1;
      pageSize.value = 3;
      total.value = 0;
      return;
    }
    getSpuList();
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(['setIsShow']);

const spuStore = useSpuStore();

const showAddSpu = () => {
  spuStore.$reset();
  emit('setIsShow', 2);
};

const showUpdateSpu = (row: AllSpuItem) => {
  // spuStore.spuItem = {
  //   ...row,
  //   // 原来数据是null。null赋值进去会报错
  //   spuImageList: [],
  //   spuSaleAttrList: [],
  // };
  spuStore.spuItem = row;
  emit('setIsShow', 2);
};

const showAddSku = (row: AllSpuItem) => {
  spuStore.spuItem = row;
  emit('setIsShow', 3);
};
</script>

<style scoped></style>
