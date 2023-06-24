import type { RouteRecordRaw } from "vue-router";
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true,
    },
  },

  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      hidden: true,
    },
  },

  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        // 1. 决定左侧菜单显示什么内容 2. 决定网站的title
        meta: {
          title: "首页",
          icon: "ele-HomeFilled",
        },
      },
    ],
  },

  // 配置路由，会自动生成左侧菜单（sidebar）
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

  /* 匹配任意的路由 必须最后注册 */
  {
    path: "/:pathMatch(.*)",
    name: "Any",
    redirect: "/404",
    meta: {
      hidden: true,
    },
  },
];

/**
 * 定义动态路由
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [];
