<template>
    <div class="result">
        <div>
            <div class="el-descriptions__title subTitle">新建任务</div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="任务名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="任务名称">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleDownload(file)">
                                    <i class="el-icon-download"></i>
                                </span>
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
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            form: {
                name:'',
                image:[]
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
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            console.log(file);
        },
        handleRoute(data) {
            this.$router.push(`/${data}`)
        },
        onSubmit(){
            this.$router.push(`/result`)
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
