<template>
    <div class="result">
        <div>
            <div class="el-descriptions__title subTitle">新建任务</div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="任务名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="任务名称">
                    <el-upload action="/detection/upload/multipleImg" :file-list="form.fileList" ref="upload"
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
                fileList: []
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
        // handlePictureCardPreview(file) {
        //     this.dialogImageUrl = file.url;
        //     this.dialogVisible = true;
        // },
        // handleDownload(file) {
        //     console.log(file);
        // },
        handleRoute(data) {
            this.$router.push(`/${data}`)
        },
        onSubmit() {
            this.handleImages();
            // this.$router.push(`/result`)
        },
        // 文件上传
        handleImages() {
            let { uploadFiles, action, data } = this.$refs.upload
            this.uploadFilesFun({
                uploadFiles,
                data,
                action,
                success: (response) => {
                    console.log(response)
                    // 上传成功后，将里面的内容删除
                    // this.$refs.upload.clearFiles();
                },
                error: (error) => {
                    console.log('失败了', error)
                }
            })
        },
        uploadFilesFun({ uploadFiles, headers, data, action, success, error }) {
            console.log(uploadFiles)
            debugger
            let formdata = new FormData()
            let temp = [];
            // 文件对象
            uploadFiles.map(file => temp.push(file.raw))
            formdata.append("files",temp)
            this.$http({
                method: 'post',
                url: '/detection/upload/multipleImg',
                data: formdata,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(async (res) => {
                debugger
                if (res.data && res.data.code == 1) {
                } else {
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
