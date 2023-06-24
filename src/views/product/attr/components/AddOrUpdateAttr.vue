<template>
  <el-card class="mt-20" shadow="hover">
    <el-form>
      <el-form-item label="属性名">
        <el-input
          placeholder="请输入属性名"
          class="attr-input"
          v-model="attrFormData.attrName"
        />
      </el-form-item>
      <el-form-item>
        <!-- 
          attrFormData.attrName 有值 不禁用
          attrFormData.attrName 没值 禁用
         -->
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!attrFormData.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-table :data="attrFormData.attrValueList" border class="mt-20">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column label="属性值名称">
            <!-- 
              显示和编辑模式的切换
                文本div - 显示模式
                input   - 编辑模式
             -->
            <template v-slot="{ row, $index }">
              <el-input
                size="small"
                ref="inputRef"
                v-if="row.isShowEdit"
                @blur="switchShow(row, $index)"
                v-model="row.valueName"
              />
              <div v-else @click="switchEdit(row)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`您确认要删除 ${row.valueName} 吗?`"
                @confirm="delAttrValue($index)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    :icon="Delete"
                    size="small"
                    title="删除"
                  />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-form-item>
      <!-- 
        属性名有值 并且 属性值列表至少有一个属性值名称
       -->
      <el-button
        type="primary"
        :disabled="isBtnDisabled"
        @click="addOrUpdateAttr"
      >
        保存
      </el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AddOrUpdateAttr",
};
</script>

<script lang="ts" setup>
import { reactive, ref, nextTick, computed } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { addOrUpdateAttrApi } from "@/api/product/attr";
import { useCategoryStore } from "@/stores/category";
import type { AttrItem, AttrValueItem } from "@/api/product/model/attrModel";
import { ElMessage } from "element-plus";
import { useAttrStore } from "@/stores/attr";

const attrStore = useAttrStore();

// 表单数据
const attrFormData = reactive<AttrItem>({
  // 表单数据名称看接口文档
  attrName: attrStore.attrItem.attrName,
  attrValueList: attrStore.attrItem.attrValueList,
});

const inputRef = ref();

// 点击添加属性值按钮触发的函数
// 希望：table出现一行数据
const addAttrValue = async () => {
  // 数据更新是同步，页面更新是异步
  attrFormData.attrValueList.push({
    isShowEdit: true, // 编辑模式和显示模式
    valueName: "", // 属性值名称
  });
  // 让input获取焦点
  // 当DOM元素渲染完成，再触发回调函数

  /*
    const resolvedPromise = Promise.resolve();
    let currentFlushPromise = null;
    function nextTick(fn) {
      // p是一个成功状态的promise对象
      const p = currentFlushPromise || resolvedPromise;
      return fn ? p.then(this ? fn.bind(this) : fn) : p;
    }
    Promise.resolve().then(fn) // fn是异步执行
    nextTick将要执行的代码，添加到异步队列（将来异步执行，通过Promise.then方法添加到异步队列的）
  */
  // nextTick(() => {
  //   inputRef.value.focus();
  // });
  // 当DOM元素渲染完成，变成成功状态，继续执行下面代码
  await nextTick();
  inputRef.value.focus();
};

// 失去焦点，变成显示模式
const switchShow = (row: AttrValueItem, index: number) => {
  if (!row.valueName) {
    // 删除整行数据
    attrFormData.attrValueList.splice(index, 1);
    return;
  }
  row.isShowEdit = false;
};

// 点击，变成编辑模式
const switchEdit = async (row: AttrValueItem) => {
  row.isShowEdit = true;
  await nextTick();
  inputRef.value.focus();
};

// 删除属性值
const delAttrValue = (index: number) => {
  attrFormData.attrValueList.splice(index, 1);
};

const isBtnDisabled = computed(() => {
  // 属性名有值 并且 属性值列表至少有一个属性值名称
  return !(
    attrFormData.attrName &&
    attrFormData.attrValueList.some((attrValue) => attrValue.valueName)
  );
});

const categoryStore = useCategoryStore();
const addOrUpdateAttr = async () => {
  const { attrName, attrValueList } = attrFormData;
  const { category3Id } = categoryStore;
  const { id } = attrStore.attrItem;
  // 添加和更新用的同一个接口
  // 有id就是更新
  // 没有id就是添加
  await addOrUpdateAttrApi({
    attrName,
    attrValueList,
    categoryLevel: 3,
    categoryId: category3Id,
    id,
  });
  ElMessage.success(`${id ? "更新" : "添加"}属性成功`);
  cancel();
};

const emit = defineEmits(["setIsShowAttrList"]);

const cancel = () => {
  emit("setIsShowAttrList", true);
};
</script>

<style scoped>
.attr-input {
  width: 250px;
}
</style>
