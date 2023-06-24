<template>
  <el-card class="mt-20">
    <!-- 2. 准备一个具备宽高的DOM容器（需要id属性） -->
    <div id="b-map-container"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "BMap",
};
</script>

<script lang="ts" setup>
import { onMounted } from "vue";

// 文档：https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/helloworld

window.initBMap = () => {
  // 等百度地图API JS文件加载完成，再触发函数
  // 创建地图实例
  const map = new BMapGL.Map("b-map-container");
  // 设置中心点坐标
  const point = new BMapGL.Point(114.085947, 22.547);
  // 地图初始化，同时设置地图展示级别
  map.centerAndZoom(point, 12);
  // 设置地图类型
  // map.setMapType(BMAP_EARTH_MAP);
  // 添加控件
  const scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
  map.addControl(scaleCtrl);
  const zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
  map.addControl(zoomCtrl);
  const cityCtrl = new BMapGL.CityListControl(); // 添加城市列表控件
  map.addControl(cityCtrl);
  const locationCtrl = new BMapGL.LocationControl(); // 添加定位控件
  map.addControl(locationCtrl);
};

// 1. 引入百度地图API JS文件
onMounted(() => {
  // 1. 创建script标签
  const script = document.createElement("script");
  // 2. 指定src属性
  script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=XewCXqm7cEwPs3d8jytPqzbHP6y603nx&callback=initBMap`;
  // 3. 将script添加到页面中生效
  document.body.appendChild(script);
});
</script>

<style scoped>
#b-map-container {
  height: 600px;
}
</style>
