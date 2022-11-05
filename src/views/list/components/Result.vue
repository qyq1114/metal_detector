<template>
    <div class="result">
        <div>
            <el-descriptions class="margin-top" title="检测结果" :column="4">
                <template slot="extra">
                    <el-button type="primary">导出</el-button>
                </template>
                <el-descriptions-item :span="4" label="任务名称">{{name}}</el-descriptions-item>
                <el-descriptions-item label="折痕">18100000000</el-descriptions-item>
                <el-descriptions-item label="划痕">苏州市</el-descriptions-item>
                <el-descriptions-item label="凸凹点">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="烧蚀">苏州市</el-descriptions-item>
            </el-descriptions>
            <div class="flexbetween">
                <div class="detectionContain">
                    <el-image :src="imgListCurr.imgPathUrl" class="bgImg"></el-image>
                    <div :key="index" v-for="(item, index) in imgListCurr.fullResult">
                        <template v-if="item['bbox&score'] && item['bbox&score'].length != 0">
                            <div v-for="(itemScore, indexScore) in item['bbox&score']" :key="indexScore" :style="getStyle(itemScore, index)" class="scoreItem" @click="choosePoint(itemScore, item.class_name)">
                                <!-- <div>{{item.class_name}}</div> -->
                            </div>
                        </template>
                    </div>
                </div>
                <div class="detectionDetail">
                    <div>图片尺寸：{{imagSize}}</div>
                    <div>已识别缺陷：{{chooseData.itemScore}}</div>
                    <div>缺陷类型：{{chooseData.class_name}}</div>
                </div>
            </div>
        </div>
        <div style="text-align:center">
            <el-button icon="el-icon-arrow-left" style="margin-right:20px">上一张</el-button>
            <el-button>下一张<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>

    </div>
</template>
<script>
const colorList = [
    'red',
    'green',
    'white',
    'gray'
]
export default {
    components: {},
    data() {
        return {
            name: '',
            imgList: [],
            imgListCurr: {},
            zoom: 1,
            chooseData: {},
            imagSize: ''
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData () {
            var that = this
            this.$http({
                method: 'get',
                url: '/detection/detail',
                params: {
                    id: this.$route.query.id
                },
                data: {}
            }).then(async (res) => {
                if (res.data && res.data.code == 1) {
                    that.name = res.data.data.name
                    that.imgList = res.data.data.imgList
                    // 默认选中第一个
                    that.setImg(0)
                } else {
                    that.$message.error(res.data.msg)
                }
            })
        },
        async setImg (index) {
            this.imgListCurr = this.imgList[index]
            this.imgListCurr.fullResult = JSON.parse(this.imgListCurr.fullResult)
            // 获取比例
            this.zoom = await this.getProportion(this.imgListCurr.imgPathUrl)
        },
        getStyle (itemScore, index) {
            var left = (itemScore[0] / this.zoom).toFixed(0)
            var top = (itemScore[1] / this.zoom).toFixed(0)
            var width = (this.getLength(itemScore[0],itemScore[1],itemScore[2],itemScore[3]) / this.zoom).toFixed(0)
            var height = (this.getLength(itemScore[2],itemScore[3],itemScore[4],itemScore[5]) / this.zoom).toFixed(0)
            // 计算旋转角度的方法，待完善
            var angel = this.getBevel(itemScore[3] - itemScore[1], itemScore[2] - itemScore[0]) || 0
            // console.log(`left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;background: ${colorList[index]};transform: rotate(${angel}deg);`)
            return `left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;background: ${colorList[index]};transform: rotate(${angel}deg);`
        },
        getLength (x, y, x1, y1) {
            const a = (x - x1) > 0 ? (x - x1) : (x - x1) * -1
            const b = (y - y1) > 0 ? (y - y1) : (y - y1) * -1
            return Math.sqrt(a*a + b*b)
        },
        getBevel (width, height) {
            const sin = width / height
            const angle = Math.round((Math.asin(sin) * 180 / Math.PI))
            return angle
        },
        async getProportion(imgPathUrl) {
            var that = this
            return new Promise((resolve, reject) => {
                try {
                    let image = new Image();
                    image.onload = function () {
                        // resolve({width: this.width, height: this.height});
                        that.imagSize = `width: ${this.width}; height: ${this.height};`
                        resolve(this.width / 750)
                        this.removeAttribute('src');
                        image = null;
                    };
                    image.onerror = error => {
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
        choosePoint(itemScore, class_name) {
            this.chooseData = {
                itemScore,
                class_name
            }
        }
    },
    mounted() { },
};
</script>

<style lang="scss" scoped>
.result {
    >div {
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

        .scoreItem {
            position: absolute;
        }
    }

    .detectionDetail {
        margin-left: 80px;
        width: 400px;
    }
}
</style>
