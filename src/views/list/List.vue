<template>
    <div class="list">
        <div class="topPart">
            <div class="left">
                <div class="title">缺陷检测</div>
                <div class="content">
                    精准检测物体表面缺陷的大小、位置、尺寸等，同时自动区分产品的缺陷类型；减少80%外观检测人力，助力制造企业进一步提升生产效率。</div>
            </div>
            <div class="right right1"></div>
        </div>
        <div>
            <div class="searchArea">
                <el-input v-model="input" placeholder="请输入内容" style="width:300px"></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="handleRoute('addTask')">新建任务</el-button>
            </div>
            <!-- <ul>
                <li v-for="item in tableData" class="task" @click="handleRoute('result')">
                    <div class="detail">
                        <div>{{ item.name }}</div>
                        <div>创建时间：{{ item.date }}</div>
                    </div>
                    <el-button icon="el-icon-delete" circle></el-button>
                </li>
            </ul> -->
            <el-table :data="tableData" border style="width: 100%" >
                <el-table-column prop="name" label="任务名称">
                </el-table-column>
                <el-table-column prop="date" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleRoute('result')">查看</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100"
                layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: right;margin-top:30px">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            total: 400,
            currentPage: 1,
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1517 弄",
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1519 弄",
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1516 弄",
                },
            ],
        };
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        handleRoute(data) {
            this.$router.push(`/${data}`)
        }
    },
    mounted() { },
};
</script>

<style lang="scss" scoped>
.list {
    >div {
        margin-bottom: 48px;
    }
}

.searchArea {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .detail {
        div {
            margin: 5px 0;
        }
    }
}
</style>
