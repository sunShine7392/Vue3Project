<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script lang="ts">
export default {
  name: "ProgressChart",
};
</script>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

const chartRef = ref();

onMounted(() => {
  const myEcharts = echarts.init(chartRef.value);
  const option = {
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: { data: ["进度"], show: false },
    tooltip: {
      trigger: "axis",
    },
    series: {
      type: "bar",
      name: "用户增长量",
      data: [45],
      barWidth: 10, // 柱条宽度
      showBackground: true, // 显示背景色
      // 柱条样式
      itemStyle: {
        color: "yellowgreen",
      },
      // 显示的文字
      label: {
        show: true,
        position: "right",
        formatter: "|",
        color: "yellowgreen",
      },
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
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
