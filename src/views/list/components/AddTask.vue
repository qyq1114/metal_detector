<template>
  <div class="result widFix" v-loading.fullscreen.lock="fullscreenLoading">
    <div>
      <div class="el-descriptions__title subTitle">新建任务</div>
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="选择图片" prop="fileList">
          <el-upload
            action="/detection/upload/multipleImg"
            ref="upload"
            name="files"
            list-type="picture-card"
            multiple
            :auto-upload="false"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleChange"
            :file-list="form.fileList"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div style="color: red">已选择{{ fileListLength || 0 }}张图片</div>
          <el-button icon="el-icon-upload" type="primary" @click="onSubmit"
            >开始检测</el-button
          >
          <el-button @click="handleRoute('list')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      form: {
        name: "",
        imgPaths: [],
        fileList: [],
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileListLength: 0,
      fullscreenLoading: false,
      rules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        fileList: [{ required: true, message: "请选择图片", trigger: "change" }],
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
      this.fileListLength = fileList.length;
      this.$refs.form.validateField('fileList');
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRoute(data) {
      this.$router.push(`/${data}`);
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.uploadFilesFun();
        } else {
          return false;
        }
      });
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList;
      this.fileListLength = fileList.length;
      this.$refs.form.validateField('fileList');
    },
    // 文件上传
    uploadFilesFun() {
      let { uploadFiles } = this.$refs.upload;
      let formdata = new FormData();
      // 文件对象
      uploadFiles.map((file) => formdata.append("files", file.raw));
      this.fullscreenLoading = true;
      this.$http({
        method: "post",
        url: "/upload/multipleImg",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(async (res) => {
        if (res.data && res.data.code == 1) {
          this.form.imgPaths = res.data.data.imgPaths;
          this.addTask();
        } else {
          this.fullscreenLoading = false;
          this.$message({
            message: "图片上传失败，请重试！",
            type: "error",
          });
        }
      });
    },
    addTask() {
      this.$http({
        method: "post",
        url: "/detection/add",
        data: this.form,
      }).then(async (res) => {
        this.fullscreenLoading = false;
        if (res.data && res.data.code == 1) {
          this.$message({
            message: "添加成功！",
            type: "success",
          });
          this.$router.push(`/list`);
        } else {
          this.$message({
            message: "添加失败",
            type: "error",
          });
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.result {
  > div {
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
