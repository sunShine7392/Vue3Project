import request from "@/utils/request";
import type { GetAttrListParams, AttrList, AttrItem } from "./model/attrModel";

enum Api {
  getAttrListUrl = "/admin/product/attrInfoList",
  addOrUpdateAttrUrl = "/admin/product/saveAttrInfo",
  delAttrUrl = "/admin/product/deleteAttr",
}

/**
 * 获取属性列表
 * @param GetAttrListParams 三个分类id
 * @returns AttrList
 */
export const getAttrListApi = ({
  category1Id,
  category2Id,
  category3Id,
}: GetAttrListParams) => {
  return request.get<any, AttrList>(
    Api.getAttrListUrl + `/${category1Id}/${category2Id}/${category3Id}`
  );
};

/**
 * 添加或更新attr
 * @param data AttrItem
 * @returns null
 */
export const addOrUpdateAttrApi = (data: AttrItem) => {
  return request.post<any, null>(Api.addOrUpdateAttrUrl, data);
};

/**
 * 删除Attr
 * @param id attrId
 * @returns null
 */
export const delAttrApi = (id: number) => {
  return request.delete<any, null>(Api.delAttrUrl + `/${id}`);
};
