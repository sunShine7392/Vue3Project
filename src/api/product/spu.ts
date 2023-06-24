import request from "@/utils/request";
import type {
  GetSpuListParams,
  GetSpuListResponse,
  BaseSaleAttrList,
  AllSpuItem,
  AllSpuSaleAttrList,
  AllSpuImageList,
  SpuImageList,
  UpdateSpuSaleAttrValueList,
} from "./model/spuModel";

enum Api {
  getSpuListUrl = "/admin/product",
  getBaseSaleAttrListUrl = "/admin/product/baseSaleAttrList",
  addSpuUrl = "/admin/product/saveSpuInfo",
  updateSpuUrl = "/admin/product/updateSpuInfo",
  getSpuImageListUrl = "/admin/product/spuImageList",
  getSpuSaleAttrListUrl = "/admin/product/spuSaleAttrList",
}

/**
 * 获取SPU列表
 * @param GetSpuListParams
 * @returns GetSpuListResponse
 */
export const getSpuListApi = ({
  page,
  limit,
  category3Id,
}: GetSpuListParams) => {
  return request.get<any, GetSpuListResponse>(
    Api.getSpuListUrl + `/${page}/${limit}`,
    {
      params: {
        category3Id,
      },
    }
  );
};

/**
 * 获取基础销售属性列表
 * @returns BaseSaleAttrList
 */
export const getBaseSaleAttrListApi = () => {
  return request.get<any, BaseSaleAttrList>(Api.getBaseSaleAttrListUrl);
};

/**
 * 添加SPU
 * @param data AllSpuItem
 * @returns null
 */
export const addSpuApi = (data: AllSpuItem) => {
  return request.post<any, null>(Api.addSpuUrl, data);
};

/**
 * 更新SPU
 * @param data AllSpuItem
 * @returns null
 */
export const updateSpuApi = (data: AllSpuItem) => {
  return request.post<any, null>(Api.updateSpuUrl, data);
};

/**
 * 获取图片列表
 * @param id spuid
 * @returns AllSpuImageList
 */
export const getSpuImageListApi = (id: number) => {
  return request.get<any, SpuImageList>(Api.getSpuImageListUrl + `/${id}`);
};

/**
 * 获取销售属性列表
 * @param id spuid
 * @returns AllSpuSaleAttrList
 */
export const getSpuSaleAttrListApi = (id: number) => {
  return request.get<any, UpdateSpuSaleAttrValueList>(
    Api.getSpuSaleAttrListUrl + `/${id}`
  );
};
