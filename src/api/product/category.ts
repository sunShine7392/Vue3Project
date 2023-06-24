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
