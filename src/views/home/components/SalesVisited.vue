<template>
  <el-card>
    <div class="card-header">
      <el-tabs v-model="tabValue">
        <el-tab-pane label="销售额" name="sales"></el-tab-pane>
        <el-tab-pane label="访问量" name="visited"></el-tab-pane>
      </el-tabs>

      <div class="card-header-right">
        <el-radio-group>
          <el-radio-button label="今日" />
          <el-radio-button label="本周" />
          <el-radio-button label="本月" />
          <el-radio-button label="本年" />
        </el-radio-group>

        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </div>

    <div class="chart-container" ref="chartRef"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "SalesVisited",
};
</script>

<script lang="ts" setup>
import { ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  orderFullYearAxis: string[];
  orderFullYear: number[];
  userFullYearAxis: string[];
  userFullYear: number[];
}>();

const tabValue = ref("sales");

const chartRef = ref();

let myEcharts: any;

watch(props, () => {
  myEcharts = echarts.init(chartRef.value);
  const option = {
    title: {
      text: "销售趋势",
    },
    xAxis: {
      data: props.orderFullYearAxis,
    },
    yAxis: {},
    tooltip: {},
    series: {
      type: "bar",
      data: props.orderFullYear,
    },
  };
  myEcharts.setOption(option);
});

watch(tabValue, () => {
  const isSales = tabValue.value === "sales";
  // 重新调用setOption就会重新渲染图表
  // 只需要传递更新的内容
  myEcharts.setOption({
    title: {
      text: isSales ? "销售趋势" : "访问量趋势",
    },
    xAxis: {
      data: isSales ? props.orderFullYearAxis : props.userFullYearAxis,
    },
    series: {
      data: isSales ? props.orderFullYear : props.userFullYear,
    },
  });
});
</script>

<style scoped>
.card-header {
  position: relative;
}
.card-header-right {
  position: absolute;
  right: 0;
  top: 0;
  height: 60px;
  display: flex;
  align-items: center;
}
:deep(.el-card__body) {
  padding-top: 0;
}
:deep(.el-tabs__item) {
  padding: 0 20px !important;
  height: 60px;
  line-height: 60px;
}
:deep(.el-tabs__active-bar) {
  width: 60px !important;
  left: -8px;
}

.chart-container {
  height: 300px;
}
</style>
