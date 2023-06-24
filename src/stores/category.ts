import { defineStore } from "pinia";
import type { CategoryState } from "./interface";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";

export const useCategoryStore = defineStore("category", {
  state: (): CategoryState => {
    return {
      category1Id: undefined,
      category2Id: undefined,
      category3Id: undefined,
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  getters: {},
  actions: {
    async getCategory1List() {
      this.category1List = await getCategory1ListApi();
    },
    async getCategory2List() {
      this.category2List = await getCategory2ListApi(
        this.category1Id as number
      );
      this.category2Id = undefined;
      this.category3Id = undefined;
      this.category3List = [];
    },
    async getCategory3List() {
      this.category3List = await getCategory3ListApi(
        this.category2Id as number
      );
      this.category3Id = undefined;
    },
  },
});
