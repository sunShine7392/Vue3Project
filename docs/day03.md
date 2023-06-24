# day03

## 品牌管理

### 1. 添加&修改品牌切换显示

1. 修改按钮绑定点击事件，传递当前行数据

```html
<template v-slot="{ row }">
  <el-button
    type="warning"
    :icon="Edit"
    size="small"
    @click="showUpdateTrademarkDialog(row)"
  />
  <el-button type="danger" :icon="Delete" size="small" />
</template>
```

2. 设置回调函数，更新数据

```ts
import type {
  TrademarkList,
  TrademarkItem,
} from "@/api/product/model/trademarkModel";

// 表单数据
const trademarkFormData = reactive({
  // 表单参数名称看接口文档
  // 品牌名称
  tmName: "",
  // 品牌LOGO
  logoUrl: "",
  // 初始化id
  id: 0,
});

// 显示修改
const showUpdateTrademarkModel = (row: TrademarkItem) => {
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id;
  dialogVisible.value = true;
};
```

3. dialog 的标题

```html
<el-dialog
  v-model="dialogVisible"
  :title="`${trademarkFormData.id ? '修改' : '添加'}品牌`"
></el-dialog>
```

4. 切换时清空表单校验结果

```ts
const showAddTrademarkDialog = () => {
  // 清空表单数据
  trademarkFormData.tmName = "";
  trademarkFormData.logoUrl = "";
  trademarkFormData.id = 0;
  // 显示dialog
  dialogVisible.value = true;
  // 清空表单校验结果
  trademarkFormRef.value.clearValidate();
};
const showUpdateTrademarkModel = (row: TrademarkItem) => {
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id;
  dialogVisible.value = true;
  trademarkFormRef.value.clearValidate();
};
```

5. 封装复用函数

```ts
// 之前函数注释了
// 封装复用函数
const showTrademarkDialog = (row: TrademarkItem) => {
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id;
  dialogVisible.value = true;
  trademarkFormRef.value.clearValidate();
};
```

6. 页面使用

```html
<el-button
  type="primary"
  :icon="Plus"
  @click="showTrademarkDialog({ id: 0, tmName: '', logoUrl: '' })"
>
  添加品牌
</el-button>

<el-button
  type="warning"
  :icon="Edit"
  size="small"
  @click="showTrademarkDialog(row)"
/>
```

7. 解决第一次清空表单校验报错问题

原因：第一次 el-form 还未渲染，点击显示对话框时立即清空表单校验，获取不到表单实例，从而报错

```ts
// 封装复用函数
const showTrademarkDialog = (row: TrademarkItem) => {
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id;
  // 数据更新是同步，页面更新是异步
  dialogVisible.value = true;
  // Uncaught TypeError: Cannot read properties of undefined (reading 'clearValidate')
  // 翻译：trademarkFormRef.value 是 undefined
  // if ( trademarkFormRef.value) {
  //   trademarkFormRef.value.clearValidate();
  // }
  // trademarkFormRef.value && trademarkFormRef.value.clearValidate();
  // 可选链
  // 判断?前面的数据是否有值，有值继续执行后面，没有值就不执行了
  trademarkFormRef.value?.clearValidate();
};
```

### 2. 完成修改品牌功能

1. 定义接口函数

```ts
updateTrademarkUrl = "/admin/product/baseTrademark/update",
/**
 * 更新品牌
 * @param tm TrademarkItem
 * @returns null
 */
export const updateTrademarkApi = (tm: TrademarkItem) => {
  return request.put<any, null>(Api.updateTrademarkUrl, tm);
};
```

2. 组件使用

```ts
import {
  getTrademarkListApi,
  addTrademarkApi,
  updateTrademarkApi,
} from "@/api/product/trademark";

// 点击确定按钮
const addTrademark = async () => {
  // 1. 校验整个表单
  /*
    校验通过，promise对象就是成功状态
    校验失败，promise对象就是失败状态

    async函数中，只要有一个promise变成失败状态，整个函数会直接退出
    promise变成成功状态，继续执行剩下代码
  */
  await trademarkFormRef.value.validate();
  // 2. 校验通过，才能发送请求
  const { tmName, logoUrl, id } = trademarkFormData;

  if (id) {
    // 修改
    await updateTrademarkApi(trademarkFormData);
  } else {
    // 添加
    await addTrademarkApi(tmName, logoUrl);
  }

  ElMessage.success(`${id ? "修改" : "添加"}品牌成功`);
  dialogVisible.value = false;
  // 再次发送请求，获取最新数据展示
  getTrademarkList();
};
```

### 3. 完成删除品牌功能

1. 定义接口函数

```ts
delTrademarkUrl = "/admin/product/baseTrademark/remove",
/**
 * 删除品牌
 * @param id 品牌id
 * @returns null
 */
export const delTrademarkApi = (id: number) => {
  return request.delete<any, null>(Api.delTrademarkUrl + `/${id}`);
};
```

2. 组件绑定点击事件

```html
<template v-slot="{ row }">
  <el-button
    type="warning"
    :icon="Edit"
    size="small"
    @click="showTrademarkDialog(row)"
  />
  <el-button
    type="danger"
    :icon="Delete"
    size="small"
    @click="delTrademark(row)"
  />
</template>
```

3. 完成删除功能

```ts
import {
  getTrademarkListApi,
  addTrademarkApi,
  updateTrademarkApi,
  delTrademarkApi,
} from "@/api/product/trademark";
import { ElMessage, ElMessageBox } from "element-plus";
// 删除品牌
const delTrademark = (row: TrademarkItem) => {
  ElMessageBox.confirm(`您确认要删除 ${row.tmName} 吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 点击确定按钮触发的回调
      // 发送请求，删除
      await delTrademarkApi(row.id);
      getTrademarkList();
      ElMessage.success("删除品牌成功");
    })
    .catch(() => {
      // 回调函数没有写内容，为了防止报错。
      // 因为promise对象不处理失败状态，会报错的。（当然这个报错也不会影响程序运行）
      // ElMessage({
      //   type: "info",
      //   message: "Delete canceled",
      // });
    });
};
```

## 三级分类功能

### 1. 静态组件

因为 CategorySelector 将来有属性管理和 SPU 管理两个页面使用，所以定义成公共组件

```html
<template>
  <el-card shadow="hover">
    <!-- inline行内表单，表单项会水平排列 -->
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select placeholder="请选择一级分类">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option :label="111" :value="111" />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择二级分类">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option :label="111" :value="111" />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择三级分类">
          <!-- label是显示的内容，value将来收集到的值 -->
          <el-option :label="111" :value="111" />
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

<script lang="ts" setup></script>

<style scoped>
  :deep(.el-form-item) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
```

### 2. 定义接口函数&类型

```ts
// api/product/model/categoryModel.ts
export interface CategoryItem {
  id: number;
  name: string;
}

export type CategoryList = CategoryItem[];
```

```ts
// api/product/category.ts
import request from "@/utils/request";
import type { CategoryList } from "./model/categoryModel";

enum Api {
  getCategory1ListUrl = "/admin/product/getCategory1",
  getCategory2ListUrl = "/admin/product/getCategory2",
  getCategory3ListUrl = "/admin/product/getCategory3",
}

/**
 * 获取一级分类列表
 * @returns CategoryList
 */
export const getCategory1ListApi = () => {
  return request.get<any, CategoryList>(Api.getCategory1ListUrl);
};

/**
 * 获取二级分类列表
 * @param category1Id 1级分类id
 * @returns CategoryList
 */
export const getCategory2ListApi = (category1Id: number) => {
  return request.get<any, CategoryList>(
    Api.getCategory2ListUrl + `/${category1Id}`
  );
};

/**
 * 获取三级分类列表
 * @param category2Id 2级分类id
 * @returns CategoryList
 */
export const getCategory3ListApi = (category2Id: number) => {
  return request.get<any, CategoryList>(
    Api.getCategory3ListUrl + `/${category2Id}`
  );
};
```

### 3. 一上来请求一级分类列表

```ts
import { onMounted, ref } from "vue";
import { getCategory1ListApi } from "@/api/product/category";
import type { CategoryList } from "@/api/product/model/categoryModel";

const category1List = ref<CategoryList>([]);
// 1. 一上来请求一级分类列表
onMounted(async () => {
  category1List.value = await getCategory1ListApi();
});
```

```html
<el-option
  v-for="c1 in category1List"
  :key="c1.id"
  :label="c1.name"
  :value="c1.id"
/>
```

### 4. 选择一级分类，请求二级分类列表

1. 收集一级分类 id 数据

```html
<el-select placeholder="请选择一级分类" v-model="category1Id"></el-select>
```

```ts
const category1Id = ref();
```

2. 监视一级分类 id 的变化，请求二级分类列表

```ts
import { onMounted, ref, watch } from "vue";
import {
  getCategory1ListApi,
  getCategory2ListApi,
} from "@/api/product/category";

const category2List = ref<CategoryList>([]);

watch(category1Id, async (category1Id: number) => {
  category2List.value = await getCategory2ListApi(category1Id);
});
```

3. 数据展示

```html
<el-option
  v-for="c2 in category2List"
  :key="c2.id"
  :label="c2.name"
  :value="c2.id"
/>
```

### 5. 选择二级分类，请求三级分类列表

1. 收集二级分类 id 数据

```html
<el-select placeholder="请选择二级分类" v-model="category2Id"></el-select>
```

```ts
const category2Id = ref();
```

2. 监视二级分类 id 的变化，请求三级分类列表

```ts
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";

const category3List = ref<CategoryList>([]);

watch(category2Id, async (category2Id: number) => {
  category3List.value = await getCategory3ListApi(category2Id);
});
```

3. 数据展示

```html
<el-option
  v-for="c3 in category3List"
  :key="c3.id"
  :label="c3.name"
  :value="c3.id"
/>
```

4. 收集三级分类 id 数据

```html
<el-select placeholder="请选择三级分类" v-model="category3Id"></el-select>
```

```ts
const category3Id = ref();
```

### 6. 使用 pinia 管理三级分类数据

1. 定义 pinia 模块

```ts
// stores/category.ts
import { defineStore } from "pinia";
import type { CategoryState } from "./interface";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";

export const useCategoryStore = defineStore("category", {
  state: (): CategoryState => {
    return {
      category1Id: undefined,
      category2Id: undefined,
      category3Id: undefined,
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  getters: {},
  actions: {
    async getCategory1List() {
      this.category1List = await getCategory1ListApi();
    },
    async getCategory2List() {
      this.category2List = await getCategory2ListApi(
        this.category1Id as number
      );
      this.category2Id = undefined;
      this.category3Id = undefined;
      this.category3List = [];
    },
    async getCategory3List() {
      this.category3List = await getCategory3ListApi(
        this.category2Id as number
      );
      this.category3Id = undefined;
    },
  },
});
```

2. 组件使用

```html
<template>
  <el-card shadow="hover">
    <el-form inline>
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
  import { onMounted, watch } from "vue";
  import { useCategoryStore } from "@/stores/category";

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
</script>

<style scoped>
  :deep(.el-form-item) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
```

## AttrList 静态组件

```html
<template>
  <el-card shadow="hover" class="mt-20">
    <el-button type="primary" :icon="Plus">添加属性</el-button>

    <el-table :data="[{}]" border class="mt-20">
      <el-table-column type="index" align="center" label="序号" width="60" />
      <el-table-column prop="xxx" label="属性名" width="150" />
      <el-table-column label="属性值列表"> xxx </el-table-column>
      <el-table-column label="操作" width="150">
        <el-button type="warning" :icon="Edit" size="small" />
        <el-button type="danger" :icon="Delete" size="small" />
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
  import { Plus, Edit, Delete } from "@element-plus/icons-vue";
</script>

<style scoped></style>
```

## AttrList 数据动态展示

1. 定义接口函数&类型

```ts
export interface GetAttrListParams {
  category1Id: number;
  category2Id: number;
  category3Id: number;
}

export interface AttrValueItem {
  id: number;
  valueName: string;
  attrId: number;
}

export type AttrValueList = AttrValueItem[];

export interface AttrItem {
  id: number;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueList;
}

export type AttrList = AttrItem[];
```

```ts
import request from "@/utils/request";
import type { GetAttrListParams, AttrList } from "./model/attrModel";

enum Api {
  getAttrListUrl = "/admin/product/attrInfoList",
}

/**
 * 获取属性列表
 * @param GetAttrListParams 三个分类id
 * @returns AttrList
 */
export const getAttrListApi = ({
  category1Id,
  category2Id,
  category3Id,
}: GetAttrListParams) => {
  return request.get<any, AttrList>(
    Api.getAttrListUrl + `/${category1Id}/${category2Id}/${category3Id}`
  );
};
```

2. 组件使用

```ts
import { watch, ref } from "vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { getAttrListApi } from "@/api/product/attr";
import type { AttrList } from "@/api/product/model/attrModel";
import { useCategoryStore } from "@/stores/category";
// 选择三级分类时请求属性数据
const attrList = ref<AttrList>([]);

const categoryStore = useCategoryStore();

watch(
  () => categoryStore.category3Id,
  async () => {
    const { category1Id, category2Id, category3Id } = categoryStore;
    if (!category3Id) {
      attrList.value = [];
      return;
    }
    attrList.value = await getAttrListApi({
      category1Id: category1Id as number,
      category2Id: category2Id as number,
      category3Id: category3Id as number,
    });
  }
);
```

3. 数据展示

```html
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
    <el-button type="warning" :icon="Edit" size="small" />
    <el-button type="danger" :icon="Delete" size="small" />
  </el-table-column>
</el-table>
```
