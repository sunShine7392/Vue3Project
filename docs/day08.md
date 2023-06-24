# day08

## mock 配置

### 1. 场景

当后端程序员接口还未开发完成时，前端可能需要提前 mock 数据测试

### 2. 安装配置 mock

1. 下载

```
npm i vite-easy-mock
```

2. 配置插件

```ts
// vite.config.ts
import viteMock from "vite-easy-mock";

plugins: [
  vue(),
  vueJsx(),
  // 拦截/mock开头的请求，去本地mock文件夹中找对应的资源，找到响应，找不到404
  viteMock({
    dir: "",
    pattern: "/mock",
  }),
],
```

3. 在**项目根目录**新建文件

数据结构要符合 axios 的要求

```json
// mock/home/data.json
{
  "code": 200,
  "message": "",
  "success": true,
  "data": { "test": 111 }
}
```

### 3. 组件使用 mock

1. 定义新的环境变量

```
# .env.development
# 本地mock接口地址
VITE_MOCK_API_URL = '/mock'
```

2. 新建新的请求文件

```ts
// request-mock.ts
const service = axios.create({
  // 修改请求前缀
  baseURL: import.meta.env.VITE_MOCK_API_URL,
  timeout: 20000,
});
```

3. 定义 API 接口

```ts
import requestMock from "@/utils/request-mock";

enum Api {
  getHomeDataUrl = "/home/data",
}

export const getHomeDataApi = () => {
  return requestMock.get<any, any>(Api.getHomeDataUrl);
};
```

4. 组件使用

```ts
import { onMounted } from "vue";
import { getHomeDataApi } from "@/api/mock/home";

onMounted(async () => {
  const res = await getHomeDataApi();
  console.log(res);
});
```
