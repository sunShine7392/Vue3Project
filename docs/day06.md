# day06

## 销售属性

### 1. 收集基础销售属性数据

1. 定义数据

```ts
const selectedSaleAttr = ref("");
```

2. 收集数据

```html
<el-select class="mr-10" v-model="selectedSaleAttr"></el-select>
```

3. 因为将来添加销售属性需要 id 和 name，所以收集的数据需要进行处理

```html
<el-option
  v-for="baseSaleAttr in baseSaleAttrList"
  :key="baseSaleAttr.id"
  :label="baseSaleAttr.name"
  :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
/>
```

### 2. 添加销售属性按钮禁用效果

```html
<el-button type="primary" :icon="Plus" :disabled="!selectedSaleAttr">
  添加销售属性
</el-button>
```

### 3. 添加销售属性

1. 绑定点击事件

```html
<el-button
  type="primary"
  :icon="Plus"
  :disabled="!selectedSaleAttr"
  @click="addSaleAttr"
>
  添加销售属性
</el-button>
```

2. 添加一条数据

```ts
// 添加销售属性
const addSaleAttr = () => {
  const [id, name] = selectedSaleAttr.value.split(":");

  // 数据要符合接口的数据要求
  spuFormData.spuSaleAttrList.push({
    baseSaleAttrId: +id, // 基础销售属性id
    saleAttrName: name, // 基础销售属性name
    spuSaleAttrValueList: [],
  });

  // 清空选中的数据
  selectedSaleAttr.value = "";
};
```

此时还有问题，添加的数据还在基础销售属性列表中展示。

3. 定义计算属性，过滤多余的属性

```ts
import { computed } from "vue";
/*
  对基础销售属性列表baseSaleAttrList进行过滤，判断单个销售属性在不在表格中（spuFormData.spuSaleAttrList）
    在，过滤
    不再，保留
*/
const filterBaseSaleAttrList = computed(() => {
  // 对基础销售属性列表baseSaleAttrList进行过滤
  return baseSaleAttrList.value.filter((baseSaleAttr) => {
    // 判断单个销售属性在不在表格中（spuFormData.spuSaleAttrList）
    // 找到了返回值true，希望过滤，返回false
    return !spuFormData.spuSaleAttrList.some(
      (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === baseSaleAttr.id
    );
  });
});
```

4. 使用计算属性

```html
<el-option
  v-for="baseSaleAttr in filterBaseSaleAttrList"
  :key="baseSaleAttr.id"
  :label="baseSaleAttr.name"
  :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
/>
```

5. 展示销售属性名称

```html
<el-table-column label="属性名" prop="saleAttrName" width="200" />
```

### 4. 删除销售属性

1. 绑定点击事件

```html
<el-button
  type="danger"
  :icon="Delete"
  size="small"
  @click="delSpuSaleAttr($index)"
/>
```

2. 删除属性

```ts
// 删除销售属性
const delSpuSaleAttr = (index: number) => {
  spuFormData.spuSaleAttrList.splice(index, 1);
};
```

### 5. 添加销售属性值

1. 分析：

- 显示模式 el-button
- 编辑模式 el-input

默认显示显示模式

2. 定义两个元素，切换显示

```html
<template v-slot="{ row }">
  <el-input size="small" v-if="row.isShowEdit" />
  <el-button :icon="Plus" size="small" v-else />
</template>
```

3. 默认显示显示模式

```ts
// 添加销售属性
const addSaleAttr = () => {
  const [id, name] = selectedSaleAttr.value.split(":");

  spuFormData.spuSaleAttrList.push({
    baseSaleAttrId: +id, // 基础销售属性id
    saleAttrName: name, // 基础销售属性name
    spuSaleAttrValueList: [],
    isShowEdit: false, // 默认显示显示模式
  });

  // 清空选中的数据
  selectedSaleAttr.value = "";
};
```

4. 点击按钮，进入编辑模式

```html
<el-button :icon="Plus" size="small" v-else @click="switchEdit(row)" />
```

```ts
// 切换到编辑模式
const switchEdit = async (row) => {
  row.isShowEdit = true;
};
```

5. 让编辑模式输入框聚焦

```html
<el-input size="small" v-if="row.isShowEdit" class="spu-input" ref="inputRef" />
```

```ts
import { nextTick } from "vue";

const inputRef = ref();

// 切换到编辑模式
const switchEdit = async (row) => {
  row.isShowEdit = true;
  await nextTick();
  inputRef.value.focus();
};
```

6. 收集输入框数据

```html
<el-input
  size="small"
  v-if="row.isShowEdit"
  class="spu-input"
  ref="inputRef"
  v-model="saleAttrValueName"
/>
```

```ts
const saleAttrValueName = ref("");
```

7. 输入框失去焦点变成显示模式, 同时添加数据

```html
<el-input
  size="small"
  v-if="row.isShowEdit"
  class="spu-input"
  ref="inputRef"下·下·
  v-model="saleAttrValueName"
  @blur="switchShow(row)"
/>
```

```ts
// 切换到显示模式
const switchShow = (row) => {
  row.isShowEdit = false;
  // 值为空，不添加
  if (!saleAttrValueName.value) return;
  // 添加销售属性值
  row.spuSaleAttrValueList.push({
    baseSaleAttrId: row.baseSaleAttrId, // 基础销售属性id
    saleAttrValueName: saleAttrValueName.value, // 销售属性值名称
  });
  // 将输入的属性值清空
  saleAttrValueName.value = "";
};
```

8. 遍历展示属性值列表数据

```html
<el-tag
  v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
  :key="index"
  closable
  type="success"
  class="mr-10"
>
  {{ saleAttrValue.saleAttrValueName }}
</el-tag>
```

### 6. 删除销售属性值

1. 绑定事件

```html
<el-tag
  v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
  :key="index"
  closable
  type="success"
  class="mr-10"
  @close="delSpuSaleAttrValue(row, index)"
>
  {{ saleAttrValue.saleAttrValueName }}
</el-tag>
```

2. 指定回调

```ts
// 删除销售属性值
const delSpuSaleAttrValue = (row, index) => {
  row.spuSaleAttrValueList.splice(index, 1);
};
```

### 7. 表单校验

原有的表单校验功能不能满足要求，需要使用自定义校验规则

```ts
// 自定义校验函数
const spuSaleAttrListValidator = (rule, value, callback) => {
  /*
    rule 规则信息对象
    value 校验数据的值
    callback 是一个函数，必须要调用
      callback(); 校验通过
      callback(new Error('错误信息')); 校验失败
  */
      // 至少添加一个销售属性
  if (!value.length) {
    callback(new Error("请至少添加一个销售属性"));
    return;
  }
  // 每个销售属性至少添加一个属性值
  if (value.some((spuSaleAttr) => !spuSaleAttr.spuSaleAttrValueList.length)) {
    callback(new Error("每个销售属性至少添加一个属性值"));
    return;
  }
  // 一定要调用，校验通过
  callback();
};

const spuFormRules = reactive({
  spuName: [{ required: true, message: "请输入SPU名称", trigger: "blur" }],
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
  spuImageList: [{ required: true, message: "请上传SPU图片" }],
  spuSaleAttrList: [
    {
      required: true,
      // message: "请添加SPU销售属性",
      validator: spuSaleAttrListValidator,
    },
  ],
});
```

## 添加 SPU

### 1. 定义接口

```ts
addSpuUrl = "/admin/product/saveSpuInfo",

export const addSpuApi = (data) => {
  return request.post<any, null>(Api.addSpuUrl, data);
};
```

### 2. 定义类型(复杂版)

1. 首先分析有几种情况，分别需要什么类型

- 添加 SPU 参数类型

```ts
// 类型如下：
{
  "category3Id": 0,
  "description": "string",
  "spuImageList": [
    {
      "imgName": "string",
      "imgUrl": "string",
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "saleAttrName": "string",
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "saleAttrValueName": "string",
        }
      ]
    }
  ],
  "tmId": 0
}
```

- 修改 SPU 参数类型

```ts
// 类型如下：
{
  "category3Id": 0,
  "description": "string",
  "id": 0,
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": 0
}
```

- 组件使用 SPU 表单数据类型

```ts
// 类型如下：
{
  "description": "string",
  "spuImageList": UploadUserFile[],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "saleAttrName": "string",
      "isShowEdit": "boolean",
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "saleAttrValueName": "string",
        }
      ]
    }
  ],
  "tmId": undefined | number
}
```

- 组件使用 SPU 表格数据类型

```ts
// 类型如下：
{
  "description": "string",
  "spuName": "string",
  "tmId": 0,
  "id": "number",
  "spuSaleAttrList": null,
  "spuImageList": null,
}
```

```ts
import type { CategoryList } from "./categoryModel";
import type { UploadUserFile } from "element-plus";

export interface GetSpuListParams {
  page: number;
  limit: number;
  category3Id: number;
}

export interface GetSpuListResponse {
  records: SpuList;
  total: number;
}

export type BaseSaleAttrList = CategoryList;

// 公共类型
interface CommonSpu {
  spuName: string; // spu名称
  description: string; // spu描述
  tmId: number; // 品牌id
}

// SpuList组件展示Spu类型
export interface SpuItem extends CommonSpu {
  id: number;
  category3Id: number; // 三级分类id
  // 不需要使用的数据可以不定义
  // spuSaleAttrList: null;
  // spuImageList: null;
}

export type SpuList = SpuItem[];

export interface SpuSaleAttrValueItem {
  baseSaleAttrId: number;
  // id: 0;
  // spuId: 0;
  // isChecked: "string";
  // saleAttrName: "string";
  saleAttrValueName: string;
}

export type SpuSaleAttrValueList = SpuSaleAttrValueItem[];

// 公共 & 添加
export interface CommonSpuSaleAttrItem {
  baseSaleAttrId: number; // 基础销售属性id
  saleAttrName: string; // 基础销售属性name
  spuSaleAttrValueList: SpuSaleAttrValueList;
}
// 修改
export interface UpdateSpuSaleAttrItem extends CommonSpuSaleAttrItem {
  id: number;
  spuId: number;
}
// 组件
export interface SpuSaleAttrItem extends CommonSpuSaleAttrItem {
  isShowEdit: boolean;
}

// 添加
export type AddSpuSaleAttrValueList = CommonSpuSaleAttrItem[];

// 修改
export type UpdateSpuSaleAttrValueList = UpdateSpuSaleAttrItem[];

// 组件
export type SpuSaleAttrList = SpuSaleAttrItem[];

// 图片类型
export interface SpuImageItem {
  imgName: string;
  imgUrl: string;
}
export type SpuImageList = SpuImageItem[];

// 添加
export interface AddSpuParams extends CommonSpu {
  category3Id: number;
  spuImageList: SpuImageList;
  spuSaleAttrList: AddSpuSaleAttrValueList;
}

// 修改
export interface UpdateSpuParams extends CommonSpu {
  category3Id: number;
  spuImageList: SpuImageList;
  spuSaleAttrList: UpdateSpuSaleAttrValueList;
  id: number;
}

// 组件
export interface SpuFormData extends Omit<CommonSpu, "tmId"> {
  // spuName: "",
  tmId: undefined | number;
  // description: "",
  spuImageList: UploadUserFile[];
  spuSaleAttrList: SpuSaleAttrList;
}
```

### 3. 定义类型(简化版)

公共定义必选属性，独有的定义可选属性

```ts
export interface AllSpuSaleAttrValueItem {
  baseSaleAttrId: number;
  id?: 0;
  saleAttrValueName: string;
  spuId?: 0;
}

export type AllSpuSaleAttrValueList = AllSpuSaleAttrValueItem[];

export interface AllSpuSaleAttrItem {
  baseSaleAttrId: number;
  saleAttrName: string;
  id?: 0;
  spuId?: 0;
  isShowEdit?: boolean;
  spuSaleAttrValueList: AllSpuSaleAttrValueList;
}

export type AllSpuSaleAttrList = AllSpuSaleAttrItem[];

export interface AllSpuImageItem {
  imgName: string;
  imgUrl: string;
}

export type AllSpuImageList = Array<AllSpuImageItem | UploadUserFile>;

export interface AllSpuItem {
  spuName: string;
  description: string;
  tmId: undefined | number;
  category3Id?: number;
  id?: number;
  spuImageList: AllSpuImageList;
  spuSaleAttrList: AllSpuSaleAttrList;
}
```

### 4. 使用类型

1. 添加 SPU 接口参数类型

```ts
import type {
  GetSpuListParams,
  GetSpuListResponse,
  BaseSaleAttrList,
  AllSpuItem,
} from "./model/spuModel";

/**
 * 添加SPU
 * @param data AllSpuItem
 * @returns null
 */
export const addSpuApi = (data: AllSpuItem) => {
  return request.post<any, null>(Api.addSpuUrl, data);
};
```

2. 组件定义 spuFormData 数据类型

```ts
import type {
  BaseSaleAttrList,
  AllSpuItem,
} from "@/api/product/model/spuModel";

const spuFormData = reactive<AllSpuItem>({
  spuName: "",
  tmId: undefined,
  description: "",
  spuImageList: [],
  spuSaleAttrList: [],
});
```

3. 所有组件报错的位置，对应的解决类型错误

- 自定义校验函数参数类型：`rule: any, value: AllSpuSaleAttrList, callback: any`
- `row: AllSpuSaleAttrItem`

### 5. 完成添加 SPU

```ts
import { getBaseSaleAttrListApi, addSpuApi } from "@/api/product/spu";
import type {
  BaseSaleAttrList,
  AllSpuItem,
  AllSpuSaleAttrList,
  AllSpuSaleAttrItem,
  AllSpuImageItem,
} from "@/api/product/model/spuModel";
import { useSpuStore } from "@/stores/spu";

const spuStore = useSpuStore();

const addOrUpdateSpu = async () => {
  try {
    await spuFormRef.value.validate();

    const { spuName, tmId, description, spuImageList, spuSaleAttrList } =
      spuFormData;

    await addSpuApi({
      category3Id: categoryStore.category3Id,
      spuName,
      tmId,
      description,
      // 通过Upload组件收集到图片数据：name\url\response
      // 发送请求给服务器图片数据：imgName/imgUrl
      spuImageList: spuImageList.map((item) => {
        const img = item as UploadUserFile;
        return {
          imgName: img.name,
          imgUrl: (img.response as { data: string }).data,
        };
      }),
      spuSaleAttrList,
    });

    ElMessage({
      type: "success",
      message: "添加SPU成功",
    });

    cancel();
  } catch (e) {
    // 啥也不用写
    console.log(e);
  }
};
```

注意：SpuList 组件需要使用立即监视，才能获取到最新数据

## 更新 SPU

### 1. 定义 pinia 模块

```ts
import { defineStore } from "pinia";
import type { SpuState } from "./interface";

export const useSpuStore = defineStore("spu", {
  state: (): SpuState => {
    return {
      spuItem: {
        id: undefined,
        spuName: "",
        tmId: undefined,
        description: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
    };
  },
});
```

### 2. 点击修改按钮传递数据

```html
<el-button
  type="warning"
  :icon="Edit"
  size="small"
  title="修改SPU"
  @click="showUpdateSpu(row)"
/>
```

```ts
import type { SpuList, AllSpuItem } from "@/api/product/model/spuModel";
import { useSpuStore } from "@/stores/spu";

const spuStore = useSpuStore();

const showUpdateSpu = (row: AllSpuItem) => {
  spuStore.spuItem = row;
  emit("setIsShowSpuList", false);
};
```

### 3. 点击添加按钮重置数据

```ts
const showAddSpu = () => {
  spuStore.$reset();
  emit("setIsShowSpuList", false);
};
```

### 4. 更新 SPU 组件基本数据展示

```ts
import { useSpuStore } from "@/stores/spu";

const spuStore = useSpuStore();

const spuFormData = reactive<AllSpuItem>({
  spuName: spuStore.spuItem.spuName,
  tmId: spuStore.spuItem.tmId,
  description: spuStore.spuItem.description,
  spuImageList: [],
  spuSaleAttrList: [],
});
```

问题：图片和销售属性数据没有

解决：需要额外发送请求获取

### 5. 请求图片和销售属性数据

1. 定义接口函数

```ts
import type {
  GetSpuListParams,
  GetSpuListResponse,
  BaseSaleAttrList,
  AllSpuItem,
  AllSpuSaleAttrList,
  AllSpuImageList,
} from "./model/spuModel";

getSpuImageListUrl = "/admin/product/spuImageList",
getSpuSaleAttrListUrl = "/admin/product/spuSaleAttrList",

  /**
 * 获取图片列表
 * @param id spuid
 * @returns AllSpuImageList
 */
export const getSpuImageListApi = (id: number) => {
  return request.get<any, AllSpuImageList>(Api.getSpuImageListUrl + `/${id}`);
};

/**
 * 获取销售属性列表
 * @param id spuid
 * @returns AllSpuSaleAttrList
 */
export const getSpuSaleAttrListApi = (id: number) => {
  return request.get<any, AllSpuSaleAttrList>(
    Api.getSpuSaleAttrListUrl + `/${id}`
  );
};
```

2. 组件发送请求，更新数据

```ts
import {
  getBaseSaleAttrListApi,
  addSpuApi,
  updateSpuApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
} from "@/api/product/spu";

onMounted(async () => {
  const id = spuStore.spuItem.id;
  if (!id) return;
  // 服务器存储的图片数据：imgName/imgUrl
  // upload组件需要图片数据：name/url
  const spuImageList = await getSpuImageListApi(id);

  spuFormData.spuImageList = spuImageList.map((item) => {
    const img = item as AllSpuImageItem;
    return {
      name: img.imgName,
      url: img.imgUrl,
      response: {
        // 为了发送请求能找到图片地址
        data: img.imgUrl,
      },
    };
  });
});

onMounted(async () => {
  const id = spuStore.spuItem.id;
  if (!id) return;
  spuFormData.spuSaleAttrList = await getSpuSaleAttrListApi(id);
});
```

### 6. 完成修改 SPU

```ts
// 添加或修改SPU
const addOrUpdateSpu = async () => {
  try {
    await spuFormRef.value.validate();

    const id = spuStore.spuItem.id;

    const { spuName, tmId, description, spuImageList, spuSaleAttrList } =
      spuFormData;

    const data = {
      category3Id: categoryStore.category3Id,
      spuName,
      tmId,
      description,
      // 通过Upload组件收集到图片数据：name\url\response
      // 发送请求给服务器图片数据：imgName/imgUrl
      spuImageList: spuImageList.map((item) => {
        const img = item as UploadUserFile;
        return {
          imgName: img.name,
          /*
            场景一：添加SPU
              Upload组件收集到图片数据：name\url\response
              发送请求给服务器图片数据：imgName/imgUrl
              修改数据
            场景二：点击更新SPU进来，获取数据展示
              发送请求给服务器图片数据：imgName/imgUrl
              Upload组件收集到图片数据：name\url\response
              修改了
          */
          imgUrl: (img.response as { data: string }).data,
        };
      }),
      spuSaleAttrList,
    };

    if (id) {
      await updateSpuApi({
        ...data,
        id,
      });
    } else {
      await addSpuApi(data);
    }

    ElMessage({
      type: "success",
      message: `${id ? "更新" : "添加"}SPU成功`,
    });

    cancel();
  } catch (e) {
    // 啥也不用写
    console.log(e);
  }
};
```

## 三个组件切换显示

### 1. 定义 AddSku 基础组件

```vue
<template>
  <div>AddSku</div>
</template>

<script lang="ts">
export default {
  name: "AddSku",
};
</script>

<script lang="ts" setup></script>

<style scoped></style>
```

### 2. 修改标识和事件名称

```ts
/*
  1 SpuList
  2 AddOrUpdateSpu
  3 AddSku
*/
const isShow = ref(3);

const setIsShow = (newVal: number) => {
  isShow.value = newVal;
};
```

```html
<SpuList v-if="isShow === 1" @setIsShow="setIsShow" />

<AddOrUpdateSpu v-else-if="isShow === 2" @setIsShow="setIsShow" />

<AddSku v-else @setIsShow="setIsShow" />
```

所有组件内部都需要按照要求更改名称和更新的值

### 3. 添加 SKU 静态组件

1. 点击添加 SKU 按钮显示组件

```html
<el-button
  type="primary"
  :icon="Plus"
  size="small"
  title="添加SKU"
  @click="showAddSku(row)"
/>
```

```ts
const showAddSku = (row: AllSpuItem) => {
  spuStore.spuItem = row;
  emit("setIsShow", 3);
};
```

2. 搭建组件

```vue
<template>
  <el-card shadow="hover" class="mt-20">
    <el-form label-width="100px">
      <el-form-item label="SPU名称"> xxx </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          :min="0"
          controls-position="right"
          class="sku-input-number"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          :min="0"
          controls-position="right"
          class="sku-input-number"
        />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input placeholder="请输入规格描述" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-select>
          <el-option label="111" value="111" />
        </el-select>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select>
          <el-option label="111" value="111" />
        </el-select>
      </el-form-item>
      <el-form-item label="图片列表"> </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AddSku",
};
</script>

<script lang="ts" setup>
// 取消
const emit = defineEmits(["setIsShow"]);
const cancel = () => {
  emit("setIsShow", 1);
};
</script>

<style scoped>
.sku-input-number {
  width: 100%;
}

:deep(.el-input__inner) {
  text-align: left;
}
</style>
```
