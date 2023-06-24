<template>
  <el-card shadow="hover" class="mt-20">
    <el-form
      label-width="100px"
      ref="skuFormRef"
      :model="skuFormData"
      :rules="skuFormRules"
    >
      <el-form-item label="SPU名称">
        {{ spuStore.spuItem.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="skuFormData.skuName" />
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          :min="0"
          controls-position="right"
          class="sku-input-number"
          v-model="skuFormData.price"
        />
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          :min="0"
          controls-position="right"
          class="sku-input-number"
          v-model="skuFormData.weight"
        />
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          placeholder="请输入规格描述"
          type="textarea"
          :rows="3"
          v-model="skuFormData.skuDesc"
        />
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <el-row class="attr-row">
          <el-col
            :xs="24"
            :md="12"
            :lg="8"
            :xl="6"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <div class="attr-wrap">
              <div class="attr-name">{{ attr.attrName }}</div>
              <el-select v-model="skuFormData.skuAttrValueList[index]">
                <el-option
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <el-row class="attr-row">
          <el-col
            :xs="24"
            :md="12"
            :lg="8"
            :xl="6"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <div class="attr-wrap">
              <div class="attr-name">{{ saleAttr.saleAttrName }}</div>
              <el-select v-model="skuFormData.skuSaleAttrValueList[index]">
                <el-option
                  v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  :label="saleAttrValue.saleAttrValueName"
                  :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}:`"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          :data="spuImageList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60" />
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <el-image :src="row.imgUrl" class="sku-img" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-tag type="success" v-if="row.isDefault === '1'">默认</el-tag>
              <el-button
                type="primary"
                size="small"
                v-else
                @click="setSkuDefaultImg(row)"
              >
                设置默认图片
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AddSku",
};
</script>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { useSpuStore } from "@/stores/spu";
import { useCategoryStore } from "@/stores/category";
import type {
  AllSpuImageItem,
  AllSpuSaleAttrList,
  SpuImageList,
  UpdateSpuSaleAttrValueList,
} from "@/api/product/model/spuModel";
import type {
  SkuItem,
  SkuImageList,
  SkuImageItem,
} from "@/api/product/model/skuModel";
import type { AttrList } from "@/api/product/model/attrModel";
import { getAttrListApi } from "@/api/product/attr";
import { getSpuImageListApi, getSpuSaleAttrListApi } from "@/api/product/spu";
import { addSkuApi } from "@/api/product/sku";
import { ElMessage } from "element-plus";

const spuStore = useSpuStore();
const categoryStore = useCategoryStore();

const spuImageList = ref<SpuImageList>([]);
const spuSaleAttrList = ref<UpdateSpuSaleAttrValueList>([]);
const attrList = ref<AttrList>([]);

onMounted(async () => {
  const id = spuStore.spuItem.id as number;
  spuImageList.value = await getSpuImageListApi(id);
});

onMounted(async () => {
  const id = spuStore.spuItem.id as number;
  spuSaleAttrList.value = await getSpuSaleAttrListApi(id);
});

onMounted(async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrList.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
});
//定义skuForm数据
const skuFormData = reactive<SkuItem>({
  skuName: "",
  price: 0,
  weight: 0,
  skuDesc: "",
  skuAttrValueList: [
    // {
    // attrId: 0, // 属性名id
    // attrName: "string", // 属性名名称
    // // id: 0, （不要）
    // // skuId: 0,（不要）
    // valueId: 0, // 属性值id
    // valueName: "string", // 属性值名称
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: 0, // 销售属性名id
    //   saleAttrName: "string", // 销售属性名名称
    //   saleAttrValueId: 0, // 销售属性值id
    //   saleAttrValueName: "string", // 销售属性值名称
    //   // id: 0, （不要）
    //   // skuId: 0, （不要）
    //   // spuId: 0, （不要）
    // },
  ],
  skuImageList: [
    // {
    //   id: 0,
    //   imgName: "",
    //   imgUrl: "",
    //   isDefault: "", // 指定是否是默认图片
    // },
  ],
  skuDefaultImg: "", // 默认图片地址
});
// 表单数据和校验规则
const skuFormRef = ref();

const skuImageListValidator = (
  rule: any,
  value: SkuImageList,
  callback: any
) => {
  if (!value.length) {
    callback(new Error("请至少选择一张图片"));
    return;
  }

  if (!value.some((img) => img.isDefault === "1")) {
    callback(new Error("请选中默认图片"));
    return;
  }

  callback();
};

const skuFormRules = reactive({
  skuName: [{ required: true, message: "请输入SKU名称", trigger: "blur" }],
  price: [
    {
      required: true,
      message: "请输入SKU价格",
      trigger: "blur",
    },
  ],
  weight: [
    {
      required: true,
      message: "请输入SKU重量",
      trigger: "blur",
    },
  ],
  skuDesc: [{ required: true, message: "请输入SKU规格描述", trigger: "blur" }],
  skuAttrValueList: [
    {
      required: true,
      // type: "array",
      message: "请至少选择一个SKU平台属性",
      // trigger: "change",
    },
  ],
  skuSaleAttrValueList: [
    {
      required: true,
      // type: "array",
      message: "请至少选择一个SKU销售属性",
      // trigger: "change",
    },
  ],
  skuImageList: [
    {
      required: true,
      validator: skuImageListValidator,
      // type: "array",
      // message: "请至少选择一个SKU图片",
      // trigger: "change",
    },
  ],
});

// 复选框变化触发的回调
const handleSelectionChange = (val: SkuImageList) => {
  skuFormData.skuImageList = val;
};

// 设置默认图片
const setSkuDefaultImg = (row: SkuImageItem) => {
  // 排他
  spuImageList.value.forEach((img) => {
    img.isDefault = "0";
  });
  row.isDefault = "1";
  skuFormData.skuDefaultImg = row.imgUrl;
};
//添加sku
const addSku = async () => {
  await skuFormRef.value.validate();

  await addSkuApi({
    ...skuFormData,
    skuAttrValueList: skuFormData.skuAttrValueList
      .filter(Boolean)
      .map((attr) => {
        const [attrId, attrName, valueId, valueName] = (attr as string).split(
          ":"
        );
        return {
          attrId: +attrId,
          attrName,
          valueId: +valueId,
          valueName,
        };
      }),
    skuSaleAttrValueList: skuFormData.skuSaleAttrValueList
      .filter(Boolean)
      .map((saleAttr) => {
        const [saleAttrId, saleAttrName, saleAttrValueId, saleAttrValueName] = (
          saleAttr as string
        ).split(":");
        return {
          saleAttrId: +saleAttrId,
          saleAttrName,
          saleAttrValueId: +saleAttrValueId,
          saleAttrValueName,
        };
      }),
    spuId: spuStore.spuItem.id,
    category3Id: categoryStore.category3Id,
  });

  ElMessage.success("添加SKU成功");

  cancel();
};

// 取消
const emit = defineEmits(["setIsShow"]);
const cancel = () => {
  emit("setIsShow", 1);
};
</script>

<style scoped>
.sku-input-number {
  width: 100%;
}

:deep(.el-input__inner) {
  text-align: left;
}

.attr-row {
  width: 100%;
}
.attr-wrap {
  display: flex;
  margin-bottom: 10px;
}
.attr-name {
  text-align: right;
  flex: 1;
  margin-right: 10px;
}

.sku-img {
  width: 100px;
  height: 100px;
}
</style>
