export interface GetAttrListParams {
  category1Id: number;
  category2Id: number;
  category3Id: number;
}

/*
  [
    {
      "id": 37,
      "attrName": "分类",
      "categoryId": 1,
      "categoryLevel": 3,
      "attrValueList": [
        {
          "id": 32,
          "valueName": "Java",
          "attrId": 37
        },
        {
          "id": 34,
          "valueName": "JavaScript",
          "attrId": 37
        },
        {
          "id": 33,
          "valueName": "C#",
          "attrId": 37
        }
      ]
    },
  ]
*/
export interface AttrValueItem {
  id?: number;
  valueName: string;
  attrId?: number;
  isShowEdit?: boolean;
}

export type AttrValueList = AttrValueItem[];

export interface AttrItem {
  id?: number;
  attrName: string;
  categoryId?: number;
  categoryLevel?: number;
  attrValueList: AttrValueList;
}

export type AttrList = AttrItem[];

/*
  添加属性参数类型：
    {
      "attrName": "string",
      "attrValueList": [
        {
          "valueName": "string"
        }
      ],
      "categoryId": 0,
      "categoryLevel": 0,
    }
  更新属性参数类型：
    {
      "attrName": "string",
      "attrValueList": [
        {
          "valueName": "string",
          attrId: 0,
          id: 0
        }
      ],
      "categoryId": 0,
      "categoryLevel": 0,
      id: 0
    }
  组件使用数据类型 
    {
      attrName: '',
      attrValueList: [
        { valueName: '', isShowEdit: boolean }
      ]
    }
*/
