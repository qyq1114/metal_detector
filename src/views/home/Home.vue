<template>
  <div class="home">
    <div class="topPart">
      <div class="wrapper">
        <div class="wid60">
          <div class="title">智能检测</div>
          <div class="content">
            依托于AI视觉检测技术，可在复杂的缺陷类型和环境干扰下大幅减少漏检误检，赋能生产过程产品的外观检测环节，解决了传统检测人力成本高、效率低、难追溯的难点和痛点
          </div>
        </div>
        <div class="wid40">
          <div class="images top"></div>
        </div>
      </div>
    </div>
    <div class="bgPart">
      <div class="wrapper">
        <div>
          <div class="images img1"></div>
          <div class="description">使用AI技术赋能制造工厂</div>
        </div>
        <div>
          <div class="images img2"></div>
          <div class="description">将生产过程数字化、智能化</div>
        </div>
        <div>
          <div class="images img3"></div>
          <div class="description">通过智慧系统将各类文档归集</div>
        </div>
      </div>
    </div>
    <div class="whitePart subPart">
      <div class="wid40">
        <div class="title">自动化的提供</div>
        <div class="content">
          金属表面各类缺陷数据统计
        </div>
      </div>
      <div class="wid60">
        <div id="main" style="height: 450px;width:100%"></div>
      </div>
    </div>
    <div class="whitePart subPart">
      <div class="wid60">
        <video src="" width="100%" height="450" controls></video>
      </div>
      <div class="wid40">
        <div class="title">记录生产过程</div>
        <div class="content">未来利用ai技术分析改进</div>
      </div>
    </div>
    <div class="whitePart subPart">
      <div class="wid40">
        <div class="title">服务于汽车后市场行业的</div>
        <div class="content">智慧工厂</div>
      </div>
      <div class="wid60">
        <el-amap :plugin="plugin" :center="center" :zoom="zoom" class="amap-demo" mapStyle='amap://styles/dark'
          style="width: 100%; height: 450px">
          <el-amap-marker v-for="marker in markers" :position="marker.position" :key="marker.id"
            :events="marker.events">
          </el-amap-marker>
          <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible"
            :content="window.content" :offset="window.offset">
          </el-amap-info-window>
        </el-amap>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import markerData from "./markers.json";
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
      zoom: 12,
      center: [117.266758, 33.673426],
      // 数据储存
      pointMarker: markerData,
      markers: [],
      windows: [],
      window: "",
      plugin: [
        {
          pName: "ToolBar",
          events: {
            init() {
            },
          },
        },
      ],
    };
  },
  mounted() {
    this.getStatistic();
    this.point();
  },
  methods: {
    renderStatistic(label, data) {
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      const option = {
        barMaxWidth:60,
        grid: {
          right: 0,
        },
        title: {
          text: "缺陷统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          valueFormatter: (value) => `${value}%`,
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
            label: {
              position:'top',
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 1, color: '#215ef4' }
              ])
            },
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
    point() {
      let markers = [];
      let windows = [];
      let that = this;
      this.pointMarker.forEach((item, index) => {
        markers.push({
          position: [item.lng, item.lat],
          icon: item.icon,
          events: {
            click() {
              that.windows.forEach((window) => {
                window.visible = false;
              });
              that.window = that.windows[index];
              that.$nextTick(() => {
                that.window.visible = true;
              });
            },
          },
        });
        windows.push({
          position: [item.lng, item.lat],
          content:
            '<div class="windows-text">' +
            '<div class="text-map">' +
            "<p class='title'>" +
            item.title +
            "</p>" +
            "<p class='address'>" +
            item.address +
            "</p>" +
            "<p><span>面积：</span>" +
            item.area +
            "</p>" +
            "<p><span>工程师：</span>" +
            item.numbers +
            "</p>" +
            "<p><span>产业类型：</span>" +
            item.type +
            "</p>" +
            "<p><span>生产产品：</span>" +
            item.product +
            "</p>" +
            "<p><span>服务市场：</span>" +
            item.market +
            "</p>" +
            "<p><span>产能：</span>" +
            item.productivity +
            "</p>" +
            "<p><span>投产时间：</span>" +
            item.time +
            "</p>" +
            "</div>" +
            "</div>",
          offset: [0, -35],
          visible: false,
        });
      });
      //  加窗体
      this.markers = markers;
      // 加弹窗
      this.windows = windows;
    },
  },
};
</script>

<style lang="scss">
.home {
  >div {
    margin-bottom: 48px;
  }
}

.amap-info-content {
  background-color: #8b8b8b;
  opacity: 0.8;
  font-weight: bold;
  color: #fff;
}

.windows-text {
  .title {
    font-size: 24px;
  }

  .address {
    font-size: 18px;
  }

  p {
    margin: 10px 0;

    span {
      width: 80px;
      display: inline-block;
      text-align: right;
    }
  }
}
</style>
