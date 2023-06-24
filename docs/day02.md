# day02

## 分页器

```html
<!-- 
  v-model:current-page 当前页码
  v-model:page-size    每页条数
  :page-sizes          每页条数的选项
  layout    分页器需要加载的组件
  total     总数
  @size-change  当page-size发生变化触发的事件
  @current-change  当current-page发生变化触发的事件
  -->
<el-pagination
  class="mt-20"
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :page-sizes="[3, 6, 9, 12]"
  layout="prev, pager, next, jumper, ->, sizes, total"
  :total="total"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
```

```js
import { ref } from "vue";
/**************** 分页器 *******************/
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(3);
// 总数
const total = ref(0);
// 当 pageSize 发生变化触发的回调
const handleSizeChange = () => {};
// 当 currentPage 发生变化触发的回调
const handleCurrentChange = () => {};
```

## 定义获取品牌分页列表接口函数

1. 查看接口文档，找到对应接口

http://39.98.123.211:8510/swagger-ui.html#!/21697292602550921475/indexUsingGET_2

2. 理解请求参数如何传递

```js
/*
  请求参数类型：
    1. path
      request.get(`/xxx/${xxx}/${yyy}`)
    2. query
      request.get('/xxx', { params: { xxx, yyy } })
      request.post('/xxx', {}, { params: { xxx, yyy } })
    3. body
      request.post('/xxx', { xxx, yyy })
    4. headers
      request.get('/xxx', { headers: { xxx } })
      request.post('/xxx', {}, { headers: { xxx } })
*/
```

3. 定义接口函数

```js
// api/product/trademark.ts
import request from "@/utils/request";

enum Api {
  getTrademarkListUrl = "/admin/product/baseTrademark",
}

/**
 * 获取品牌分页列表
 * @param page 当前页面
 * @param limit 每页条数
 * @returns any
 */
export const getTrademarkListApi = (page: number, limit: number) => {
  // get函数的第二个泛型参数：get函数返回值Promise对象内部的结果值类型
  // 指定第二个泛型参数类型。实际上指定就是函数返回值Promise对象的结果值类型
  return request.get<any, any>(
    Api.getTrademarkListUrl + `/${page}/${limit}`
  );
};
```

4. 定义接口函数返回值类型

- 一定要测试接口，得到返回值，在定义类型

```js
// api/product/model/trademarkModel.ts
export interface TrademarkItem {
  id: number;
  tmName: string;
  logoUrl: string;
}

export type TrademarkList = TrademarkItem[];

export interface GetTrademarkListResponse {
  records: TrademarkList;
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
```

- 接口函数使用类型

```js
import request from "@/utils/request";
import type { GetTrademarkListResponse } from "./model/trademarkModel";

enum Api {
  getTrademarkListUrl = "/admin/product/baseTrademark",
}

/**
 * 获取品牌分页列表
 * @param page 当前页面
 * @param limit 每页条数
 * @returns GetTrademarkListResponse
 */
export const getTrademarkListApi = (page: number, limit: number) => {
  // get函数的第二个泛型参数：get函数返回值Promise对象内部的结果值类型
  // 指定第二个泛型参数类型。实际上指定就是函数返回值Promise对象的结果值类型
  return request.get<any, GetTrademarkListResponse>(
    Api.getTrademarkListUrl + `/${page}/${limit}`
  );
};
```

## 配置代理服务器解决跨域

1. 查看 vite 脚手架文档

https://cn.vitejs.dev/config/server-options.html#server-proxy

2. 配置

```js
// vite.config.ts
server: {
  port: +env.VITE_PORT,//字符串转数字
  open: env.VITE_OPEN === "true",//字符串转布尔
  // 配置代理服务器
  proxy: {
    /*
      /app-dev代表请求前缀（就是request文件中baseURL的值）
        将来请求如果以 /app-dev 开头就会被服务器拦截，并转发到目标服务器去
    */
    "/app-dev": {
      target: "http://gmall-h5-api.atguigu.cn", // 目标服务器地址
      changeOrigin: true, // 允许跨域
      rewrite: (path) => path.replace(/^\/app-dev/, ""), // 路径重写（目标服务器不需要/app-dev这个请求前缀）
    },
  },
},
```

## 品牌列表数据分页展示

### 1. 发送请求，获取数据

```js
import { ref, onMounted } from "vue";
import { getTrademarkListApi } from "@/api/product/trademark";
import type { TrademarkList } from "@/api/product/model/trademarkModel";

// 品牌列表数据
const trademarkList = ref < TrademarkList > [];

onMounted(async () => {
  const res = await getTrademarkListApi(currentPage.value, pageSize.value);
  total.value = res.total;
  trademarkList.value = res.records;
});
```

### 2. 数据展示

```js
import { Picture as IconPicture } from "@element-plus/icons-vue";
```

```html
<el-table :data="trademarkList" border class="mt-20">
  <!-- 
    el-table-column 列组件（决定表格渲染几列）
      label 列的标题
      type="index" 渲染从1开始的序号
      width 列的宽度
      align="center" 居中对齐
      
      如果想要渲染纯文本数据，prop
      如果想要渲染其他结构，插槽
    -->
  <el-table-column label="序号" type="index" width="60" align="center" />
  <el-table-column prop="tmName" label="品牌名称" />
  <el-table-column label="品牌LOGO">
    <!-- 
      el-table-column作用域插槽，传递row，$index参数 
      row 要渲染的整行数据
      $index 数据的下标
    -->
    <template v-slot="{ row }">
      <!-- 
        lazy 图片懒加载
      -->
      <el-image :src="row.logoUrl" fit="fill" lazy class="trademark-logo">
        <!-- 具名插槽：当图片加载失败时显示的内容 -->
        <template #error>
          <div class="image-slot">
            <el-icon><icon-picture /></el-icon>
          </div>
        </template>
      </el-image>
    </template>
  </el-table-column>
  <el-table-column label="操作">
    <el-button type="warning" :icon="Edit" size="small" />
    <el-button type="danger" :icon="Delete" size="small" />
  </el-table-column>
</el-table>
```

### 3. 数据分页展示

1. 封装公共的请求函数

```js
const getTrademarkList = async () => {
  const res = await getTrademarkListApi(currentPage.value, pageSize.value);
  total.value = res.total;
  trademarkList.value = res.records;
};
```

2. 一上来发送请求

```js
onMounted(() => {
  getTrademarkList();
});
```

3. 点击分页器，请求新的数据

```js
// 当 pageSize 发生变化触发的回调
const handleSizeChange = () => {
  getTrademarkList();
};
// 当 currentPage 发生变化触发的回调
const handleCurrentChange = () => {
  getTrademarkList();
};
```

### 4. 简化使用

```js
// onMounted(() => {
//   getTrademarkList();
// });
onMounted(getTrademarkList);

// 当 pageSize 发生变化触发的回调
// const handleSizeChange = () => {
//   getTrademarkList();
// };
// 当 currentPage 发生变化触发的回调
// const handleCurrentChange = () => {
//   getTrademarkList();
// };
```

```html
<el-pagination
  class="mt-20"
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :page-sizes="[3, 6, 9, 12]"
  layout="prev, pager, next, jumper, ->, sizes, total"
  :total="total"
  @size-change="getTrademarkList"
  @current-change="getTrademarkList"
/>
```

### 5. 优化

1. 添加 row-key

`row-key` 用来指定 table 遍历每一行数据的 key 属性

```html
<el-table :data="trademarkList" border class="mt-20" row-key="id"></el-table>
```

2. 添加 loading

```html
<el-table
  :data="trademarkList"
  border
  class="mt-20"
  row-key="id"
  v-loading="loading"
></el-table>
```

```js
const loading = ref(false);

const getTrademarkList = async () => {
  // 请求前loading true
  loading.value = true;
  const res = await getTrademarkListApi(currentPage.value, pageSize.value);
  total.value = res.total;
  trademarkList.value = res.records;
  // 请求完成loading false
  loading.value = false;
};
```

## 添加品牌

### 1. 静态组件

```html
<el-dialog v-model="dialogVisible" title="添加品牌">
  <el-form label-width="100px">
    <el-form-item label="品牌名称">
      <el-input placeholder="请输入品牌名称" class="trademark-input" />
    </el-form-item>
    <el-form-item label="品牌LOGO"> xxx </el-form-item>
  </el-form>

  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">
        确定
      </el-button>
    </span>
  </template>
</el-dialog>
```

```js
const dialogVisible = ref(false);
```

### 2. 点击添加品牌按钮显示对话框

1. 绑定点击事件

```html
<el-button type="primary" :icon="Plus" @click="showAddTrademarkDialog">
  添加品牌
</el-button>
```

2. 回调函数修改标识为 true，从而显示对话框

```js
const showAddTrademarkDialog = () => {
  dialogVisible.value = true;
};
```

### 3. 上传图片功能

```html
<!-- 
action 上传图片的服务器地址
  action="/admin/product/fileUpload" 不行，没有服务器地址
  action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload" 不行，跨域
  action="/app-dev/admin/product/fileUpload" 不行，本地开发可以，上线不行（上线请求前缀变了，变成/app-prod）
  请求前缀需要从 import.meta.env.VITE_API_URL 获取
:show-file-list="false" 是否能上传多张图片（false不能上传多张图片）
:on-success 上传图片成功触发函数
:before-upload 上传图片之前触发函数（限制图片的大小和类型）
-->
<el-upload
  class="avatar-uploader"
  :action="BASE_URL + '/admin/product/fileUpload'"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload"
>
  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  <template #tip>
    <div class="el-upload__tip">只能上传jpg/png文件，且不超过200kb</div>
  </template>
</el-upload>
```

```js
// 在js中使用组件必须引入
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";

// 请求前缀
const BASE_URL = import.meta.env.VITE_API_URL;

// 上传成功的图片地址
const imageUrl = ref("");

// 图片上传之前触发的回调
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
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

// 图片上传成功
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  imageUrl.value = response.data;
};
```

```css
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
```

### 4. 表单校验和收集数据

1. 定义表单数据和校验规则

```js
import { ref, onMounted, reactive } from "vue";

// 用来获取el-form组件实例对象
const trademarkFormRef = ref();

// 表单数据
const trademarkFormData = reactive({
  // 表单参数名称看接口文档
  // 品牌名称
  tmName: "",
  // 品牌LOGO
  logoUrl: "",
});

// 表单校验规则
const trademarkFormRules = reactive({
  // 表单校验规则名称必须和数据名称一致
  tmName: [
    {
      // 必填项
      required: true,
      // 校验失败。提示错误信息
      message: "请输入品牌名称",
      // 触发表单校验的时机：失去焦点
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "品牌名称必须为2-10位",
      trigger: "blur",
    },
  ],
  logoUrl: [
    {
      // 必填项
      required: true,
      // 校验失败。提示错误信息
      message: "请上传图片LOGO",
    },
  ],
});
```

2. 给 el-form 组件绑定以上属性

```html
<el-form
  label-width="100px"
  ref="trademarkFormRef"
  :model="trademarkFormData"
  :rules="trademarkFormRules"
></el-form>
```

3. 给 el-form-item 指定具体校验规则

```html
<el-form-item label="品牌名称" prop="tmName"></el-form-item>

<el-form-item label="品牌LOGO" prop="logoUrl"></el-form-item>
```

4. 收集表单数据

- 收集 tmName 数据

```html
<el-input
  placeholder="请输入品牌名称"
  class="trademark-input"
  v-model="trademarkFormData.tmName"
/>
```

- 收集 logoUrl 数据

```js
// 上传成功的图片地址
// const imageUrl = ref("");

// 图片上传成功
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  // 更新数据
  trademarkFormData.logoUrl = response.data;
};
```

```html
<img
  v-if="trademarkFormData.logoUrl"
  :src="trademarkFormData.logoUrl"
  class="avatar"
/>
```

此时初步的表单校验功能已经完成

5. 点击确定按钮，触发整个表单校验

> 需要给 el-form 绑定 ref 属性

- 绑定事件

```html
<el-button type="primary" @click="addTrademark"> 确定 </el-button>
```

- 设置回调

```js
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
};
```

此时遇到问题，图片如果上传成功的话，校验失败的信息还在，没有删除

6. 解决上传图片校验失败的信息显示问题

```js
// 图片上传成功
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  // 更新数据
  trademarkFormData.logoUrl = response.data;
  // 清空表单校验失败的信息
  // trademarkFormRef.value.clearValidate(); // 清空所有表单项的校验信息
  trademarkFormRef.value.clearValidate(["logoUrl"]); // 清空logoUrl表单项的校验信息
};
```

### 5. 完成添加品牌

1. 定义接口函数

```ts
addTrademarkUrl = "/admin/product/baseTrademark/save",

/**
 * 添加品牌
 * @param tmName 品牌名称
 * @param logoUrl 品牌logo
 * @returns null
 */
export const addTrademarkApi = (tmName: string, logoUrl: string) => {
  return request.post<any, null>(Api.addTrademarkUrl, { tmName, logoUrl });
};
```

2. 组件使用

```js
import { getTrademarkListApi, addTrademarkApi } from "@/api/product/trademark";

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
  const { tmName, logoUrl } = trademarkFormData;
  await addTrademarkApi(tmName, logoUrl);
  ElMessage.success("添加品牌成功");
  dialogVisible.value = false;
  // 再次发送请求，获取最新数据展示
  getTrademarkList();
};
```
