<template>
  <!-- 
    shadow="hover" 设置卡片阴影出现的时机
   -->
  <el-card shadow="hover">
    <el-button
      type="primary"
      :icon="Plus"
      @click="showTrademarkDialog({ id: 0, tmName: '', logoUrl: '' })"
    >
      添加品牌
    </el-button>

    <!-- 
      data 要渲染的数据
      border 带边框
      row-key="id" 指定table每行key属性的值
     -->
    <el-table
      :data="trademarkList"
      border
      class="mt-20"
      row-key="id"
      v-loading="loading"
    >
      <!-- 
        el-table-column 列组件（决定表格渲染几列）
          label 列的标题
          type="index" 渲染从1开始的序号
          width 列的宽度
          align="center" 居中对齐
          
          如果想要渲染纯文本数据，prop
          如果想要渲染其他结构，插槽
       -->
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <!-- 没有传递插槽，prop来决定渲染的内容 -->
      <el-table-column label="品牌LOGO">
        <!-- 
          el-table-column作用域插槽，传递row，$index参数 
          row 要渲染的整行数据
          $index 数据的下标
        -->
        <template v-slot="{ row }">
          <!-- 
            lazy 图片懒加载
           -->
          <el-image
            :src="row.logoUrl"
            fit="fill"
            loading="lazy"
            class="trademark-logo"
          >
            <!-- 具名插槽：当图片加载失败时显示的内容 -->
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 传递插槽，插槽就是要渲染的内容 -->
        <template v-slot="{ row }">
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            @click="showTrademarkDialog(row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="delTrademark(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      v-model:current-page 当前页码
      v-model:page-size    每页条数
      :page-sizes          每页条数的选项
      layout    分页器需要加载的组件
      total     总数
      @size-change  当page-size发生变化触发的事件
      @current-change  当current-page发生变化触发的事件
     -->
    <el-pagination
      class="mt-20"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9, 12]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="getTrademarkList"
      @current-change="getTrademarkList"
    />

    <!-- 
      v-model="dialogVisible" 决定对话框显示&隐藏
      title 标题
      width 宽度
     -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${trademarkFormData.id ? '修改' : '添加'}品牌`"
    >
      <el-form
        label-width="100px"
        ref="trademarkFormRef"
        :model="trademarkFormData"
        :rules="trademarkFormRules"
      >
        <!-- 
          prop="tmName" 使用tmName这个表单校验规则
         -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            class="trademark-input"
            v-model="trademarkFormData.tmName"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 
            action 上传图片的服务器地址
              action="/admin/product/fileUpload" 不行，没有服务器地址
              action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload" 不行，跨域
              action="/app-dev/admin/product/fileUpload" 不行，本地开发可以，上线不行（上线请求前缀变了，变成/app-prod）
              请求前缀需要从 import.meta.env.VITE_API_URL 获取
            :show-file-list="false" 是否能上传多张图片（false不能上传多张图片）
            :on-success 上传图片成功触发函数
            :before-upload 上传图片之前触发函数（限制图片的大小和类型）
           -->
          <el-upload
            class="avatar-uploader"
            :action="BASE_URL + '/admin/product/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkFormData.logoUrl"
              :src="trademarkFormData.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过200kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addTrademark"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'XTrademark',
};
</script>

<script lang="ts" setup>
import {
  Plus,
  Edit,
  Delete,
  Picture as IconPicture,
} from '@element-plus/icons-vue';
import { ref, onMounted, reactive } from 'vue';
import {
  getTrademarkListApi,
  addTrademarkApi,
  updateTrademarkApi,
  delTrademarkApi,
} from '@/api/product/trademark';
import type {
  TrademarkList,
  TrademarkItem,
} from '@/api/product/model/trademarkModel';
// 在js中使用组件必须引入
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps } from 'element-plus';
import { beforeAvatarUpload } from '@/utils/tools';

// 删除品牌
const delTrademark = (row: TrademarkItem) => {
  ElMessageBox.confirm(`您确认要删除 ${row.tmName} 吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 点击确定按钮触发的回调
      // 发送请求，删除
      await delTrademarkApi(row.id);
      getTrademarkList();
      ElMessage.success('删除品牌成功');
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "Delete canceled",
      // });
    });
};

// 点击确定按钮
const addTrademark = async () => {
  // 1. 校验整个表单
  /*
    校验通过，promise对象就是成功状态
    校验失败，promise对象就是失败状态

    async函数中，只要有一个promise变成失败状态，整个函数会直接退出
    promise变成成功状态，继续执行剩下代码
  */
  await trademarkFormRef.value.validate();
  // 2. 校验通过，才能发送请求
  const { tmName, logoUrl, id } = trademarkFormData;

  if (id) {
    // 修改
    await updateTrademarkApi(trademarkFormData);
  } else {
    // 添加
    await addTrademarkApi(tmName, logoUrl);
  }
  ElMessage.success(`${id ? '修改' : '添加'}品牌成功`);
  dialogVisible.value = false;
  // 再次发送请求，获取最新数据展示
  getTrademarkList();
};

// 用来获取el-form组件实例对象
const trademarkFormRef = ref();

// 表单数据
const trademarkFormData = reactive({
  // 表单参数名称看接口文档
  // 品牌名称
  tmName: '',
  // 品牌LOGO
  logoUrl: '',
  // 初始化id
  id: 0,
});

// 表单校验规则
const trademarkFormRules = reactive({
  // 表单校验规则名称必须和数据名称一致
  tmName: [
    {
      // 必填项
      required: true,
      // 校验失败。提示错误信息
      message: '请输入品牌名称',
      // 触发表单校验的时机：失去焦点
      trigger: 'blur',
    },
    {
      min: 2,
      max: 10,
      message: '品牌名称必须为2-10位',
      trigger: 'blur',
    },
  ],
  logoUrl: [
    {
      // 必填项
      required: true,
      // 校验失败。提示错误信息
      message: '请上传图片LOGO',
    },
  ],
});

/**************** 图片上传功能 *******************/
// 请求前缀
const BASE_URL = import.meta.env.VITE_API_URL;

// 上传成功的图片地址
// const imageUrl = ref("");

// 图片上传之前触发的回调
// const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
//   /*
//     rawFile 上传图片文件
//       type 图片类型
//       size 图片大小
//   */
//   const validImageTypes = ["image/jpeg", "image/png"];

//   if (!validImageTypes.includes(rawFile.type)) {
//     ElMessage.error("图片只能是jpg或png格式!");
//     // 返回值false，就会中止上传
//     return false;
//   } else if (rawFile.size > 200 * 1024) {
//     ElMessage.error("图片大小不能超过200kb!");
//     return false;
//   }
//   // 返回值true，就会继续上传
//   return true;
// };

// 图片上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // 更新数据
  trademarkFormData.logoUrl = response.data;
  // 清空表单校验失败的信息
  // trademarkFormRef.value.clearValidate(); // 清空所有表单项的校验信息
  trademarkFormRef.value.clearValidate(['logoUrl']); // 清空logoUrl表单项的校验信息
};

/**************** 添加品牌对话框显示&隐藏 *******************/

// 对话框的显示&隐藏
const dialogVisible = ref(false);
// 显示添加
// const showAddTrademarkDialog = () => {
//   // 清空表单数据
//   trademarkFormData.tmName = "";
//   trademarkFormData.logoUrl = "";
//   trademarkFormData.id = 0;
//   // 显示dialog
//   dialogVisible.value = true;
//   // 清空表单校验结果
//   trademarkFormRef.value.clearValidate();
// };
// 显示修改
// const showUpdateTrademarkModel = (row: TrademarkItem) => {
//   trademarkFormData.tmName = row.tmName;
//   trademarkFormData.logoUrl = row.logoUrl;
//   trademarkFormData.id = row.id;
//   dialogVisible.value = true;
//   trademarkFormRef.value.clearValidate();
// };
// 封装复用函数
const showTrademarkDialog = (row: TrademarkItem) => {
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id;
  // 数据更新是同步，页面更新是异步
  dialogVisible.value = true;
  // Uncaught TypeError: Cannot read properties of undefined (reading 'clearValidate')
  // 翻译：trademarkFormRef.value 是 undefined
  // if ( trademarkFormRef.value) {
  //   trademarkFormRef.value.clearValidate();
  // }
  // trademarkFormRef.value && trademarkFormRef.value.clearValidate();
  // 可选链
  // 判断?前面的数据是否有值，有值继续执行后面，没有值就不执行了
  trademarkFormRef.value?.clearValidate();
};

const cancel = () => {
  dialogVisible.value = false;
};

/**************** 品牌列表分页展示数据 *******************/
// 品牌列表数据
const trademarkList = ref<TrademarkList>([]);
const loading = ref(false);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(3);
// 总数
const total = ref(0);

// 封装公共的请求函数
const getTrademarkList = async () => {
  loading.value = true;
  const res = await getTrademarkListApi(currentPage.value, pageSize.value);
  total.value = res.total;
  trademarkList.value = res.records;
  loading.value = false;
};

// onMounted(() => {
//   getTrademarkList();
// });
onMounted(getTrademarkList);

// 当 pageSize 发生变化触发的回调
// const handleSizeChange = () => {
//   getTrademarkList();
// };
// 当 currentPage 发生变化触发的回调
// const handleCurrentChange = () => {
//   getTrademarkList();
// };
</script>

<style scoped>
.trademark-logo {
  width: 150px;
  height: 100px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.trademark-input {
  width: 400px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<!-- <style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style> -->
