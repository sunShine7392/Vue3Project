<template>
  <el-card class="mt-20">
    <div class="chart-container" ref="chartRef"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "PieChart",
};
</script>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, watch } from "vue";

const props = defineProps<{
  saleRank: any;
}>();

/*
"category": {
  "axisX": [
    "粉面粥店",
    "简餐便当",
    "汉堡披萨",
    "香锅冒菜",
    "小吃炸串",
    "地方菜系",
    "轻食简餐"
  ],
  "data1": [56, 52, 95, 41, 30, 69, 63]
}
*/

const chartRef = ref();

watch(props, () => {
  const data = props.saleRank.category.axisX.map(
    (item: string, index: number) => {
      return {
        name: item,
        value: props.saleRank.category.data1[index],
      };
    }
  );

  const total = props.saleRank.category.data1.reduce(
    (p: number, c: number) => p + c,
    0
  );

  const myEcharts = echarts.init(chartRef.value);
  const option = {
    title: [
      {
        text: "品类分布",
      },
      {
        text: "累计销售额",
        textStyle: {
          fontSize: 14,
          color: "#aaa",
          lineHeight: 20,
        },
        subtext: total,
        subtextStyle: {
          fontSize: 25,
        },
        left: "center",
        top: "40%",
      },
    ],
    legend: {
      right: 20,
      top: "middle",
      orient: "vertical",
      formatter: function (name: string) {
        // 找到对应数据的值
        const { value } = data.find((item: any) => item.name === name);

        const percent = ((value / total) * 100).toFixed(2) + "%";

        return name + " | " + percent;
      },
    },
    series: {
      type: "pie",
      data,
      radius: ["45%", "70%"],
      itemStyle: {
        borderWidth: 2,
        borderColor: "#fff",
      },
    },
  };
  myEcharts.setOption(option);
});
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style>
