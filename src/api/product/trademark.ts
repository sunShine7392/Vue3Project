import request from "@/utils/request";
import type {
  GetTrademarkListResponse,
  TrademarkItem,
  TrademarkList,
} from "./model/trademarkModel";

enum Api {
  getTrademarkListUrl = "/admin/product/baseTrademark",
  getAllTrademarkListUrl = "/admin/product/baseTrademark/getTrademarkList",
  addTrademarkUrl = "/admin/product/baseTrademark/save",
  updateTrademarkUrl = "/admin/product/baseTrademark/update",
  delTrademarkUrl = "/admin/product/baseTrademark/remove",
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

/**
 * 获取所有品牌列表数据
 * @returns TrademarkList
 */
export const getAllTrademarkListApi = () => {
  return request.get<any, TrademarkList>(Api.getAllTrademarkListUrl);
};

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

/**
 * 添加品牌
 * @param tmName 品牌名称
 * @param logoUrl 品牌logo
 * @returns null
 */
export const addTrademarkApi = (tmName: string, logoUrl: string) => {
  return request.post<any, null>(Api.addTrademarkUrl, { tmName, logoUrl });
};

/**
 * 更新品牌
 * @param tm TrademarkItem
 * @returns null
 */
export const updateTrademarkApi = (tm: TrademarkItem) => {
  return request.put<any, null>(Api.updateTrademarkUrl, tm);
};

/**
 * 删除品牌
 * @param id 品牌id
 * @returns null
 */
export const delTrademarkApi = (id: number) => {
  return request.delete<any, null>(Api.delTrademarkUrl + `/${id}`);
};
