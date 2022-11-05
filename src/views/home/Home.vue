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
                <el-col :span="12"><video src="" width="100%" height="400" controls></video></el-col>
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
        return {};
    },
    mounted() {
        var myChart = echarts.init(document.getElementById("main"));
        // 绘制图表
        const option = {
            title: {
                text: "缺陷统计",
                left: 'center'
            },
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: "bar",
                },
            ],
        };
        myChart.setOption(option);
    },
};
</script>

<style lang="scss" scoped>
.home {
    >div {
        margin-bottom: 48px;
    }

    


}
</style>
