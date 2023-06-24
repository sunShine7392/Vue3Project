# day04

## 属性列表和添加属性切换显示

### 1. 定义添加属性静态组件，因为添加和更新是用的同一个页面

```html
<!-- views/product/attr/components/AddOrUpdateAttr.vue -->
<template>
  <div>
    <div>AddOrUpdateAttr</div>
    <el-button>取消</el-button>
  </div>
</template>

<script lang="ts">
  export default {
    name: "AddOrUpdateAttr",
  };
</script>

<script lang="ts" setup></script>

<style scoped></style>
```

### 2. 默认显示属性列表组件

```ts
import { ref } from "vue";
const isShowAttrList = ref(true);
```

```html
<AttrList v-show="isShowAttrList" />
<!-- 注意子组件必须有根标签才能绑定上指令 -->
<AddOrUpdateAttr v-show="!isShowAttrList" />
```

### 3. 添加属性按钮禁用效果	

1. 分析：

- 三级分类 id 有值，不禁用，希望得到 false

- 三级分类 id 没值，禁用，希望得到 true

2. 实现：

```html
<el-button type="primary" :icon="Plus" :disabled="!categoryStore.category3Id">
  添加属性
</el-button>
```

### 4. 点击添加属性按钮，显示添加属性组件

1. 分析：

- 组件关系：父子组件

  - 子组件 AttrList
  - 父组件 Attr

- 子组件要修改父组件 isShowAttrList 数据：
  - 使用自定义事件

2. 父组件绑定事件给子组件

```html
<AttrList
  v-show="isShowAttrList"
  @setIsShowAttrList="isShowAttrList = $event"
/>
```

3. 子组件声明接受

```ts
const emit = defineEmits(["setIsShowAttrList"]);
```

4. 子组件使用

```html
<el-button
  type="primary"
  :icon="Plus"
  :disabled="!categoryStore.category3Id"
  @click="showAddAttr"
>
  添加属性
</el-button>
```

```ts
const showAddAttr = () => {
  emit("setIsShowAttrList", false);
};
```

### 5. 点击取消按钮，显示属性列表组件

1. 分析：

- 组件关系：父子组件

  - 子组件 AddOrUpdateAttr
  - 父组件 Attr

- 子组件要修改父组件 isShowAttrList 数据：
  - 使用自定义事件

2. 父组件绑定事件给子组件

```html
<AddOrUpdateAttr
  v-show="!isShowAttrList"
  @setIsShowAttrList="isShowAttrList = $event"
/>
```

3. 子组件声明接受

```ts
const emit = defineEmits(["setIsShowAttrList"]);
```

4. 子组件使用

```html
<el-button @click="cancel">取消</el-button>
```

```ts
const cancel = () => {
  emit("setIsShowAttrList", true);
};
```

### 6. CategorySelector 禁用效果

1. 分析：

- isShowAttrList true，不禁用, 希望得到 false
- isShowAttrList false，禁用, 希望得到 true

2. 父组件给 CategorySelector 传递属性

```html
<!-- disabled只有表单项具备这个功能，其他组件要自己实现 -->
<CategorySelector :disabled="!isShowAttrList" />
```

3. 子组件声明接受 props

```ts
defineProps<{
  disabled: boolean;
}>();
```

4. 子组件使用

```html
<el-form inline :disabled="disabled"></el-form>
```

## 添加属性功能

### 1. 静态组件

```html
<template>
  <el-card class="mt-20" shadow="hover">
    <el-form>
      <el-form-item label="属性名">
        <el-input placeholder="请输入属性名" class="attr-input" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Plus"> 添加属性值 </el-button>
        <el-table :data="[{}]" border class="mt-20">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column label="属性值名称"> xxx </el-table-column>
          <el-table-column label="操作">
            <el-button type="danger" :icon="Delete" size="small" />
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-card>
</template>

<script lang="ts">
  export default {
    name: "AddOrUpdateAttr",
  };
</script>

<script lang="ts" setup>
  import { Plus, Delete } from "@element-plus/icons-vue";

  const emit = defineEmits(["setIsShowAttrList"]);

  const cancel = () => {
    emit("setIsShowAttrList", true);
  };
</script>

<style scoped>
  .attr-input {
    width: 250px;
  }
</style>
```

### 2. 收集属性名数据

1. 定义表单数据

```ts
import { reactive } from "vue";

// 表单数据
const attrFormData = reactive({
  // 表单数据名称看接口文档
  attrName: "",
  attrValueList: [],
});
```

2. 收集数据

```html
<el-input
  placeholder="请输入属性名"
  class="attr-input"
  v-model="attrFormData.attrName"
/>
```

### 3. 添加属性值按钮禁用效果

```html
<!-- 
  attrFormData.attrName 有值 不禁用
  attrFormData.attrName 没值 禁用
-->
<el-button type="primary" :icon="Plus" :disabled="!attrFormData.attrName">
  添加属性值
</el-button>
```

### 4. 点击添加属性值按钮，添加一行数据

1. 绑定事件

```html
<el-button
  type="primary"
  :icon="Plus"
  :disabled="!attrFormData.attrName"
  @click="addAttrValue"
>
  添加属性值
</el-button>
```

2. 指定回调

```ts
// 点击添加属性值按钮触发的函数
// 希望：table出现一行数据
const addAttrValue = () => {
  attrFormData.attrValueList.push({});
};
```

3. table 使用 attrValueList 数据渲染

```html
<el-table :data="attrFormData.attrValueList" border class="mt-20"></el-table>
```

### 4. 让 input 获取焦点

1. 给 input 绑定 ref 属性

```html
<el-input size="small" ref="inputRef" />
```

2. 定义 ref 属性获取

```ts
import { reactive, ref } from "vue";
const inputRef = ref();
```

3. 让 input 获取焦点

```ts
const addAttrValue = async () => {
  // 数据更新是同步，页面更新是异步
  attrFormData.attrValueList.push({});
  // 等页面渲染
  await nextTick();
  inputRef.value.focus();
};
```

### 5. 编辑和显示模式的切换

1. table 添加数据时，添加一个标识，来决定渲染哪种模式

```ts
/*
  如果只定义一个标识，会导致每行会同时进行编辑模式或显示模式，这样不行
  所以才需要给每一行绑定一个标识，来决定显示哪种模式
*/
const addAttrValue = async () => {
  // 数据更新是同步，页面更新是异步
  attrFormData.attrValueList.push({
    isShowEdit: true, // 默认渲染编辑模式
  });
  // 等页面渲染
  await nextTick();
  inputRef.value.focus();
};
```

2. 定义两个元素切换显示

- el-input 代表编辑模式
- div 代表显示模式

```html
<template v-slot="{ row }">
  <el-input size="small" ref="inputRef" v-show="row.isShowEdit" />
  <div v-show="!row.isShowEdit">xxx</div>
</template>
```

3. 收集编辑模式输入的数据

```ts
const addAttrValue = async () => {
  attrFormData.attrValueList.push({
    isShowEdit: true,
    valueName: "", // 将来收集数据
  });
  // 等页面渲染
  await nextTick();
  inputRef.value.focus();
};
```

```html
<el-input
  size="small"
  ref="inputRef"
  v-show="row.isShowEdit"
  v-model="row.valueName"
/>
```

4. 编辑模式失去焦点，变成显示模式

```html
<el-input
  size="small"
  ref="inputRef"
  v-show="row.isShowEdit"
  v-model="row.valueName"
  @blur="switchShow(row)"
/>
```

```ts
// 失去焦点，变成显示模式
const switchShow = (row) => {
  row.isShowEdit = false;
};
```

5. 显示默认显示属性值名称

```html
<div v-show="!row.isShowEdit">{{ row.valueName }}</div>
```

6. 显示模式点击进入编辑模式, 同时输入框获取聚焦

```html
<div v-show="!row.isShowEdit" @click="switchEdit(row)">{{ row.valueName }}</div>
```

```ts
// 点击，变成编辑模式
const switchEdit = (row) => {
  row.isShowEdit = true;
  inputRef.value.focus();
};
```

此时遇到问题：只有最后一个 input 能够正常获取焦点，其他 input 不行。

原因: 因为 v-show，隐藏时 input 还在，又因为所有 input 绑定的 ref 标识名称都是 inputRef，导致同名标识发生覆盖，只有最后一个生效。

解决：

- 让每行数据的 ref 标识名称不一样
- 使用 v-if 解决（更简单）

7. 解决 input 只有最后一个能获取焦点问题

```html
<el-input
  size="small"
  ref="inputRef"
  v-if="row.isShowEdit"
  @blur="switchShow(row)"
  v-model="row.valueName"
/>
<div v-else @click="switchEdit(row)">{{ row.valueName }}</div>
```

```ts
// 点击，变成编辑模式
const switchEdit = async (row) => {
  row.isShowEdit = true;
  // 因为v-if，隐藏时input元素被卸载了，所以此时会重新加载（row.isShowEdit = true），必须等渲染完成才能操作
  await nextTick();
  inputRef.value.focus();
};
```

### 6. 删除属性值功能

1. 需求 ： 失去焦点，如果输入内容为空，要删除数据

- 给函数传递$index 参数

```html
<template v-slot="{ row, $index }">
  <el-input
    size="small"
    ref="inputRef"
    v-if="row.isShowEdit"
    @blur="switchShow(row, $index)"
    v-model="row.valueName"
  />
  <div v-else @click="switchEdit(row)">{{ row.valueName }}</div>
</template>
```

- 失去焦点，删除空数据

```ts
// 失去焦点，变成显示模式
const switchShow = (row: AttrValueItem, index: number) => {
  if (!row.valueName) {
    // 删除整行数据
    attrFormData.attrValueList.splice(index, 1);
    return;
  }
  row.isShowEdit = false;
};
```

2. 需求 ： 点击删除按钮，删除整行数据

- 指定提示框组件

```html
<template v-slot="{ row, $index }">
  <el-popconfirm
    :title="`您确认要删除 ${row.valueName} 吗?`"
    @confirm="delAttrValue($index)"
  >
    <template #reference>
      <el-button type="danger" :icon="Delete" size="small" title="删除" />
    </template>
  </el-popconfirm>
</template>
```

- 设定回调函数

```ts
// 删除属性值
const delAttrValue = (index: number) => {
  attrFormData.attrValueList.splice(index, 1);
};
```

### 7. 保存按钮禁用效果

```ts
import { reactive, ref, nextTick, computed } from "vue";

const isBtnDisabled = computed(() => {
  // 属性名有值 并且 属性值列表至少有一个属性值名称
  return !(
    attrFormData.attrName &&
    attrFormData.attrValueList.some((attrValue) => attrValue.valueName)
  );
});
```

```html
<el-button type="primary" :disabled="isBtnDisabled"> 保存 </el-button>
```

### 8. 添加属性功能

1. 定义接口函数

将来添加和更新用的同一个接口

```ts
addOrUpdateAttrUrl = "/admin/product/saveAttrInfo",
/**
 * 添加或更新attr
 * @param data AttrItem
 * @returns null
 */
export const addOrUpdateAttrApi = (data) => {
  return request.post<any, null>(Api.addOrUpdateAttrUrl, data);
};
```

2. 定义接口类型

考虑三个场景：添加属性参数类型、修改属性参数类型、组件使用属性数据类型

总结如下：

```ts
/*
  添加属性参数类型：
    {
      "attrName": "string",
      "attrValueList": [
        {
          "valueName": "string"
        }
      ],
      "categoryId": 0,
      "categoryLevel": 0,
    }
  更新属性参数类型：
    {
      "attrName": "string",
      "attrValueList": [
        {
          "valueName": "string",
          attrId: 0,
          id: 0
        }
      ],
      "categoryId": 0,
      "categoryLevel": 0,
      id: 0
    }
  组件使用数据类型 
    {
      attrName: '',
      attrValueList: [
        { valueName: '', isShowEdit: boolean }
      ]
    }
*/
```

所以将公共部分定义成必选参数，不同部分定义成可选参数

```ts
export interface AttrValueItem {
  id?: number;
  valueName: string;
  attrId?: number;
  isShowEdit?: boolean;
}

export type AttrValueList = AttrValueItem[];

export interface AttrItem {
  id?: number;
  attrName: string;
  categoryId?: number;
  categoryLevel?: number;
  attrValueList: AttrValueList;
}

export type AttrList = AttrItem[];
```

3. 使用接口类型

```ts
import type { GetAttrListParams, AttrList, AttrItem } from "./model/attrModel";
/**
 * 添加或更新attr
 * @param data AttrItem
 * @returns null
 */
export const addOrUpdateAttrApi = (data: AttrItem) => {
  return request.post<any, null>(Api.addOrUpdateAttrUrl, data);
};
```

4. 组件使用

注意：为了得到三级分类 id，需要将 isShowAttrList 改为 true，重新进来才行（之前为了开发方便改为了 false）

- 绑定点击事件

```html
<el-button type="primary" :disabled="isBtnDisabled" @click="addOrUpdateAttr">
  保存
</el-button>
```

```ts
import { addOrUpdateAttrApi } from "@/api/product/attr";
import { useCategoryStore } from "@/stores/category";
import { ElMessage } from "element-plus";

const categoryStore = useCategoryStore();
const addOrUpdateAttr = async () => {
  const { attrName, attrValueList } = attrFormData;
  const { category3Id } = categoryStore;
  await addOrUpdateAttrApi({
    attrName,
    attrValueList,
    categoryLevel: 3,
    categoryId: category3Id,
  });
  ElMessage.success("添加属性成功");
  cancel();
};
```

5. 问题：此时 AttrList 组件并没有获取最新数据展示，并且再次添加属性的话，还会显示之前添加的数据。

- 解决：再次添加属性的话，还会显示之前添加的数据。(使用 v-if)

```html
<AttrList v-if="isShowAttrList" @setIsShowAttrList="isShowAttrList = $event" />

<AddOrUpdateAttr v-else @setIsShowAttrList="isShowAttrList = $event" />
```

- 解决：AttrList 组件并没有获取最新数据展示（立即监视）

```ts
{
  immediate: true,
}
```

6. 问题：组件类型报错

```ts
import type { AttrItem, AttrValueItem } from "@/api/product/model/attrModel";

// 表单数据
const attrFormData = reactive<AttrItem>({
  // 表单数据名称看接口文档
  attrName: "",
  attrValueList: [],
});

// 剩下row的类型为AttrValueItem
```

## 删除属性功能

1. 定义接口函数

```ts
delAttrUrl = "/admin/product/deleteAttr",
/**
 * 删除Attr
 * @param id attrId
 * @returns null
 */
export const delAttrApi = (id: number) => {
  return request.delete<any, null>(Api.delAttrUrl + `/${id}`);
};
```

2. 组件添加 popconfirm

```html
<template v-slot="{ row }">
  <el-button type="warning" :icon="Edit" size="small" />
  <el-popconfirm title="您确认要删除吗？" @confirm="delAttr(row.id)">
    <template #reference>
      <el-button type="danger" :icon="Delete" size="small" title="删除属性" />
    </template>
  </el-popconfirm>
</template>
```

3. 指定回调函数

```ts
import { getAttrListApi, delAttrApi } from "@/api/product/attr";

const delAttr = async (id: number) => {
  await delAttrApi(id);
  ElMessage.success("删除属性成功");
};
```

4. 定义公共请求函数

```ts
const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrList.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
};
```

5. 使用

```ts
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

const delAttr = async (id: number) => {
  await delAttrApi(id);
  ElMessage.success("删除属性成功");
  getAttrList();
};
```
