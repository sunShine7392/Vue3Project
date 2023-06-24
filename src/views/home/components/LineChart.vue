<template>
  <!-- 2. 准备一个具备宽高的容器 -->
  <div class="chart-container" ref="chartRef"></div>
</template>

<script lang="ts">
export default {
  name: "LineChart",
};
</script>

<script lang="ts" setup>
// * 代表echarts暴露的所有内容
// as 重命名
// echarts 命名的名称
// 引入echarts暴露的所有内容，重命名为echarts
// 所以：echarts就是echarts库暴露的所有内容
/*
  1. 默认暴露 export default xxx
    如何使用？ import xxx from 'xxx' 等价于 import { default as xxx } from 'xxx'
               
  2. 分别暴露/统一暴露 export xxx
    如何使用？ import { xxx } from 'xxx'
*/
// 1. 引入echarts
import * as echarts from "echarts";
import { ref, watch } from "vue";

const props = defineProps<{
  orderTrend: number[];
  orderTrendAxis: string[];
}>();

const chartRef = ref();

// 等数据回来，在渲染图表
// watch数据的变化
watch(props, () => {
  // 3. 初始化echarts实例
  const myEcharts = echarts.init(chartRef.value);
  // 4. 定义图表选项
  const option = {
    xAxis: {
      data: props.orderTrendAxis,
      // 坐标轴两边不留白
      boundaryGap: false,
    },
    yAxis: {
      show: false, // 将y轴隐藏
    },
    series: {
      type: "line",
      data: props.orderTrend,
      // 拐点样式
      itemStyle: {
        opacity: 0,
      },
      // 显示曲线
      smooth: true,
      // 区域颜色
      areaStyle: {
        color: "#a64ca6",
        opacity: 1,
      },
      // 线样式
      lineStyle: {
        color: "#a64ca6",
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  };
  // 5. 渲染图表
  myEcharts.setOption(option);
});

// onMounted(() => {});
</script>

<style scoped>
.chart-container {
  height: 100%;
}
</style>
