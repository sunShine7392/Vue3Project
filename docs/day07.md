# day07

## 添加 SKU

### 1. 搭建平台属性和销售属性结构

```html
<el-row class="attr-row">
  <el-col :xs="24" :md="12" :lg="8" :xl="6">
    <div class="attr-wrap">
      <div class="attr-name">xxx</div>
      <el-select>
        <el-option :label="111" :value="111" />
      </el-select>
    </div>
  </el-col>
</el-row>
```

```css
.attr-row {
  width: 100%;
}
.attr-wrap {
  display: flex;
  margin-bottom: 10px;
}
.attr-name {
  text-align: right;
  flex: 1;
  margin-right: 10px;
}
```

### 2. 搭建表格结构

```html
<el-table :data="[{}]" border>
  <el-table-column type="selection" width="60" />
  <el-table-column label="图片">
    <template v-slot="{ row }">
      <el-image :src="row.imgUrl" class="sku-img" />
    </template>
  </el-table-column>
  <el-table-column label="名称" prop="imgName" />
  <el-table-column label="操作">
    <template v-slot="{ row }">
      <el-button type="primary" size="small">设置默认图片</el-button>
    </template>
  </el-table-column>
</el-table>
```

```css
.sku-img {
  width: 100px;
  height: 100px;
}
```

### 3. 请求平台属性、销售属性、图片列表数据展示

1. 发送请求获取数据

```ts
import { onMounted, ref } from "vue";
import { useSpuStore } from "@/stores/spu";
import { useCategoryStore } from "@/stores/category";
import type {
  AllSpuImageItem,
  AllSpuSaleAttrList,
} from "@/api/product/model/spuModel";
import type { AttrList } from "@/api/product/model/attrModel";
import { getAttrListApi } from "@/api/product/attr";
import { getSpuImageListApi, getSpuSaleAttrListApi } from "@/api/product/spu";

const spuStore = useSpuStore();
const categoryStore = useCategoryStore();

const spuImageList = ref<AllSpuImageItem[]>([]);
const spuSaleAttrList = ref<AllSpuSaleAttrList>([]);
const attrList = ref<AttrList>([]);

onMounted(async () => {
  const id = spuStore.spuItem.id as number;
  spuImageList.value = (await getSpuImageListApi(id)) as AllSpuImageItem[];
});

onMounted(async () => {
  const id = spuStore.spuItem.id as number;
  spuSaleAttrList.value = await getSpuSaleAttrListApi(id);
});

onMounted(async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrList.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
});
```

2. 展示平台属性数据

```html
<el-col
  :xs="24"
  :md="12"
  :lg="8"
  :xl="6"
  v-for="attr in attrList"
  :key="attr.id"
>
  <div class="attr-wrap">
    <div class="attr-name">{{ attr.attrName }}</div>
    <el-select>
      <el-option
        v-for="attrValue in attr.attrValueList"
        :key="attrValue.id"
        :label="attrValue.valueName"
        :value="attrValue.id"
      />
    </el-select>
  </div>
</el-col>
```

3. 展示销售属性数据

```html
<el-col
  :xs="24"
  :md="12"
  :lg="8"
  :xl="6"
  v-for="saleAttr in spuSaleAttrList"
  :key="saleAttr.id"
>
  <div class="attr-wrap">
    <div class="attr-name">{{ saleAttr.saleAttrName }}</div>
    <el-select>
      <el-option
        v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
        :key="saleAttrValue.id"
        :label="saleAttrValue.saleAttrValueName"
        :value="saleAttrValue.id"
      />
    </el-select>
  </div>
</el-col>
```

4. 展示图片列表数据

```html
<el-table :data="spuImageList" border> </el-table>
```

### 4. 表单校验和收集数据

1. 定义数据

```ts
import { onMounted, ref, reactive } from "vue";

// 表单数据和校验规则
const skuFormRef = ref();

const skuFormData = reactive({
  skuName: "",
  price: 0,
  weight: 0,
  skuDesc: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
  skuDefaultImg: "", // 默认图片地址
});

const skuFormRules = reactive({
  skuName: [{ required: true, message: "请输入SKU名称", trigger: "blur" }],
  price: [
    {
      required: true,
      message: "请输入SKU价格",
      trigger: "blur",
    },
  ],
  weight: [
    {
      required: true,
      message: "请输入SKU重量",
      trigger: "blur",
    },
  ],
  skuDesc: [{ required: true, message: "请输入SKU规格描述", trigger: "blur" }],
  skuAttrValueList: [
    {
      required: true,
      type: "array",
      message: "请至少选择一个SKU平台属性",
      // trigger: "change",
    },
  ],
  skuSaleAttrValueList: [
    {
      required: true,
      type: "array",
      message: "请至少选择一个SKU销售属性",
      // trigger: "change",
    },
  ],
  skuImageList: [
    {
      required: true,
      type: "array",
      message: "请至少选择一个SKU图片",
      // trigger: "change",
    },
  ],
});
```

2. 绑定数据

```html
<el-form
  label-width="100px"
  ref="skuFormRef"
  :model="skuFormData"
  :rules="skuFormRules"
>
</el-form>
```

3. 指定校验规则

```html
<el-form-item label="SKU名称" prop="skuName"></el-form-item>

<el-form-item label="价格(元)" prop="price"></el-form-item>

<el-form-item label="重量(千克)" prop="weight"></el-form-item>

<el-form-item label="规格描述" prop="skuDesc"></el-form-item>

<el-form-item label="平台属性" prop="skuAttrValueList"></el-form-item>

<el-form-item label="销售属性" prop="skuSaleAttrValueList"></el-form-item>

<el-form-item label="图片列表" prop="skuImageList"></el-form-item>
```

4. 收集数据

```html
<el-input placeholder="请输入SKU名称" v-model="skuFormData.skuName" />

<el-input-number
  :min="0"
  controls-position="right"
  class="sku-input-number"
  v-model="skuFormData.price"
/>

<el-input-number
  :min="0"
  controls-position="right"
  class="sku-input-number"
  v-model="skuFormData.weight"
/>

<el-input
  placeholder="请输入规格描述"
  type="textarea"
  :rows="3"
  v-model="skuFormData.skuDesc"
/>

<el-select v-model="skuFormData.skuAttrValueList[index]">
  <el-option
    v-for="attrValue in attr.attrValueList"
    :key="attrValue.id"
    :label="attrValue.valueName"
    :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
  />
</el-select>

<el-select v-model="skuFormData.skuSaleAttrValueList[index]">
  <el-option
    v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
    :key="saleAttrValue.id"
    :label="saleAttrValue.saleAttrValueName"
    :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}:`"
  />
</el-select>

<el-table
  :data="spuImageList"
  border
  @selection-change="handleSelectionChange"
></el-table>
```

```ts
// 复选框变化触发的回调
const handleSelectionChange = (val: SkuImageList) => {
  // 收集图片数据
  skuFormData.skuImageList = val;
};
```

### 5. 设置默认图片

1. 两个元素切换显示

```html
<el-tag type="success" v-if="row.isDefault === '1'">默认</el-tag>
<el-button type="primary" size="small" v-else> 设置默认图片 </el-button>
```

2. 绑定事件

```html
<el-button type="primary" size="small" v-else @click="setSkuDefaultImg(row)">
  设置默认图片
</el-button>
```

```ts
// 设置默认图片
const setSkuDefaultImg = (row) => {
  // 排他
  spuImageList.value.forEach((img) => {
    img.isDefault = "0";
  });
  row.isDefault = "1";
  skuFormData.skuDefaultImg = row.imgUrl;
};
```

### 6. 图片的表单校验

```ts
const skuImageListValidator = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error("请至少选择一张图片"));
    return;
  }

  if (!value.some((img) => img.isDefault === "1")) {
    callback(new Error("请选中默认图片"));
    return;
  }

  callback();
};
```

### 7. 完成添加 SKU 功能

1. 定义接口函数和类型

```ts
export interface SkuAttrValueItem {
  attrId: number;
  attrName: string;
  id?: number;
  skuId?: number;
  valueId: number;
  valueName: string;
}

export type SkuAttrValueList = Array<SkuAttrValueItem | string>;

export interface SkuSaleAttrValueItem {
  saleAttrId: number;
  saleAttrName: string;
  saleAttrValueId: number;
  saleAttrValueName: string;
  id?: number;
  skuId?: number;
  spuId?: number;
}

export type SkuSaleAttrValueList = Array<SkuSaleAttrValueItem | string>;

export interface SkuImageItem {
  imgName: string;
  imgUrl: string;
  isDefault: string;
  id: number;
  skuId: number;
  spuImgId: number;
}

export type SkuImageList = SkuImageItem[];

export interface SkuItem {
  skuName: string;
  price: number;
  weight: number;
  skuDesc: string;
  skuAttrValueList: SkuAttrValueList;
  skuSaleAttrValueList: SkuSaleAttrValueList;
  skuImageList: SkuImageList;
  skuDefaultImg: string;
  id?: number;
  category3Id?: number;
  spuId?: number;
  // createTime: string;
  // isSale: 0;
  // tmId: 0;
}
```

```ts
import request from "@/utils/request";
import type { SkuItem } from "./model/skuModel";

enum Api {
  addSkuUrl = "/admin/product/saveSkuInfo",
}

/**
 * 添加SKU
 * @param data SkuItem
 * @returns null
 */
export const addSkuApi = (data: SkuItem) => {
  return request.post<any, null>(Api.addSkuUrl, data);
};
```

2. 组件使用类型

```ts
import type {
  SkuItem,
  SkuImageList,
  SkuImageItem,
} from "@/api/product/model/skuModel";

// 1. 表单项数据定义类型
const skuFormData = reactive<SkuItem>({
  skuName: "",
  price: 0,
  weight: 0,
  skuDesc: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
  skuDefaultImg: "",
});

// 2. 复选框参数类型
const handleSelectionChange = (val: SkuImageList) => {
  skuFormData.skuImageList = val;
};

// 3. 图片类型
const setSkuDefaultImg = (row: SkuImageItem) => {
  spuImageList.value.forEach((img) => {
    img.isDefault = "0";
  });
  row.isDefault = "1";
  skuFormData.skuDefaultImg = row.imgUrl;
};

// 4. 自定义校验函数参数类型
const skuImageListValidator = (
  rule: any,
  value: SkuImageList,
  callback: any
) => {
  if (!value.length) {
    callback(new Error("请至少选择一张图片"));
    return;
  }

  if (!value.some((img) => img.isDefault === "1")) {
    callback(new Error("请选中默认图片"));
    return;
  }

  callback();
};
```

3. 完成添加 SKU

```html
<el-button type="primary" @click="addSku">保存</el-button>
```

```ts
import { addSkuApi } from "@/api/product/sku";
import { ElMessage } from "element-plus";

const addSku = async () => {
  await skuFormRef.value.validate();

  await addSkuApi({
    ...skuFormData,
    skuAttrValueList: skuFormData.skuAttrValueList
      .filter(Boolean)
      .map((attr) => {
        const [attrId, attrName, valueId, valueName] = (attr as string).split(
          ":"
        );
        return {
          attrId: +attrId,
          attrName,
          valueId: +valueId,
          valueName,
        };
      }),
    skuSaleAttrValueList: skuFormData.skuSaleAttrValueList
      .filter(Boolean)
      .map((saleAttr) => {
        const [saleAttrId, saleAttrName, saleAttrValueId, saleAttrValueName] = (
          saleAttr as string
        ).split(":");
        return {
          saleAttrId: +saleAttrId,
          saleAttrName,
          saleAttrValueId: +saleAttrValueId,
          saleAttrValueName,
        };
      }),
    spuId: spuStore.spuItem.id,
    category3Id: categoryStore.category3Id,
  });

  ElMessage.success("添加SKU成功");

  cancel();
};
```

## 分类管理

### 1. 静态组件

```html
<template>
  <el-card shadow="hover">
    <el-table :data="[{}]" border row-key="id">
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
  import { Delete, Edit, Plus } from "@element-plus/icons-vue";
</script>

<style scoped></style>
```

### 2. 获取一级分类列表展示

```ts
import { onMounted, ref } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";

const categoryList = ref([]);

// 请求一级分类数据
onMounted(async () => {
  categoryList.value = await getCategory1ListApi();
});
```

```html
<el-table :data="categoryList" border row-key="id"></el-table>
```

### 3. 点击一级分类，加载二级分类数据

1. 设置数据懒加载

```html
<el-table
  :data="categoryList"
  border
  row-key="id"
  lazy
  :load="load"
  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
></el-table>
```

```ts
// 请求一级分类数据
onMounted(async () => {
  const res = await getCategory1ListApi();
  categoryList.value = res.map((categoryItem) => {
    return {
      ...categoryItem,
      // 声明当前节点拥有子节点
      // 加上这个属性，就能显示>图标，才能加载二级分类数据
      hasChildren: true,
    };
  });
});
// 点击图标>, 触发当前函数
const load = async (row, treeNode, resolve) => {};
```

2. 点击加载二级分类数据

```ts
const load = async (row, treeNode, resolve) => {
  // 请求二级分类数据
  const res = await getCategory2ListApi(row.id);
  // 将这个数据添加到当前数据children中，内容就会作为当前数据的子节点展示
  resolve(
    res.map((categoryItem) => {
      return {
        ...categoryItem,
        hasChildren: true, // 声明当前节点拥有子节点
      };
    })
  );
};
```

3. 此时有一个报错，因为一级分类数据的 id 和二级分类数据 id 重复了，导致渲染报错

解决：让 key 不一样

```html
<el-table
  :data="categoryList"
  border
  :row-key="getRowKey"
  lazy
  :load="load"
  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
></el-table>
```

```ts
onMounted(async () => {
  const res = await getCategory1ListApi();
  categoryList.value = res.map((categoryItem) => {
    return {
      ...categoryItem,
      hasChildren: true,
      level: 1, // 一级分类
    };
  });
});

const load = async (row, treeNode, resolve) => {
  const res = await getCategory2ListApi(row.id);
  resolve(
    res.map((categoryItem) => {
      return {
        ...categoryItem,
        hasChildren: true,
        level: 2, // 二级分类
      };
    })
  );
};

// 设置元素key
const getRowKey = (row) => {
  return row.level + "" + row.id;
};
```

### 4. 点击二级分类，加载三级分类数据

```ts
// 点击图标>, 触发当前函数
const load = async (row, treeNode, resolve) => {
  if (row.level === 1) {
    const res = await getCategory2ListApi(row.id);
    resolve(
      res.map((categoryItem) => {
        return {
          ...categoryItem,
          hasChildren: true,
          level: 2,
        };
      })
    );
  } else if (row.level === 2) {
    const res = await getCategory3ListApi(row.id);
    resolve(
      res.map((categoryItem) => {
        return {
          ...categoryItem,
          // hasChildren: false,
          level: 3,
        };
      })
    );
  }
};
```

### 5. 添加类型

```ts
// api/product/model/categoryModel.ts
export interface CategoryItem {
  id: number;
  name: string;
  level?: number;
  hasChildren?: boolean;
}
```

```ts
import type {
  CategoryList,
  CategoryItem,
} from "@/api/product/model/categoryModel";

const categoryList = ref<CategoryList>([]);

const load = async (
  row: CategoryItem,
  treeNode: unknown,
  resolve: (data: CategoryList) => void
) => {};

const getRowKey = (row: CategoryItem) => {
  return row.level + "" + row.id;
};
```

## 解决打包时类型报错问题

1. 输入 `npm run build` 打包项目

此时会对整个项目进行 eslint 和 ts 检查，查看是否出错。

2. AddSku 组件的表单校验规则类型出错，不要 type: "array"

3. AddOrUpdateSpu 中 Upload 组件绑定 file-list 类型出错

因为 Upload 组件需要的类型是 UploadUserFile，而不是一个联合类型

```ts
// api/product/model/spuModel.ts
export type AllSpuImageList<T = AllSpuImageItem | UploadUserFile> = Array<T>;

export interface AllSpuItem<T = AllSpuImageItem | UploadUserFile> {
  spuName: string;
  description: string;
  tmId: undefined | number;
  category3Id?: number;
  id?: number;
  spuImageList: AllSpuImageList<T>;
  spuSaleAttrList: AllSpuSaleAttrList;
}

// AddOrUpdateSpu组件
const spuFormData = reactive<AllSpuItem<UploadUserFile>>({});
```
