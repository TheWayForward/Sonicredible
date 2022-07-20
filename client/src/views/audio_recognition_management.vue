<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-mic"></i> 音频管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>声纹识别音频管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover">
            <template #header>
                <div class="card-header">
                    <span>音频上传接口测试</span>
                </div>
            </template>
            <el-upload
                    :on-change="handleAudioChange"
                    :on-remove="handleAudioRemove"
                    :file-list="fileList.testUpload.tempAudioList"
                    :limit="1"
                    :auto-upload="false"
                    action="#">

                <template #default>
                    <i class="el-icon-lx-roundadd"></i>
                </template>
            </el-upload>
        </el-card>
    </div>
</template>

<script>
    import EnumHelper from "../utils/enum_helper";
    import {ElMessage} from "element-plus";
    import VersatileHelper from "../utils/versatile_helper";
    import {uploadAudioRecognition} from "../api/index";
    import MessageHelper from "../utils/message_helper";
    import UrlHelper from "../utils/url_helper";

    export default {
        name: "audio_recognition_management",

        data() {
            return {
                fileList: {
                    testUpload: {
                        tempAudioList: []
                    }
                }
            }
        },

        methods: {

            async handleAudioChange(res, file) {
                let tempFile = res;
                console.log(tempFile);
                if (tempFile.raw.type !== EnumHelper.audioType.MP3) {
                    ElMessage.warning("只能上传MP3格式的音频！");
                    return;
                }
                if (VersatileHelper.byteToSize(tempFile.raw.size) > 0.5) {
                    ElMessage.warning("音频不能大于500KB！");
                    return;
                }
                let form = new FormData();
                form.append(EnumHelper.formField.audio, tempFile.raw);
                let result = await uploadAudioRecognition(form);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    console.log(result);
                    ElMessage.success(MessageHelper.upload.success);
                    let url = result.info.path;
                    file[file.length - 1].url = url;
                    this.fileList.testUpload.tempAudioList.push({
                        url: UrlHelper.parseUrl(url),
                        name: (this.fileList.testUpload.tempAudioList.length + 1).toString()
                    });
                    console.log(this.fileList.testUpload.tempAudioList);
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleAudioRemove(res, file) {

            }

        }
    }
</script>

<style scoped>

</style>