import type { CategoryList } from "./categoryModel";
import type { UploadUserFile } from "element-plus";

export interface GetSpuListParams {
  page: number;
  limit: number;
  category3Id: number;
}

/*
  {
    "records": [
      {
        "id": 4603,
        "spuName": "223",
        "description": "4322",
        "category3Id": 1,
        "tmId": 18226,
        "spuSaleAttrList": null,
        "spuImageList": null
      }
    ],
    "total": 2,
    "size": 1,
    "current": 1,
    "searchCount": true,
    "pages": 2
  }
*/

export interface GetSpuListResponse {
  records: SpuList;
  total: number;
  // size: number;
  // current: number;
  // searchCount: boolean;
  // pages: number;
}

/*
  [
    {
      "id": 1,
      "name": "颜色"
    },
  ]
*/
export type BaseSaleAttrList = CategoryList;

/*
  添加SPU参数类型
    {
      "category3Id": 0,
      "description": "string",
      "spuImageList": [
        {
          "imgName": "string",
          "imgUrl": "string",
        }
      ],
      "spuName": "string",
      "spuSaleAttrList": [
        {
          "baseSaleAttrId": 0,
          "saleAttrName": "string",
          "spuSaleAttrValueList": [
            {
              "baseSaleAttrId": 0,
              "saleAttrValueName": "string",
            }
          ]
        }
      ],
      "tmId": 0
    }
  修改SPU参数类型
    {
      "category3Id": 0,
      "description": "string",
      "id": 0,
      "spuImageList": [
        {
          "id": 0,
          "imgName": "string",
          "imgUrl": "string",
          "spuId": 0
        }
      ],
      "spuName": "string",
      "spuSaleAttrList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "saleAttrName": "string",
          "spuId": 0,
          "spuSaleAttrValueList": [
            {
              "baseSaleAttrId": 0,
              "id": 0,
              "isChecked": "string",
              "saleAttrName": "string",
              "saleAttrValueName": "string",
              "spuId": 0
            }
          ]
        }
      ],
      "tmId": 0
    }
  组件使用SPU数据类型
    {
      spuName: "",
      tmId: undefined,
      description: "",
      spuImageList: UploadUserFile[],
      spuSaleAttrList: [
        // {
        //   "baseSaleAttrId": 0, // 基础销售属性id
        //   "id": 0, // 添加不要id（不要）
        //   "saleAttrName": "string", // 基础销售属性name
        //   "spuId": 0, // 整个spu的id，添加由服务器生成（不要）
             "isShowEdit": boolean,
        //   "spuSaleAttrValueList": [
        //     {
        //       "baseSaleAttrId": 0,
        //       "id": 0,
        //       "isChecked": "string",
        //       "saleAttrName": "string",
        //       "saleAttrValueName": "string",
        //       "spuId": 0
        //     }
        //   ]
        // }
      ],
    }
  SpuList组件展示Spu类型
    {
      id: number;
      spuName: string; // spu名称
      description: string; // spu描述
      category3Id: number; // 三级分类id
      tmId: number; // 品牌id
      spuSaleAttrList: null;
      spuImageList: null;
    }
*/
// 公共类型
interface CommonSpu {
  spuName: string; // spu名称
  description: string; // spu描述
  tmId: number; // 品牌id
}

// SpuList组件展示Spu类型
export interface SpuItem extends CommonSpu {
  id: number;
  category3Id: number; // 三级分类id
  // 不需要使用的数据可以不定义
  // spuSaleAttrList: null;
  // spuImageList: null;
}

export type SpuList = SpuItem[];

/*  
  添加Spu参数 
     baseSaleAttrId: number;
     saleAttrName: "string"; 
     spuSaleAttrValueList: [];
  修改Spu参数 
    baseSaleAttrId: number;
    saleAttrName: "string"; 
    spuSaleAttrValueList: [];
    "id": number
    "spuId": 0
  组件使用
    baseSaleAttrId: number;
    saleAttrName: "string"; 
    spuSaleAttrValueList: [];
    "isShowEdit": boolean,
*/
export interface SpuSaleAttrValueItem {
  baseSaleAttrId: number;
  // id: 0;
  // spuId: 0;
  // isChecked: "string";
  // saleAttrName: "string";
  saleAttrValueName: string;
}

export type SpuSaleAttrValueList = SpuSaleAttrValueItem[];

// 公共 & 添加
export interface CommonSpuSaleAttrItem {
  baseSaleAttrId: number; // 基础销售属性id
  saleAttrName: string; // 基础销售属性name
  spuSaleAttrValueList: SpuSaleAttrValueList;
}
// 修改
export interface UpdateSpuSaleAttrItem extends CommonSpuSaleAttrItem {
  id: number;
  spuId: number;
}
// 组件
export interface SpuSaleAttrItem extends CommonSpuSaleAttrItem {
  isShowEdit: boolean;
}

// 添加
export type AddSpuSaleAttrValueList = CommonSpuSaleAttrItem[];

// 修改
export type UpdateSpuSaleAttrValueList = UpdateSpuSaleAttrItem[];

// 组件
export type SpuSaleAttrList = SpuSaleAttrItem[];

// 图片类型
export interface SpuImageItem {
  imgName: string;
  imgUrl: string;
}
export type SpuImageList = SpuImageItem[];

// 添加
export interface AddSpuParams extends CommonSpu {
  category3Id: number;
  spuImageList: SpuImageList;
  spuSaleAttrList: AddSpuSaleAttrValueList;
}

// 修改
export interface UpdateSpuParams extends CommonSpu {
  category3Id: number;
  spuImageList: SpuImageList;
  spuSaleAttrList: UpdateSpuSaleAttrValueList;
  id: number;
}

// 组件
export interface SpuFormData extends Omit<CommonSpu, "tmId"> {
  // spuName: "",
  tmId: undefined | number;
  // description: "",
  spuImageList: UploadUserFile[];
  spuSaleAttrList: SpuSaleAttrList;
}

// 简化后版本
// 公共定义必选属性，独有的定义可选属性
export interface AllSpuSaleAttrValueItem {
  baseSaleAttrId: number;
  id?: 0;
  saleAttrValueName: string;
  spuId?: 0;
}

export type AllSpuSaleAttrValueList = AllSpuSaleAttrValueItem[];

export interface AllSpuSaleAttrItem {
  baseSaleAttrId: number;
  saleAttrName: string;
  id?: 0;
  spuId?: 0;
  isShowEdit?: boolean;
  spuSaleAttrValueList: AllSpuSaleAttrValueList;
}

export type AllSpuSaleAttrList = AllSpuSaleAttrItem[];

export interface AllSpuImageItem {
  imgName: string;
  imgUrl: string;
  isDefault?: string;
}

// export type AllSpuImageList = Array<AllSpuImageItem | UploadUserFile>;
export type AllSpuImageList<T = AllSpuImageItem | UploadUserFile> = Array<T>;

export interface AllSpuItem<T = AllSpuImageItem | UploadUserFile> {
  spuName: string;
  description: string;
  tmId: undefined | number;
  category3Id?: number;
  id?: number;
  spuImageList: AllSpuImageList<T>;
  spuSaleAttrList: AllSpuSaleAttrList;
}
