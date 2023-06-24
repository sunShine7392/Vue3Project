/*
  [
    {
      "id": 1,
      "name": "图书、音像、电子书刊"
    },
  ]
*/
export interface CategoryItem {
  id: number;
  name: string;
  level?: number;
  hasChildren?: boolean;
}

export type CategoryList = CategoryItem[];
