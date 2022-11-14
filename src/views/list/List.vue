<template>
    <div class="list widFix">
        <div class="topPart">
            <div class="left">
                <div class="title">缺陷检测</div>
                <div class="content">{{ content }}</div>
            </div>
            <div class="right"></div>
        </div>
        <div>
            <div class="searchArea">
                <el-input v-model="search" placeholder="请输入内容" clearable style="width:300px"
                    @change="getList(currentPage)"></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="handleRoute('addTask')">新建任务</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name" label="任务名称">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleRoute(`result?id=${scope.row.id}`)" style="margin-right:10px">查看</el-button>
                        <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(scope.row)">
                            <el-button slot="reference" size="mini" type="danger">删除
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"
                style="text-align: right;margin-top:30px">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            content: '精准检测物体表面缺陷的大小、位置、尺寸等，同时自动区分产品的缺陷类型；减少80%外观检测人力，助力制造企业进一步提升生产效率。',
            search: '',
            total: 0,
            currentPage: 1,
            pageSize: '10',
            tableData: [],
        };
    },
    methods: {
        handleSizeChange(val) {
            this.getList(this.currentPage, val);
        },
        handleCurrentChange(val) {
            this.getList(val);
        },
        handleRoute(data) {
            this.$router.push(`/${data}`)
        },
        getList(currentPage = this.currentPage, pageSize = this.pageSize) {
            this.$http
                .get(
                    `/detection/page?name=${this.search}&page=${currentPage}&pageSize=${pageSize}`
                )
                .then(response => {
                    if (response.data && response.data.code === 1) {
                        this.tableData = response.data.data.data;
                        this.total = response.data.data.total;
                    }
                })
                .catch(e => {
                    this.$message({
                        message: "网络或程序异常！" + e,
                        type: "error"
                    });
                });
        },
        handleDelete(data) {
            this.$http({
                method: 'DELETE',
                url: '/detection/del',
                params: {
                    id:data.id
                },
            }).then(async (res) => {
                if (res.data && res.data.code == 1) {
                    this.$message({
                        message: "删除成功！",
                        type: "success"
                    });
                    this.getList(1);
                } else {
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                }
            })
        }
    },
    mounted() {
        this.getList()
    },
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
