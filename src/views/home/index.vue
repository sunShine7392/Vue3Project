<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :lg="6" class="common-card-wrap">
        <CommonCard title="今日销售额" :value="homeData.salesToday">
          <div>
            日同比 {{ homeData.salesGrowthLastDay }}%
            <el-icon color="red"><CaretBottom /></el-icon>
          </div>
          <div>
            月同比 {{ homeData.salesGrowthLastMonth }} %
            <el-icon color="green"><CaretTop /></el-icon>
          </div>
          <template #footer>
            昨日销售额 ￥{{ homeData.salesLastDay }}
          </template>
        </CommonCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="common-card-wrap">
        <CommonCard title="今日订单" :value="homeData.orderToday">
          <LineChart
            :orderTrend="homeData.orderTrend"
            :orderTrendAxis="homeData.orderTrendAxis"
          />
          <template #footer> 昨日订单量 ￥{{ homeData.orderLastDay }}</template>
        </CommonCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="common-card-wrap">
        <CommonCard title="今日交易用户数" :value="homeData.orderUser">
          <BarChart
            :orderUserTrend="homeData.orderUserTrend"
            :orderUserTrendAxis="homeData.orderUserTrendAxis"
          />
          <template #footer> 退货率 {{ homeData.returnRate }}% </template>
        </CommonCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="common-card-wrap">
        <CommonCard title="累计用户数" :value="432582">
          <ProgressChart />
          <template #footer>
            <span>
              日同比 -19.16%
              <el-icon color="red"><CaretBottom /></el-icon>
            </span>
            <span>
              月同比 56.16%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </template>
        </CommonCard>
      </el-col>
    </el-row>

    <SalesVisited
      :orderFullYearAxis="homeData.orderFullYearAxis"
      :orderFullYear="homeData.orderFullYear"
      :userFullYearAxis="homeData.userFullYearAxis"
      :userFullYear="homeData.userFullYear"
    />

    <PieChart :saleRank="homeData.saleRank" />

    <BMap />

    <ChinaMap />
  </div>
</template>

<script lang="ts">
export default {
  name: "XHome",
};
</script>
<script lang="ts" setup>
import CommonCard from "./components/CommonCard.vue";
import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
import ProgressChart from "./components/ProgressChart.vue";
import PieChart from "./components/PieChart.vue";
import SalesVisited from "./components/SalesVisited.vue";
import BMap from "./components/BMap.vue";
import ChinaMap from "./components/ChinaMap.vue";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { getHomeDataApi } from "@/api/mock/home";

const homeData = ref<any>({
  // 今日销售额
  salesToday: 0,
  salesLastDay: 0,
  salesGrowthLastDay: 0,
  salesGrowthLastMonth: 0,
  // 今日订单量
  orderToday: 0,
  orderLastDay: 0,
  orderTrend: [],
  orderTrendAxis: [],
  // 今日交易用户数
  orderUser: 0,
  returnRate: 0,
  orderUserTrend: [],
  orderUserTrendAxis: [],
  // 累计用户数
  usersTotal: 0,
  usersLastMonth: 0,
  userGrowthLastDay: 0,
  userGrowthLastMonth: 0,
  // 销售额和访问量
  orderFullYearAxis: [],
  orderFullYear: [],
  userFullYearAxis: [],
  userFullYear: [],
  // 分类销售排行
  saleRank: {
    category: {
      axisX: [],
      data1: [],
    },
    goods: {
      axisX: [],
      data1: [],
    },
  },
});

onMounted(async () => {
  homeData.value = await getHomeDataApi();
});
</script>

<style scoped>
.common-card-wrap {
  margin-bottom: 10px;
}
</style>
