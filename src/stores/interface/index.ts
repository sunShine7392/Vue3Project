import type { RouteRecordRaw } from "vue-router";
import type { CategoryList } from "@/api/product/model/categoryModel";
import type { AttrItem } from "@/api/product/model/attrModel";
import type { AllSpuItem } from "@/api/product/model/spuModel";

// 用户信息包括权限数据
export interface UserInfoState {
  token: string;
  avatar: string;
  name: string;

  menuRoutes: RouteRecordRaw[]; // 用于生成导航菜单的路由列表
}

// 三级分类数据
export interface CategoryState {
  category1Id: undefined | number;
  category2Id: undefined | number;
  category3Id: undefined | number;
  category1List: CategoryList;
  category2List: CategoryList;
  category3List: CategoryList;
}

// 三级分类数据
export interface AttrState {
  attrItem: AttrItem;
}

export interface SpuState {
  spuItem: AllSpuItem;
}
