export interface SkuAttrValueItem {
  attrId: number;
  attrName: string;
  id?: number;
  skuId?: number;
  valueId: number;
  valueName: string;
}

export type SkuAttrValueList = Array<SkuAttrValueItem | string>;

export interface SkuSaleAttrValueItem {
  saleAttrId: number;
  saleAttrName: string;
  saleAttrValueId: number;
  saleAttrValueName: string;
  id?: number;
  skuId?: number;
  spuId?: number;
}

export type SkuSaleAttrValueList = Array<SkuSaleAttrValueItem | string>;

export interface SkuImageItem {
  imgName: string;
  imgUrl: string;
  isDefault: string;
  id: number;
  skuId: number;
  spuImgId: number;
}

export type SkuImageList = SkuImageItem[];

export interface SkuItem {
  skuName: string;
  price: number;
  weight: number;
  skuDesc: string;
  skuAttrValueList: SkuAttrValueList;
  skuSaleAttrValueList: SkuSaleAttrValueList;
  skuImageList: SkuImageList;
  skuDefaultImg: string;
  id?: number;
  category3Id?: number;
  spuId?: number;
  // createTime: string;
  // isSale: 0;
  // tmId: 0;
}
