# day05

## 修改属性功能

### 1. 点击修改按钮显示组件

```html
<el-button
  type="warning"
  :icon="Edit"
  size="small"
  @click="showUpdateAttr(row)"
/>
```

```ts
import type { AttrList, AttrItem } from "@/api/product/model/attrModel";

const showUpdateAttr = (row: AttrItem) => {
  emit("setIsShowAttrList", false);
};
```

### 2. 点击修改按钮传递 row 数据

AttrList 需要传递给 AddOrUpdateAttr 数据，而他们是兄弟关系，使用 pinia

1. 定义 pinia 模块

```ts
// stores/interface/index.ts
import type { AttrItem } from "@/api/product/model/attrModel";

// 三级分类数据
export interface AttrState {
  attrItem: AttrItem;
}
```

```ts
// stores/attr.ts
import { defineStore } from "pinia";
import type { AttrState } from "./interface";

export const useAttrStore = defineStore("attr", {
  state: (): AttrState => {
    return {
      attrItem: {
        // 类型中必选属性必须写
        attrName: "",
        attrValueList: [],
      },
    };
  },
});
```

2. 点击修改按钮传递数据

```ts
import { useAttrStore } from "@/stores/attr";

const attrStore = useAttrStore();

const showUpdateAttr = (row: AttrItem) => {
  emit("setIsShowAttrList", false);
  attrStore.attrItem = row;
};
```

3. 修改组件显示数据

```ts
import { useAttrStore } from "@/stores/attr";

const attrStore = useAttrStore();

// 表单数据
const attrFormData = reactive<AttrItem>({
  // 表单数据名称看接口文档
  attrName: attrStore.attrItem.attrName,
  attrValueList: attrStore.attrItem.attrValueList,
});
```

### 3. 解决添加属性数据没清空问题

```ts
const showAddAttr = () => {
  emit("setIsShowAttrList", false);
  // 重置所有数据为初始化值
  attrStore.$reset();
};
```

### 4. 完成修改属性功能

```ts
const addOrUpdateAttr = async () => {
  const { attrName, attrValueList } = attrFormData;
  const { category3Id } = categoryStore;
  const { id } = attrStore.attrItem;
  // 添加和更新用的同一个接口
  // 有id就是更新
  // 没有id就是添加
  await addOrUpdateAttrApi({
    attrName,
    attrValueList,
    categoryLevel: 3,
    categoryId: category3Id,
    id,
  });
  ElMessage.success(`${id ? "更新" : "添加"}属性成功`);
  cancel();
};
```

## 卸载时清空三级分类数据

```ts
// components/CategorySelector/index.vue
import { onMounted, watch, onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  categoryStore.$reset();
});
```

## SpuList 静态组件

```html
<template>
  <el-card shadow="hover" class="mt-20">
    <el-button type="primary" :icon="Plus">添加SPU</el-button>

    <el-table :data="[{}]" border class="mt-20">
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column label="SPU名称" prop="spuName" />
      <el-table-column label="SPU描述" prop="description" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" :icon="Plus" size="small" title="添加SKU" />
          <el-button type="warning" :icon="Edit" size="small" title="修改SPU" />
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
    name: "SpuList",
  };
</script>

<script lang="ts" setup>
  import { ref } from "vue";
  import { InfoFilled, Plus, Delete, Edit } from "@element-plus/icons-vue";

  const currentPage = ref(1);
  const pageSize = ref(3);
  const total = ref(0);

  const getSpuList = () => {};
</script>

<style scoped></style>
```

## SpuList 数据分页展示

### 1. 定义接口函数和类型

```ts
export interface GetSpuListParams {
  page: number;
  limit: number;
  category3Id: number;
}

export interface SpuItem {
  id: number;
  spuName: string; // spu名称
  description: string; // spu描述
  category3Id: number; // 三级分类id
  tmId: number; // 品牌id
  spuSaleAttrList: null;
  spuImageList: null;
}

export type SpuList = SpuItem[];

export interface GetSpuListResponse {
  records: SpuList;
  total: number;
  // 用不上的参数可以不用定义类型
  // 在你不确定这个参数用不用的上时候，先定义再说
  // size: number;
  // current: number;
  // searchCount: boolean;
  // pages: number;
}
```

```ts
import request from "@/utils/request";
import type { GetSpuListParams, GetSpuListResponse } from "./model/spuModel";

enum Api {
  getSpuListUrl = "/admin/product",
}

/**
 * 获取SPU列表
 * @param GetSpuListParams
 * @returns GetSpuListResponse
 */
export const getSpuListApi = ({
  page,
  limit,
  category3Id,
}: GetSpuListParams) => {
  return request.get<any, GetSpuListResponse>(
    Api.getSpuListUrl + `/${page}/${limit}`,
    {
      params: {
        category3Id,
      },
    }
  );
};
```

### 2. 封装公共函数

```ts
import { getSpuListApi } from "@/api/product/spu";
import type { SpuList } from "@/api/product/model/spuModel";
import { useCategoryStore } from "@/stores/category";

const spuList = ref<SpuList>([]);

const categoryStore = useCategoryStore();

const getSpuList = async () => {
  const res = await getSpuListApi({
    page: currentPage.value,
    limit: pageSize.value,
    category3Id: categoryStore.category3Id as number,
  });
  spuList.value = res.records;
  total.value = res.total;
};
```

### 3. 使用公共函数

```ts
import { ref, watch } from "vue";

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
  }
);
```

```html
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
```

### 4. 渲染数据

```html
<el-table :data="spuList" border class="mt-20">
  <el-table-column label="SPU名称" prop="spuName" />
  <el-table-column label="SPU描述" prop="description" />
</el-table>
```

### 5. 添加 loading 效果

```html
<el-table :data="spuList" border class="mt-20" v-loading="loading"></el-table>
```

```ts
const loading = ref(false);

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
```

### 6. 添加 row-key

```html
<el-table
  :data="spuList"
  border
  class="mt-20"
  v-loading="loading"
  row-key="id"
></el-table>
```

## SPU 列表和添加 SPU 组件切换显示

### 1. 添加按钮禁用效果

```html
<el-button type="primary" :icon="Plus" :disabled="!categoryStore.category3Id">
  添加SPU
</el-button>
```

### 2. 定义 AddOrUpdateSpu 组件

```html
<template>
  <div>AddOrUpdateSpu</div>
  <el-button @click="cancel">取消</el-button>
</template>

<script lang="ts">
  export default {
    name: "AddOrUpdateSpu",
  };
</script>

<script lang="ts" setup></script>

<style scoped></style>
```

### 3. 组件切换显示

```html
<SpuList v-if="isShowSpuList" />

<AddOrUpdateSpu v-else />
```

```ts
import { ref } from "vue";

const isShowSpuList = ref(false);
```

### 4. 点击添加按钮，显示添加 SPU 组件

1. 父给子绑定自定义事件

```html
<SpuList v-if="isShowSpuList" @setIsShowSpuList="setIsShowSpuList" />
```

2. 子组件声明接受

```ts
const emit = defineEmits(["setIsShowSpuList"]);
```

3. 按钮绑定事件

```html
<el-button
  type="primary"
  :icon="Plus"
  :disabled="!categoryStore.category3Id"
  @click="showAddSpu"
>
  添加SPU
</el-button>
```

4. 触发事件，切换组件

```ts
const showAddSpu = () => {
  emit("setIsShowSpuList", false);
};
```

### 5. 点击取消按钮，显示 SPU 列表组件

1. 父给子绑定自定义事件

```html
<AddOrUpdateSpu v-else @setIsShowSpuList="setIsShowSpuList" />
```

2. 子组件声明接受

```ts
const emit = defineEmits(["setIsShowSpuList"]);
```

3. 按钮绑定事件

```html
<el-button @click="cancel">取消</el-button>
```

4. 触发事件，切换组件

```ts
const cancel = () => {
  emit("setIsShowSpuList", true);
};
```

### 6. 分类选择器禁用效果

```html
<CategorySelector :disabled="!isShowSpuList" />
```

## 添加 SPU

### 1. 静态组件

```html
<template>
  <el-card class="mt-20" shadow="hover">
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select>
          <el-option label="111" value="111" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="请输入SPU描述" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="SPU图片"> xxx </el-form-item>
      <el-form-item label="销售属性">
        <el-select class="mr-10">
          <el-option label="111" value="111" />
        </el-select>
        <el-button type="primary" :icon="Plus">添加销售属性</el-button>
        <el-table :data="[{}]" border class="mt-20">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column label="属性名" prop="xxx" />
          <el-table-column label="属性值名称列表" prop="xxx" />
          <el-table-column label="操作" width="100">
            <el-button type="danger" :icon="Delete" size="small" />
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
  export default {
    name: "AddOrUpdateSpu",
  };
</script>

<script lang="ts" setup>
  import { Plus, Delete } from "@element-plus/icons-vue";

  const emit = defineEmits(["setIsShowSpuList"]);

  const cancel = () => {
    emit("setIsShowSpuList", true);
  };
</script>

<style scoped></style>
```

### 2. 获取品牌和基础销售属性数据展示

1. 定义接口函数和类型

```ts
import type { CategoryList } from "./categoryModel";
export type BaseSaleAttrList = CategoryList;
```

```ts
import type {
  GetSpuListParams,
  GetSpuListResponse,
  BaseSaleAttrList,
} from "./model/spuModel";
getBaseSaleAttrListUrl = "/admin/product/baseSaleAttrList",
/**
 * 获取基础销售属性列表
 * @returns BaseSaleAttrList
 */
export const getBaseSaleAttrListApi = () => {
  return request.get<any, BaseSaleAttrList>(Api.getBaseSaleAttrListUrl);
};
```

```ts
/**
 * 获取所有品牌列表数据
 * @returns TrademarkList
 */
export const getAllTrademarkListApi = () => {
  return request.get<any, TrademarkList>(Api.getAllTrademarkListUrl);
};
```

2. 发送请求，获取数据

```ts
import { onMounted, ref, reactive } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { getBaseSaleAttrListApi } from "@/api/product/spu";
import type { BaseSaleAttrList } from "@/api/product/model/spuModel";
import { getAllTrademarkListApi } from "@/api/product/trademark";
import type { TrademarkList } from "@/api/product/model/trademarkModel";

// 基础销售属性列表
const baseSaleAttrList = ref<BaseSaleAttrList>([]);
// 品牌列表
const trademarkList = ref<TrademarkList>([]);

onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
});

onMounted(async () => {
  trademarkList.value = await getAllTrademarkListApi();
});
```

3. 数据展示

```html
<el-option
  v-for="tm in trademarkList"
  :key="tm.id"
  :label="tm.tmName"
  :value="tm.id"
/>

<el-option
  v-for="baseSaleAttr in baseSaleAttrList"
  :key="baseSaleAttr.id"
  :label="baseSaleAttr.name"
  :value="baseSaleAttr.id"
/>
```

### 3. 上传图片功能

1. 复制 element-plus el-upload 上传多张图片代码

```html
<el-upload
  v-model:file-list="fileList"
  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove"
>
  <el-icon><Plus /></el-icon>
</el-upload>

<el-dialog v-model="dialogVisible">
  <img w-full :src="dialogImageUrl" alt="Preview Image" />
</el-dialog>
```

```ts
import { Plus } from "@element-plus/icons-vue";

import type { UploadProps } from "element-plus";

const fileList = ref([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
```

2. 修改上传图片服务器地址

```ts
:action="BASE_URL + '/admin/product/upload'"
```

```ts
const BASE_URL = import.meta.env.VITE_API_URL;
```

3. 预览图片功能

例子中已经完成功能，只需要修改图片样式

```html
<el-dialog v-model="dialogVisible" width="30%">
  <el-image :src="dialogImageUrl" class="spu-img" />
</el-dialog>
```

```css
.spu-img {
  width: 100%;
}
```

4. 删除图片功能

例子中已经完成功能，甚至都不需要绑定 on-remove

5. 限制图片的大小和类型

- 定义公共函数

```ts
// utils/tools.ts
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";

export const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  /*
    rawFile 上传图片文件
      type 图片类型
      size 图片大小
  */
  const validImageTypes = ["image/jpeg", "image/png"];

  if (!validImageTypes.includes(rawFile.type)) {
    ElMessage.error("图片只能是jpg或png格式!");
    // 返回值false，就会中止上传
    return false;
  } else if (rawFile.size > 200 * 1024) {
    ElMessage.error("图片大小不能超过200kb!");
    return false;
  }
  // 返回值true，就会继续上传
  return true;
};
```

- 组件使用

```ts
import { beforeAvatarUpload } from "@/utils/tools";
```

```html
<el-upload
  accept="image/*"
  v-model:file-list="fileList"
  :action="BASE_URL + '/admin/product/upload'"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :before-upload="beforeAvatarUpload"
>
  <el-icon><Plus /></el-icon>
  <template #tip>
    <div class="el-upload__tip">只能上传jpg/png文件，且不超过200kb</div>
  </template>
</el-upload>
```

6. 限制图片数量

```html
<el-upload
  accept="image/*"
  v-model:file-list="fileList"
  :action="BASE_URL + '/admin/product/upload'"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :before-upload="beforeAvatarUpload"
  :limit="10"
  :on-exceed="handleUploadExceed"
  :on-success="handleUploadSuccess"
>
  <el-icon><Plus /></el-icon>
  <template #tip>
    <div class="el-upload__tip">只能上传jpg/png文件，且不超过200kb</div>
  </template>
</el-upload>
```

```ts
import { ElMessage } from "element-plus";
const handleUploadExceed = () => {
  ElMessage.error("最多只能上传10张");
};
```

### 4. 表单校验和收集数据

1. 定义数据

```ts
const spuFormRef = ref();

const spuFormData = reactive({
  spuName: "",
  tmId: undefined,
  description: "",
  spuImageList: [],
  spuSaleAttrList: [],
});

const spuFormRules = reactive({
  spuName: [{ required: true, message: "请输入SPU名称", trigger: "blur" }],
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
  spuImageList: [{ required: true, message: "请上传SPU图片" }],
  spuSaleAttrList: [{ required: true, message: "请添加SPU销售属性" }],
});
```

2. 绑定数据给 el-form

```html
<el-form
  label-width="100px"
  ref="spuFormRef"
  :model="spuFormData"
  :rules="spuFormRules"
></el-form>
```

3. 指定表单项校验规则

```html
<el-form-item label="SPU名称" prop="spuName"></el-form-item>

<el-form-item label="品牌" prop="tmId"></el-form-item>

<el-form-item label="SPU描述" prop="description"></el-form-item>

<el-form-item label="SPU图片" prop="spuImageList"></el-form-item>

<el-form-item label="销售属性" prop="spuSaleAttrList"></el-form-item>
```

4. 收集表单数据

```html
<el-input placeholder="请输入SPU名称" v-model="spuFormData.spuName" />

<el-select v-model="spuFormData.tmId"></el-select>

<el-input
  placeholder="请输入SPU描述"
  type="textarea"
  :rows="3"
  v-model="spuFormData.description"
/>

<el-upload
  accept="image/*"
  v-model:file-list="spuFormData.spuImageList"
  :action="BASE_URL + '/admin/product/upload'"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :before-upload="beforeAvatarUpload"
  :limit="10"
  :on-exceed="handleUploadExceed"
  :on-success="handleUploadSuccess"
></el-upload>
```
