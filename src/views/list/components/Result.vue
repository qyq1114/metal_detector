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
                                <div v-for="(itemScore, indexScore) in item['bbox&score']" :key="indexScore" :style="getStyle(itemScore, indexScore)">
                                    <!-- <div>{{item.class_name}}</div> -->
                                </div>
                            </template>
                        </div>
                </div>
                <div class="detectionDetail">
                    <div>已识别缺陷：</div>
                    <div>折痕</div>
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
export default {
    components: {},
    data() {
        return {
            name: '',
            imgList: [],
            imgListCurr: {},
            zoom: 1,
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
                    that.imgListCurr = that.imgList[0]
                    that.imgListCurr.fullResult = JSON.parse(that.imgListCurr.fullResult)
                    // 获取比例
                    that.zoom = await that.getProportion(that.imgListCurr.imgPathUrl)
                } else {
                    that.$message.error(res.data.msg)
                }
            })
        },
        getStyle (scoreList) {
            // console.log(scoreList)
        },
        async getProportion(imgPathUrl) {
            return new Promise((resolve, reject) => {
                try {
                    let image = new Image();
                    image.onload = function () {
                        // resolve({width: this.width, height: this.height});
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
    }

    .detectionDetail {
        margin-left: 80px;
    }
}
</style>
