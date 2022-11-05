<template>
    <div class="result">
        <div>
            <el-descriptions class="margin-top" title="检测结果" :column="4">
                <template slot="extra">
                    <el-button type="primary">导出</el-button>
                </template>
                <el-descriptions-item :span="4" label="任务名称">kooriookami</el-descriptions-item>
                <el-descriptions-item label="折痕">18100000000</el-descriptions-item>
                <el-descriptions-item label="划痕">苏州市</el-descriptions-item>
                <el-descriptions-item label="凸凹点">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="烧蚀">苏州市</el-descriptions-item>
            </el-descriptions>
            <div class="flexbetween">
                <img src="../../../assets/img/error.png" />
                <div>
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
        };
    },
    methods: {
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
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
}
</style>
