<template>
  <el-card shadow="hover" class="mt-20">
    <!-- 
      三级分类id有值，不禁用，false
      三级分类id没值，禁用，true
    -->
    <el-button
      type="primary"
      :icon="Plus"
      :disabled="!categoryStore.category3Id"
      @click="showAddAttr"
    >
      添加属性
    </el-button>

    <el-table :data="attrList" border class="mt-20">
      <el-table-column type="index" align="center" label="序号" width="60" />
      <el-table-column prop="attrName" label="属性名" width="150" />
      <el-table-column label="属性值列表">
        <template v-slot="{ row }">
          <el-tag
            type="success"
            v-for="attrValue in row.attrValueList"
            :key="attrValue.id"
            class="mr-10"
          >
            {{ attrValue.valueName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            @click="showUpdateAttr(row)"
          />
          <el-popconfirm title="您确认要删除吗？" @confirm="delAttr(row.id)">
            <template #reference>
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                title="删除属性"
              />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AttrList",
};
</script>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { getAttrListApi, delAttrApi } from "@/api/product/attr";
import type { AttrList, AttrItem } from "@/api/product/model/attrModel";
import { useCategoryStore } from "@/stores/category";
import { useAttrStore } from "@/stores/attr";
import { ElMessage } from "element-plus";
// 选择三级分类时请求属性数据
const attrList = ref<AttrList>([]);

const categoryStore = useCategoryStore();

const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrList.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
};

watch(
  () => categoryStore.category3Id,
  () => {
    const { category3Id } = categoryStore;
    if (!category3Id) {
      attrList.value = [];
      return;
    }
    getAttrList();
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(["setIsShowAttrList"]);

const attrStore = useAttrStore();

const showAddAttr = () => {
  emit("setIsShowAttrList", false);
  // 重置所有数据为初始化值
  attrStore.$reset();
};

const showUpdateAttr = (row: AttrItem) => {
  emit("setIsShowAttrList", false);
  attrStore.attrItem = row;
};

const delAttr = async (id: number) => {
  await delAttrApi(id);
  ElMessage.success("删除属性成功");
  getAttrList();
};
</script>

<style scoped></style>
