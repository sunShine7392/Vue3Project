import { defineStore } from "pinia";
import type { SpuState } from "./interface";

export const useSpuStore = defineStore("spu", {
  state: (): SpuState => {
    return {
      spuItem: {
        id: undefined,
        spuName: "",
        tmId: undefined,
        description: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
    };
  },
});
