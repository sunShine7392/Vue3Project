<template>
  <el-card>
    <div class="card-title">{{ title }}</div>
    <div class="card-value">{{ value }}</div>
    <div class="card-body">
      <!-- 优先使用默认插槽，最重要的内容使用默认插槽 -->
      <slot />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "CommonCard",
};
</script>

<script lang="ts" setup>
defineProps<{
  title: string;
  value: number;
}>();
</script>

<style scoped>
.card-title {
  font-size: 12px;
  color: #999;
}

.card-value {
  font-size: 25px;
  margin: 5px 0;
}

.card-body {
  height: 50px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-footer {
  font-size: 12px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 10px;
}
</style>
