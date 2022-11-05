<template>
  <div class="home">
    <!-- <div class="bgImg">
            <div class="center">
                <div class="title">智能检测</div>
                <div class="content">
                    依托于AI视觉检测技术，可在复杂的缺陷类型和环境干扰下大幅减少漏检误检，赋能生产过程产品的外观检测环节，解决了传统检测人力成本高、效率低、难追溯的难点和痛点
                </div>
            </div>
        </div> -->
    <div class="topPart">
      <div class="left">
        <div class="title">智能检测</div>
        <div class="content">
          依托于AI视觉检测技术，可在复杂的缺陷类型和环境干扰下大幅减少漏检误检，赋能生产过程产品的外观检测环节，解决了传统检测人力成本高、效率低、难追溯的难点和痛点
        </div>
      </div>
      <div class="right"></div>
    </div>
    <div>
      <el-row>
        <el-col :span="12"
          ><video src="" width="100%" height="400" controls></video
        ></el-col>
        <el-col :span="12">
          <div id="main" style="height: 400px"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  components: {},
  data() {
    return {
      statisticLabel: {
        frequencyOfCreases: "折痕",
        frequencyOfScratches: "划痕",
        frequencyOfBumpPoints: "凸凹点",
        frequencyOfAblation: "烧蚀",
      },
    };
  },
  mounted() {
    this.getStatistic();
  },
  methods: {
    renderStatistic(label, data) {
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      const option = {
        title: {
          text: "缺陷统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          valueFormatter:(value) =>  `${value}%`
        },
        xAxis: {
          type: "category",
          data: label,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%",
          },
        },
        series: [
          {
            data: data,
            type: "bar",
          },
        ],
      };
      myChart.setOption(option);
    },
    getStatistic() {
      this.$http
        .get(`/home/statistic`)
        .then((response) => {
          if (response.data && response.data.code === 1) {
            let statisticData = [];
            let statisticLabels = [];
            for (let i in response.data.data) {
              statisticData.push(response.data.data[i] * 100);
              statisticLabels.push(this.statisticLabel[i]);
            }
            this.renderStatistic(statisticLabels, statisticData);
          }
        })
        .catch((e) => {
          this.$message({
            message: "网络或程序异常！" + e,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  > div {
    margin-bottom: 48px;
  }
}
</style>
