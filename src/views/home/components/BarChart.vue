<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script lang="ts">
export default {
  name: "BarChart",
};
</script>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, watch } from "vue";

const props = defineProps<{
  orderUserTrend: number[];
  orderUserTrendAxis: string[];
}>();

const chartRef = ref();

watch(props, () => {
  const myEcharts = echarts.init(chartRef.value);
  const option = {
    xAxis: {
      data: props.orderUserTrendAxis,
    },
    yAxis: {
      show: false,
    },
    tooltip: {
      trigger: "axis", // 坐标轴触发
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    series: {
      name: "实时交易量",
      type: "bar",
      data: props.orderUserTrend,
      itemStyle: {
        color: "#3398db",
      },
    },
  };
  myEcharts.setOption(option);
});
</script>

<style scoped>
.chart-container {
  height: 100%;
}
</style>
