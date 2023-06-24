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
