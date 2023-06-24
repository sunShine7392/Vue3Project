# day01

## git

1. 远程仓库保持只读，不要直接修改（会导致冲突）
2. 要进行远程仓库操作，首先先进行本地仓库版本控制

### 本地仓库操作

#### 1. 本地仓库版本控制

0. `git init` 初始化本地 git 仓库
1. `git add .` 将工作区代码提交到暂存区保管
2. `git commit -m 提交信息` 将暂存区代码提交到版本区（本地仓库）保管
3. `git status` 查看文件状态

- 红色：位于工作区
- 绿色：位于暂存区
- 剩下的位于版本区

#### 2. 本地仓库分支操作

1. `git checkout -b 分支名称` 新建并切换分支
2. `git branch` 查看所有分支
3. `git checkout 分支名称` 切换分支
4. `git merge 分支名称` 合并分支（在当前分支合并其他分支代码）

### 本地仓库与远程仓库交互

#### 1. 本地仓库和远程仓库都没有

1. 新建远程仓库

2. 在项目代码中初始化本地仓库

- `git init` (只需要做一次)

3. 将本地仓库代码提交版本区

- `git add .`
- `git commit -m xxx`

4. 将本地仓库代码提供到远程仓库保管

- `git remote add origin 远程仓库地址` (只需要做一次)
- `git push -u origin master`

5. 新建开发分支，将开发分支提交远程仓库保管

- `git checkout -b xxx`
- `git push origin xxx`

6. 未来：修改好代码（完成代码功能），将代码推送到远程仓库保管

- 先进行本地仓库版本控制
  - `git add .`
  - `git commit -m xxx`
- 再将代码推送远程仓库保管
  - `git push origin xxx`

#### 2. 远程仓库创建好了，拉取到本地进行开发

1. 将远程仓库代码克隆下来

- `git clone 仓库地址`

问题：克隆下来的仓库代码，只有 master 分支

2. 拉取远程仓库自己的开发分支代码，进行开发

- 进入仓库内 `cd xxx`
- `git fetch origin 远程仓库分支名称:本地仓库分支名称` 拉取远程 xxx 分支到本地仓库来
- `git checkout 分支名称` 切换到 xxx 分支

### 特殊操作

1. 场景 1：拉取老师代码，情不自禁改动了老师代码，导致拉取最新代码报错，拉不下来

- `git reset --hard HEAD^` 版本回退到上一个版本（自动撤销修改的内容）
- `git pull origin xxx` 拉取远程 xxx 分支最新代码到本地来

2. 场景 2：想要查看老师之前的功能代码

- 去 gitee 老师仓库上找 commit 提交日志，找到对应的 commit id
- 来到老师代码仓库，进行版本回退
  - `git reset --hard 某个commitid`
- 此时就能看到指定功能代码了

3. 场景 3：想要重新写一遍代码

- `git checkout -b 新的分支名称` 新建一个新的分支
- `git reset --hard 某个commitid` 版本回退到某个节点
- 进行开发 ing
- 开发完成，回到之前的开发分支继续开发后续功能
  - `git checkout xxx`
  - `git checkout -d 新的分支名称` 删除新创建的分支

## 熟悉项目文件情况

```
|-node_modules 依赖包
|-public  包含会被自动打包到项目根路径的文件夹
	|-favicon.ico  页面标题图标
	|-static/logo.png 应用Logo图片
|-src
	|-assets  组件中需要使用的公用资源
		|-404_images  404页面的图片
		|-bg.jpg	    登陆背景图片
	|-components  公共非路由组件
		|-Breadcrumb 面包屑组件(头部水平方向的层级组件)
		|-Hamburger  用来点击切换左侧菜单导航的图标组件
		|-SvgIcon    svg图标组件
	|-hooks	自定义hook模块
		|-useResize.ts  处理应用在不同屏幕下的适应问题
	|-layout 管理界面整体布局(一级路由)
		|-components  组成整体布局的一些子组件
		|-index.vue  后台管理的整体界面布局组件
	|-router
		|-index.ts  路由器
		|-routes.ts	路由表
	|-stores
		|-interface/index.ts state数据接口
		|-app.js  管理应用相关数据
		|-settings.js  管理设置相关数据
		|-userInfo.js  管理后台登陆用户相关数据
		|-index.js  pinia的store
	|-styles
		|-xxx.scss  项目组件需要使用的一些样式(使用scss)
	|-utils  一些工具函数
		|-get-page-title.js  得到要显示的网页title
		|-token-utils.js  操作登陆用户的token cookie
		|-request.js axios 二次封装的模块
		|-validate.js  检验相关工具函数
	|-views  路由组件文件夹
		|-error/404.vue 404页面
		|-home  首页
		|-login  登陆
	|-App.vue  应用根组件
	|-main.ts  入口js
	|-permission.ts  使用全局守卫实现路由权限控制的模块
	|-settings.ts  包含应用设置信息的模块
|-.env 通用的环境配置
|-.env.development  指定了开发环境的代理服务器前缀路径
|-.env.production  指定了生产环境的代理服务器前缀路径
|-.eslintrc.cjs  eslint的检查配置
|-.gitignore  git的忽略配置
|-env.d.ts  全局类型声明文件
|-index.html 唯一的页面
|-package-lock.json  当前项目依赖的第三方包的精确信息
|-package.json  当前项目包信息
|-README.md	git仓库的md文档
|-shims.d.ts	全局类型声明文件
|-tsconfig.config.json  TS的配置文件
|-tsconfig.json	TS的配置文件
|-vite.config.ts  vite相关配置(如: 代理服务器等)
```

挑战文件更加复杂的项目：https://gitee.com/xxpromise/class210624-admin

## 项目接口文档

项目接口文档：

1. 商品管理接口文档：http://39.98.123.211:8510/swagger-ui.html
2. 权限管理接口文档：http://39.98.123.211:8170/swagger-ui.html

服务器地址：http://gmall-h5-api.atguigu.cn

## 配置商品管理的路由

1. 创建静态组件

- views/product/category/index.vue
- views/product/attr/index.vue
- views/product/trademark/index.vue
- views/product/spu/index.vue
- views/product/sku/index.vue

2. 配置路由

配置路由，会自动生成左侧菜单

```ts
// router/route.ts
{
  path: "/product",
  component: () => import("@/layout/index.vue"),
  redirect: "/product/category/list",
  meta: {
    title: "商品管理",
    icon: "ele-ShoppingBag",
  },
  children: [
    {
      // 地址不以 / 开头，会自动补全父路由地址
      path: "category/list",
      name: "Category",
      component: () => import("@/views/product/category/index.vue"),
      // 1. 决定左侧菜单显示什么内容 2. 决定网站的title
      meta: {
        title: "分类管理",
      },
    },
    {
      // 地址以 / 开头，就是这个地址
      path: "/product/trademark/list",
      name: "Trademark",
      component: () => import("@/views/product/trademark/index.vue"),
      meta: {
        title: "品牌管理",
      },
    },
    {
      path: "attr/list",
      name: "Attr",
      component: () => import("@/views/product/attr/index.vue"),
      meta: {
        title: "属性管理",
      },
    },
    {
      path: "spu/list",
      name: "Spu",
      component: () => import("@/views/product/spu/index.vue"),
      meta: {
        title: "SPU管理",
      },
    },
    {
      path: "sku/list",
      name: "Sku",
      component: () => import("@/views/product/sku/index.vue"),
      meta: {
        title: "SKU管理",
      },
    },
  ],
},
```

## 品牌管理的静态组件

```vue
<template>
  <!-- 
    shadow="hover" 设置卡片阴影出现的时机
   -->
  <el-card shadow="hover">
    <el-button type="primary" :icon="Plus">添加品牌</el-button>

    <!-- 
      data 要渲染的数据
      border 带边框
     -->
    <el-table :data="tableData" border class="trademark-table">
      <!-- 
        el-table-column 列组件（决定表格渲染几列）
          label 列的标题
          type="index" 渲染从1开始的序号
          width 列的宽度
          align="center" 居中对齐
       -->
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column prop="name" label="品牌名称" />
      <!-- 没有传递插槽，prop来决定渲染的内容 -->
      <el-table-column prop="address" label="品牌LOGO" />
      <el-table-column label="操作">
        <!-- 传递插槽，插槽就是要渲染的内容 -->
        <el-button type="warning" :icon="Edit" size="small" />
        <el-button type="danger" :icon="Delete" size="small" />
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "XTrademark",
};
</script>

<script lang="ts" setup>
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>

<style scoped>
.trademark-table {
  margin-top: 20px;
}
</style>
```
