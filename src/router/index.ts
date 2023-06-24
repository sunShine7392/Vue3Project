import { createRouter, createWebHistory } from "vue-router";
import { staticRoutes } from "@/router/routes";

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  // 滚动行为：当路由组件切换时滚动条的位置
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

// 导出路由
export default router;
