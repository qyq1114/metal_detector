<template>
  <div class="result"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-descriptions class="margin-top" title="检测结果" :column="4">
        <template slot="extra">
          <el-button type="primary" @click="exportData">导出</el-button>
        </template>
        <el-descriptions-item :span="4" label="任务名称">{{
          detailData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="折痕">{{
          detailData.sumOfCreases
        }}</el-descriptions-item>
        <el-descriptions-item label="划痕">{{
          detailData.sumOfScratches
        }}</el-descriptions-item>
        <el-descriptions-item label="凸凹点">{{
          detailData.sumOfBumpPoints
        }}</el-descriptions-item>
        <el-descriptions-item label="烧蚀">{{
          detailData.sumOfAblation
        }}</el-descriptions-item>
      </el-descriptions>
      <div 
        class="flexbetween" 
      >
        <div class="detectionContain" id="detectionContain">
          <el-image :src="imgListCurr.imgPathUrl" class="bgImg"></el-image>
          <canvas
            id="myCanvas"
            :width="canvas.width"
            :height="canvas.height"
            @click="canvasClick"
          ></canvas>
        </div>
        <div class="detectionDetail">
          <div>图片尺寸：{{ canvas }}</div>
          <div>已识别缺陷：{{ chooseData.itemScore }}</div>
          <div>缺陷类型：{{ chooseData.class_name }}</div>
          <div>点击位置：{{ chooseData.position }}</div>
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <el-button
        icon="el-icon-arrow-left"
        style="margin-right: 20px"
        @click="changeImg(-1)"
        v-if="imgIndex != 0"
        >上一张</el-button
      >
      <el-button @click="changeImg(1)" v-if="imgIndex != imgList.length - 1"
        >下一张<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
    </div>
  </div>
</template>
<script>
const colorList = ["red", "green", "white", "gray"];
export default {
  components: {},
  data() {
    return {
      ctx: {},
      canvas: {},
      imgList: [],
      imgListCurr: {},
      imgIndex: 0,
      zoom: 1,
      chooseData: {},
      loading: true,
      detailData: {
        name: "",
        sumOfCreases: 0,
        sumOfScratches: 0,
        sumOfBumpPoints: 0,
        sumOfAblation: 0,
      },
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    var c = document.getElementById("myCanvas");
    this.ctx = c.getContext("2d");
  },
  methods: {
    exportData() {
      this.$http({
        method: "post",
        url: "/detection/export",
        params: {
          id: this.$route.query.id,
        },
        responseType: "blob",
      }).then(async (res) => {
        var URL = window.URL || window.webkitURL; //兼容处理
        // for ie 10 and later
        if (window.navigator.msSaveBlob) {
          try {
            window.navigator.msSaveBlob(res.data, "export.xlsx");
          } catch (e) {
            // console.log(e);
          }
        } else {
          let blobUrl = URL.createObjectURL(res.data);
          const a = document.createElement("a");
          a.style.display = "none";
          a.download = "export.xlsx";
          a.href = blobUrl;
          a.click();
          // document.body.removeChild(a);
        }
      });
    },
    canvasClick(e) {
      var c = document.getElementById("detectionContain");
      var x = e.clientX - c.offsetLeft;
      var y = e.clientY - c.offsetTop;
      console.log("position:" + e.clientX + "+++++" + e.clientY);
      console.log("position:" + c.offsetLeft + "+++++" + c.offsetTop);
      console.log("position:" + x + "+++++" + y);
      this.setImg(this.imgIndex, { x, y });
    },
    getData() {
      var that = this;
      this.$http({
        method: "get",
        url: "/detection/detail",
        params: {
          id: this.$route.query.id,
        },
        data: {},
      }).then(async (res) => {
        if (res.data && res.data.code == 1) {
          that.detailData = res.data.data;
          that.imgList = res.data.data.imgList;
          that.imgList.map((item) => {
            item.fullResult = JSON.parse(item.fullResult);
          });
          // 默认选中第一个
          that.setImg(that.imgIndex);
        } else {
          that.$message.error(res.data.msg);
        }
      });
    },
    changeImg(index) {
      this.imgIndex = this.imgIndex + index;
      this.setImg(this.imgIndex);
    },
    async setImg(index, position) {
      this.loading = true
      // 清空画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.imgListCurr = this.imgList[index];
      // 获取比例
      await this.getProportion(this.imgListCurr.imgPathUrl);
      // 画布重新渲染后再绘制点
      this.$nextTick(() => {
        this.setScores(this.imgListCurr.fullResult, position);
      });
    },
    async getProportion(imgPathUrl) {
      var that = this;
      return new Promise((resolve, reject) => {
        try {
          let image = new Image();
          image.onload = function () {
            // resolve({width: this.width, height: this.height});
            that.zoom = this.width / 750;
            that.canvas = {
              width: this.width / that.zoom,
              height: this.height / that.zoom,
            };
            resolve();
            this.removeAttribute("src");
            image = null;
          };
          image.onerror = (error) => {
            reject(error);
            image = null;
          };
          // 换成你自己的URL
          image.src = imgPathUrl;
        } catch (error) {
          reject(error);
        }
      });
    },
    setScores(list, position) {
      var that = this;
      list.map((item, index) => {
        if (item["bbox&score"] && item["bbox&score"].length != 0) {
          item["bbox&score"].map((itemScore) => [
            that.draw(
              itemScore,
              colorList[index],
              item["class_name"],
              position
            ),
          ]);
        }
      });
      that.loading = false
    },
    draw(scores, color, class_name, position) {
      const scoreZoom = [];
      scores.map((item) => {
        scoreZoom.push(item / this.zoom).toFixed(2);
      });
      const ctx = this.ctx;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(scoreZoom[0], scoreZoom[1]);
      ctx.lineTo(scoreZoom[2], scoreZoom[3]);
      ctx.lineTo(scoreZoom[4], scoreZoom[5]);
      ctx.lineTo(scoreZoom[6], scoreZoom[7]);
      ctx.closePath();
      if (position && this.ctx.isPointInPath(position.x, position.y)) {
        this.chooseData = {
          itemScore: scoreZoom,
          class_name,
          position: {
            ...position,
          },
        };
      }
      ctx.stroke();
    },
  },
};
</script>

<style lang="scss" scoped>
.result {
  > div {
    margin-bottom: 30px;
  }
  .flexbetween {
    display: flex;
    margin-bottom: 30px;
  }

  .detectionContain {
    width: 750px;
    position: relative;

    .bgImg {
      width: 100%;
    }

    #myCanvas {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .detectionDetail {
    margin-left: 80px;
    width: 400px;
  }
}
</style>
