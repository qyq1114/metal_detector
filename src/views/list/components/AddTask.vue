<template>
    <div class="result widFix">
        <div>
            <div class="el-descriptions__title subTitle">新建任务</div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="任务名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="任务名称">
                    <el-upload action="/detection/upload/multipleImg" ref="upload"
                        name="files" list-type="picture-card" multiple :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                                <!-- <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleDownload(file)">
                                    <i class="el-icon-download"></i>
                                </span> -->
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">开始检测</el-button>
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
                name: '',
                imgPaths: []
            },
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false
        };
    },
    methods: {
        handleRemove(file) {
            console.log(file);
        },
        handleRoute(data) {
            this.$router.push(`/${data}`)
        },
        onSubmit() {
            this.uploadFilesFun();
        },
        // 文件上传
        uploadFilesFun() {
            let { uploadFiles} = this.$refs.upload
            let formdata = new FormData()
            // 文件对象
            uploadFiles.map(file => formdata.append("files",file.raw))
            this.$http({
                method: 'post',
                url: '/upload/multipleImg',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(async (res) => {
                if (res.data && res.data.code == 1) {
                    this.form.imgPaths = res.data.data.imgPaths;
                    this.addTask()
                } else {
                    this.$message({
                        message: "图片上传失败，请重试！",
                        type: "error"
                    });
                }
            })
        },
        addTask(){
            this.$http({
                method: 'post',
                url: '/detection/add',
                data: this.form,
            }).then(async (res) => {
                if (res.data && res.data.code == 1) {
                    this.$message({
                        message: "添加成功！",
                        type: "success"
                    });
                    this.$router.push(`/list`)
                } else {
                    this.$message({
                        message: "添加失败",
                        type: "error"
                    });
                }
            })
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
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
}
</style>
