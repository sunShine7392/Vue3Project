<template>
  <el-card class="mt-20" shadow="hover">
    <el-form
      label-width="100px"
      ref="spuFormRef"
      :model="spuFormData"
      :rules="spuFormRules"
    >
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spuFormData.spuName" />
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select v-model="spuFormData.tmId">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          placeholder="请输入SPU描述"
          type="textarea"
          :rows="3"
          v-model="spuFormData.description"
        />
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
        <!-- 
           v-model:file-list="fileList" 双向数据绑定：上传图片成功数据会自动更新
           list-type="picture-card" 卡片效果
           :on-preview 预览图片
           on-remove 删除
         -->
        <el-upload
          accept="image/*"
          v-model:file-list="spuFormData.spuImageList"
          :action="BASE_URL + '/admin/product/upload'"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeAvatarUpload"
          :limit="10"
          :on-exceed="handleUploadExceed"
          :on-success="handleUploadSuccess"
        >
          <el-icon><Plus /></el-icon>
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过250kb</div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible" width="30%">
          <el-image :src="dialogImageUrl" class="spu-img" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select class="mr-10" v-model="selectedSaleAttr">
          <el-option
            v-for="baseSaleAttr in filterBaseSaleAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!selectedSaleAttr"
          @click="addSaleAttr"
        >
          添加销售属性
        </el-button>
        <el-table :data="spuFormData.spuSaleAttrList" border class="mt-20">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column label="属性名" prop="saleAttrName" width="200" />
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <el-tag
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="index"
                closable
                type="success"
                class="mr-10"
                @close="delSpuSaleAttrValue(row, index)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                size="small"
                v-if="row.isShowEdit"
                class="spu-input"
                ref="inputRef"
                v-model="saleAttrValueName"
                @blur="switchShow(row)"
              />
              <el-button
                :icon="Plus"
                size="small"
                v-else
                @click="switchEdit(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="{ $index }">
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                @click="delSpuSaleAttr($index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AddOrUpdateSpu",
};
</script>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed, nextTick } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import {
  getBaseSaleAttrListApi,
  addSpuApi,
  updateSpuApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
} from "@/api/product/spu";
import type {
  BaseSaleAttrList,
  // SpuFormData,
  // SpuSaleAttrList,
  // SpuSaleAttrItem,
  AllSpuItem,
  AllSpuSaleAttrList,
  AllSpuSaleAttrItem,
  AllSpuImageItem,
} from "@/api/product/model/spuModel";
import { getAllTrademarkListApi } from "@/api/product/trademark";
import type { TrademarkList } from "@/api/product/model/trademarkModel";
import { ElMessage } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { beforeAvatarUpload } from "@/utils/tools";
import { useCategoryStore } from "@/stores/category";
import { useSpuStore } from "@/stores/spu";

// 基础销售属性列表
const baseSaleAttrList = ref<BaseSaleAttrList>([]);
// 品牌列表
const trademarkList = ref<TrademarkList>([]);

onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
});

onMounted(async () => {
  trademarkList.value = await getAllTrademarkListApi();
});

onMounted(async () => {
  const id = spuStore.spuItem.id;
  if (!id) return;
  // 服务器存储的图片数据：imgName/imgUrl
  // upload组件需要图片数据：name/url
  const spuImageList = await getSpuImageListApi(id);

  spuFormData.spuImageList = spuImageList.map((item) => {
    const img = item as AllSpuImageItem;
    return {
      name: img.imgName,
      url: img.imgUrl,
      response: {
        data: img.imgUrl,
      },
    };
  });
});

onMounted(async () => {
  const id = spuStore.spuItem.id;
  if (!id) return;
  spuFormData.spuSaleAttrList = await getSpuSaleAttrListApi(id);
});

// 上传图片
// const fileList = ref([]);

const BASE_URL = import.meta.env.VITE_API_URL;

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url as string;
  dialogVisible.value = true;
};

const handleUploadExceed = () => {
  ElMessage.error("最多只能上传10张");
};
// 上传成功，清空表单校验结果
const handleUploadSuccess = () => {
  spuFormRef.value.clearValidate(["spuImageList"]);
};

// 表单校验和收集数据
const spuFormRef = ref();

const spuStore = useSpuStore();

const spuFormData = reactive<AllSpuItem<UploadUserFile>>({
  spuName: spuStore.spuItem.spuName,
  tmId: spuStore.spuItem.tmId,
  description: spuStore.spuItem.description,
  spuImageList: [
    // {
    //   "id": 0,
    //   "imgName": "string",
    //   "imgUrl": "string",
    //   "spuId": 0
    // }
  ],
  spuSaleAttrList: [
    // {
    //   "baseSaleAttrId": 0, // 基础销售属性id
    //   "id": 0, // 添加不要id（不要）
    //   "saleAttrName": "string", // 基础销售属性name
    //   "spuId": 0, // 整个spu的id，添加由服务器生成（不要）
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
});

// 自定义校验函数
const spuSaleAttrListValidator = (
  rule: any,
  value: AllSpuSaleAttrList,
  callback: any
) => {
  /*
    rule 规则信息对象
    value 校验数据的值
    callback 是一个函数，必须要调用
      callback(); 校验通过
      callback(new Error('错误信息')); 校验失败
  */
  // 至少添加一个销售属性
  if (!value.length) {
    callback(new Error("请至少添加一个销售属性"));
    return;
  }
  // 每个销售属性至少添加一个属性值
  if (value.some((spuSaleAttr) => !spuSaleAttr.spuSaleAttrValueList.length)) {
    callback(new Error("每个销售属性至少添加一个属性值"));
    return;
  }
  // 一定要调用，校验通过
  callback();
};

const spuFormRules = reactive({
  spuName: [{ required: true, message: "请输入SPU名称", trigger: "blur" }],
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
  spuImageList: [{ required: true, message: "请上传SPU图片" }],
  spuSaleAttrList: [
    {
      required: true,
      // message: "请添加SPU销售属性",
      validator: spuSaleAttrListValidator,
    },
  ],
});

const categoryStore = useCategoryStore();

// 添加或修改SPU
const addOrUpdateSpu = async () => {
  try {
    await spuFormRef.value.validate();

    const id = spuStore.spuItem.id;

    const { spuName, tmId, description, spuImageList, spuSaleAttrList } =
      spuFormData;

    const data = {
      category3Id: categoryStore.category3Id,
      spuName,
      tmId,
      description,
      // 通过Upload组件收集到图片数据：name\url\response
      // 发送请求给服务器图片数据：imgName/imgUrl
      spuImageList: spuImageList.map((item) => {
        const img = item as UploadUserFile;
        return {
          imgName: img.name,
          /*
            场景一：添加SPU
              Upload组件收集到图片数据：name\url\response
              发送请求给服务器图片数据：imgName/imgUrl
              修改数据
            场景二：点击更新SPU进来，获取数据展示
              发送请求给服务器图片数据：imgName/imgUrl
              Upload组件收集到图片数据：name\url\response
              修改了
          */
          imgUrl: (img.response as { data: string }).data,
        };
      }),
      spuSaleAttrList,
    };

    if (id) {
      await updateSpuApi({
        ...data,
        id,
      });
    } else {
      await addSpuApi(data);
    }

    ElMessage({
      type: "success",
      message: `${id ? "更新" : "添加"}SPU成功`,
    });

    cancel();
  } catch (e) {
    // 啥也不用写
    console.log(e);
  }
};

// 销售属性功能
const selectedSaleAttr = ref("");

// 添加销售属性
const addSaleAttr = () => {
  const [id, name] = selectedSaleAttr.value.split(":");

  spuFormData.spuSaleAttrList.push({
    baseSaleAttrId: +id, // 基础销售属性id
    saleAttrName: name, // 基础销售属性name
    spuSaleAttrValueList: [],
    isShowEdit: false,
  });

  // 清空选中的数据
  selectedSaleAttr.value = "";
};

/*
  对基础销售属性列表baseSaleAttrList进行过滤，判断单个销售属性在不在表格中（spuFormData.spuSaleAttrList）
    在，过滤
    不再，保留
*/
const filterBaseSaleAttrList = computed(() => {
  // 对基础销售属性列表baseSaleAttrList进行过滤
  return baseSaleAttrList.value.filter((baseSaleAttr) => {
    // 判断单个销售属性在不在表格中（spuFormData.spuSaleAttrList）
    // 找到了返回值true，希望过滤，返回false
    return !spuFormData.spuSaleAttrList.some(
      (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === baseSaleAttr.id
    );
  });
});

// 删除销售属性
const delSpuSaleAttr = (index: number) => {
  spuFormData.spuSaleAttrList.splice(index, 1);
};

const inputRef = ref();

// 切换到编辑模式
const switchEdit = async (row: AllSpuSaleAttrItem) => {
  row.isShowEdit = true;
  await nextTick();
  inputRef.value.focus();
};

// 输入的销售属性值名称
const saleAttrValueName = ref("");

// 切换到显示模式
const switchShow = (row: AllSpuSaleAttrItem) => {
  row.isShowEdit = false;
  // 值为空，不添加
  if (!saleAttrValueName.value) return;
  // 添加销售属性值
  row.spuSaleAttrValueList.push({
    baseSaleAttrId: row.baseSaleAttrId, // 基础销售属性id
    // id: 0, // 不要
    // isChecked: "string", // 不要
    // saleAttrName: "string", // 销售属性名称，不要
    saleAttrValueName: saleAttrValueName.value, // 销售属性值名称
    // spuId: 0, // 不要
  });
  // 将输入的属性值清空
  saleAttrValueName.value = "";
};

// 删除销售属性值
const delSpuSaleAttrValue = (row: AllSpuSaleAttrItem, index: number) => {
  row.spuSaleAttrValueList.splice(index, 1);
};

const emit = defineEmits(["setIsShow"]);

const cancel = () => {
  emit("setIsShow", 1);
};
</script>

<style scoped>
.spu-img {
  width: 100%;
}

.spu-input {
  width: 150px;
}
</style>
