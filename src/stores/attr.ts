import { defineStore } from "pinia";
import type { AttrState } from "./interface";

export const useAttrStore = defineStore("attr", {
  state: (): AttrState => {
    return {
      attrItem: {
        // 类型中必选属性必须写
        attrName: "",
        attrValueList: [],
      },
    };
  },
});
