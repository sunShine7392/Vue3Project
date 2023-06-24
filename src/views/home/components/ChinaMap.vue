<template>
  <el-card class="mt-20">
    <div class="chart-container" ref="chartRef"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "ChinaMap",
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import china from "./china.json";

// 注册地图
echarts.registerMap("china", china as any);

const chartRef = ref();

/*
  https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_aladin_banner

  const list = document.querySelectorAll('.VirusTable_1-135-1_3m6Ybq');
  const arr = []; 
  for (let i = 0; i < list.length; i++) {
    const item = list[i]; 
    arr.push({ name: item.children[0].innerText, value: item.children[4].innerText })
  }
  JSON.stringify(arr)
*/
const data = [
  { name: "台湾", value: "0" },
  { name: "广东", value: "880" },
  { name: "香港", value: "0" },
  { name: "北京", value: "2050" },
  { name: "山西", value: "1432" },
  { name: "重庆", value: "5707" },
  { name: "河南", value: "1268" },
  { name: "四川", value: "1018" },
  { name: "云南", value: "514" },
  { name: "黑龙江", value: "751" },
  { name: "内蒙古", value: "1666" },
  { name: "山东", value: "2138" },
  { name: "河北", value: "2044" },
  { name: "福建", value: "13" },
  { name: "辽宁", value: "269" },
  { name: "江苏", value: "316" },
  { name: "陕西", value: "717" },
  { name: "浙江", value: "9" },
  { name: "贵州", value: "73" },
  { name: "湖南", value: "225" },
  { name: "新疆", value: "1332" },
  { name: "上海", value: "70" },
  { name: "广西", value: "39" },
  { name: "海南", value: "17" },
  { name: "湖北", value: "578" },
  { name: "吉林", value: "605" },
  { name: "青海", value: "654" },
  { name: "天津", value: "483" },
  { name: "江西", value: "68" },
  { name: "甘肃", value: "1023" },
  { name: "西藏", value: "15" },
  { name: "安徽", value: "10" },
  { name: "宁夏", value: "472" },
  { name: "澳门", value: "0" },
];

onMounted(() => {
  const myEcharts = echarts.init(chartRef.value);
  const option = {
    title: {
      text: "新冠疫情分布图",
    },
    series: {
      name: "新冠疫情分布图",
      type: "map",
      map: "china",
      zoom: 1.7,
      top: 170,
      label: {
        show: true,
      },
      data,
    },
    tooltip: {},
    visualMap: {
      type: "piecewise",
      pieces: [
        { min: 10000 },
        { min: 1000, max: 9999 },
        { min: 100, max: 999 },
        { min: 10, max: 99 },
        { min: 1, max: 9 },
        { value: 0, color: "#fff" },
      ],
    },
  };
  myEcharts.setOption(option);
});
</script>

<style scoped>
.chart-container {
  height: 600px;
}
</style>
