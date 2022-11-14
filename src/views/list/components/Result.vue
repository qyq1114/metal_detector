<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="result">
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
        <div class="dragContain" id="dragContain" :style="`height: ${canvas.height}px`">
          <div 
            class="detectionContain" 
            id="detectionContain"
            :style="detectionContainStyle"
            @mousewheel="scaleCanvas"
          >
            <img :src="imgListCurr.imgPathUrl" class="bgImg"/>
            <canvas
              id="myCanvas"
              :width="canvas.width"
              :height="canvas.height"
              @click="canvasClick"
              @mouseup="mouseup"
              @mouseout="mouseup"
              @mousedown="mousedown"
              @mousemove="mousemove"
            ></canvas>
          </div>
        </div>
        <div class="detectionDetail">
          <!-- <div class="title">已识别缺陷：</div>
          <div>图片尺寸：{{ `${Math.round(canvas.width * zoom)}*${Math.round(canvas.height * zoom)}` }}</div>
          <div>已识别缺陷：{{ chooseData.itemScore }}</div>
          <div>缺陷类型：{{ chooseData.class_name }}</div>
          <div>点击位置：{{ chooseData.position }}</div> -->
          <div class="title">已识别缺陷：</div>
          <template>
            <div v-for="(item, index) in imgListCurr.fullResult" :key="index">
              <div v-for="(itemScore, indexScore) in item['bbox&score']" :key="indexScore" :class="getChoosed(itemScore)">
                <span>{{item["class_name"]}}：{{`${index}-${indexScore}`}}</span>
                <!-- <span>{{itemScore}}</span> -->
              </div>
            </div>
          </template>
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
const colorList = ["#f0f00b", "#11ec11", "white", "red"];
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
      transformData: {
        scale: 1,
        x: 0,
        y: 0,
      },
      movingCnfig: {
        moving: false,
        x: 0,
        y: 0
      },
      movingTime: 0,
    };
  },
  created() {
    this.getData();
    this.movingTime = new Date().getTime()
  },
  mounted() {
    var c = document.getElementById("myCanvas");
    this.ctx = c.getContext("2d");
  },
  computed: {
    detectionContainStyle() {
      return `transform: scale(${this.transformData.scale});left: ${this.transformData.x}px; top: ${this.transformData.y}px`
    },
    positionStyle () {
      return `left: ${this.transformData.x}px; top: ${this.transformData.y}px`
    }
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
      if (new Date().getTime() -  this.movingTime > 500) {
        var c = document.getElementById("dragContain");
        var x = e.clientX - c.offsetLeft;
        var y = e.clientY - c.offsetTop;
        const n = this.transformData.scale
        const w = this.canvas.width * (n - 1) / 2
        const h = this.canvas.height * (n - 1) / 2
        x = (x - this.transformData.x + w) / n
        y = (y - this.transformData.y + h) / n
        this.setImg(this.imgIndex, { x, y });
      }
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
      this.chooseData = {}
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
        console.log('选中了' + scores)
        this.chooseData = {
          scores,
          class_name,
          position: {
            ...position,
          },
        };
      }
      ctx.stroke();
    },
    // 区域方法缩小
    scaleCanvas (e) {
      if(e.wheelDelta) {   
          if(e.wheelDelta > 0) {     //当鼠标滚轮向上滚动时
            // console.log("鼠标滚轮向上滚动");
            this.setDetectionContain(e, -1)
          }
          if(e.wheelDelta < 0) {     //当鼠标滚轮向下滚动时
            // console.log("鼠标滚轮向下滚动");
            this.setDetectionContain(e, 1)
          }
        } else if(e.detail) {
          if(e.detail < 0) {   //当鼠标滚轮向上滚动时
            // console.log("鼠标滚轮向上滚动");
            this.setDetectionContain(e, -1)
          }
          if(e.detail > 0) {   //当鼠标滚轮向下滚动时
            // console.log("鼠标滚轮向下滚动");
            this.setDetectionContain(e, 1)
          }
        }
    },
    setDetectionContain (e, index) {
      e.preventDefault()
      if (index > 0 && this.transformData.scale < 4) {
        this.transformData.scale = (this.transformData.scale * 10 + 1) / 10
      }
      if (index < 0 && this.transformData.scale > 1) {
        this.transformData.scale = (this.transformData.scale * 10 - 1) / 10
        if (this.transformData.scale == 1) {
          this.transformData.x = 0
          this.transformData.y = 0
        }
      }
    },
    mouseup () {
      this.movingCnfig.moving = false
      // console.log('停止拖拽')
    },
    mousedown (e) {
      this.movingCnfig = {
        moving: true,
        x: e.clientX,
        y: e.clientY
      }
      // console.log('开始拖拽')
    },
    mousemove (e) {
      if (this.movingCnfig.moving) {
        const x = e.clientX - this.movingCnfig.x
        const y = e.clientY - this.movingCnfig.y
        if (x != 0 && y != 0) {
          // x和y都发生偏移时，记作拖拽事件，阻塞点击事件0.5秒
          this.movingTime = new Date().getTime()
        }
        this.transformData.x = this.transformData.x + x
        this.transformData.y = this.transformData.y + y
        // console.log('开始移动' + JSON.stringify(this.transformData))
        const n = this.transformData.scale - 1
        if (this.transformData.x > this.canvas.width * n / 2) {
          this.transformData.x = this.canvas.width * n / 2
        }
        if (this.transformData.x < this.canvas.width * n / 2 * -1) {
          this.transformData.x = this.canvas.width * n / 2 * -1
        }
        if (this.transformData.y > this.canvas.height * n / 2) {
          this.transformData.y = this.canvas.height * n / 2
        }
        if (this.transformData.y < this.canvas.height * n / 2 * -1) {
          this.transformData.y = this.canvas.height * n / 2 * -1
        }
      }
    },
    getChoosed (scores) {
      if (JSON.stringify(this.chooseData.scores) == JSON.stringify(scores)) {
        return 'choosed'
      }
      return ''
    }
  },
};
</script>

<style lang="scss" scoped>
.result {
  width: 1344px;
  margin: 0 auto;
  margin-top: 20px;
  // > div {
  //   margin-bottom: 30px;
  // }
  .flexbetween {
    display: flex;
    margin-bottom: 30px;
  }

  .detectionContain {
    width: 750px;
    position: absolute;

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
    margin-left: 40px;
    width: 400px;
    font-size: 16px;
    line-height: 28px;
    flex: 1;

    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .choosed {
      font-weight: bold;
    }
  }

  .dragContain {
    width: 750px;
    overflow: hidden;
    position: relative;
  }
}
</style>
