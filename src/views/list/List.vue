<template>
  <div class="list widFix" style="padding: 0">
    <div class="topPart" style="background-color: #fff">
      <div class="wrapper">
        <div class="wid60">
          <div class="title">缺陷检测</div>
          <div class="content">{{ content }}</div>
        </div>
        <div class="wid40">
          <div class="images listImg"></div>
        </div>
      </div>
    </div>
    <div>
      <div class="searchArea">
        <el-input
          v-model="search"
          placeholder="请输入内容"
          clearable
          style="width: 300px"
        >
          <el-button
            type="primary"
            slot="append"
            icon="el-icon-search"
            @click="getList(currentPage)"
          ></el-button>
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleRoute('addTask')"
          >新建任务</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        @row-click="rowClick"
        v-loading="loading"
        :border="true"
      >
        <el-table-column prop="name" label="任务名称"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="handleRoute(`result?id=${scope.row.id}`)"
              style="margin-right: 10px"
              >查看</el-button
            > -->
            <el-button
              type="text"
              slot="reference"
              size="mini"
              icon="el-icon-delete"
              @click.native.stop="handleDialog(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align: right; margin-top: 30px"
      >
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      content:
        "精准检测物体表面缺陷的大小、位置、尺寸等，同时自动区分产品的缺陷类型；减少80%外观检测人力，助力制造企业进一步提升生产效率。",
      search: "",
      total: 0,
      currentPage: 1,
      pageSize: "10",
      tableData: [],
      loading: false,
      dialogVisible: false,
      deleteId: "",
    };
  },
  methods: {
    handleDialog(id) {
      this.dialogVisible = true;
      this.deleteId = id;
      return;
    },
    handleSizeChange(val) {
      this.getList(this.currentPage, val);
    },
    handleCurrentChange(val) {
      this.getList(val);
    },
    handleRoute(data) {
      this.$router.push(`/${data}`);
    },
    rowClick(row) {
      this.handleRoute(`result?id=${row.id}`);
    },
    getList(currentPage = this.currentPage, pageSize = this.pageSize) {
      this.loading = true;
      this.$http
        .get(
          `/detection/page?name=${this.search}&page=${currentPage}&pageSize=${pageSize}`
        )
        .then((response) => {
          this.loading = false;
          if (response.data && response.data.code === 1) {
            this.tableData = response.data.data.data;
            this.total = response.data.data.total;
          }
        })
        .catch((e) => {
          this.loading = false;
          this.$message({
            message: "网络或程序异常！" + e,
            type: "error",
          });
        });
    },
    handleDelete() {
      this.dialogVisible = false;
      this.$http({
        method: "DELETE",
        url: "/detection/del",
        params: {
          id: this.deleteId,
        },
      }).then(async (res) => {
        if (res.data && res.data.code == 1) {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.getList(1);
        } else {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss">
.list {
  > div {
    margin-bottom: 48px;
  }
  .searchArea {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .el-table {
    thead th.el-table__cell {
      background: rgb(245, 247, 250);
    }
    .el-button--text {
      color: #606266;
    }
    .el-button--text:hover {
      color: #215ef4;
    }
    .el-table--border .el-table__cell,
    .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border-right: 0;
    }
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
}
</style>
