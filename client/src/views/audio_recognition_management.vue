<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-mic"></i> 音频管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>语义识别音频管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover">
            <div style="margin-bottom: 20px;">
                <el-button type="primary" size="small" @click="handleAudioUploadDialog">上传音频</el-button>
            </div>

            <el-divider />

            <el-table border :data="audioList" style="width: 100%;"
                      v-loading="audioTableLoading" size="small">
                <el-table-column align="center" prop="id" label="音频ID" width="100"/>
                <el-table-column align="center" prop="user_id" label="用户ID" width="100"/>
                <el-table-column align="center" label="序列号" width="250">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small" @click="handleCopy(scope.row.serial)" style="width: 80%;">
                                {{scope.row.serial}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="base64编码" align="center" width="250">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small" @click="handleCopy(scope.row.base64)" style="width: 80%;">
                                {{scope.row.base64.slice(0, 20) + "..."}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="路径" align="center">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small" @click="handleCopy(scope.row.url)">
                                {{scope.row.url.slice(0, 30) + "..."}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="time_created_string" label="创建时间" width="180"/>
                <el-table-column align="center" fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="handleAudioRecognitionDialog(scope.row)">语义识别
                        </el-button>
                        <el-button type="text" size="small" @click="handleAudioInstructionDialog(scope.row)">指令转换</el-button>
                        <el-button type="text" size="small" @click="handleAudioDownload(scope.row.url)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="上传音频" v-model="audioUploadDialogVisible" width="50%" :close-on-click-modal="false">

                <el-form label-width="100px" size="small">
                    <el-form-item label="音频文件">
                        <el-upload
                                :on-change="handleAudioChange"
                                :on-remove="handleAudioRemove"
                                :file-list="fileList.testUpload.tempAudioList"
                                :limit="1"
                                :auto-upload="false"
                                action="#">
                            <template #default>
                                <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        :content="indicator.audioUploadDialog.audio"
                                        placement="bottom"
                                >
                                    <i class="el-icon-lx-roundadd" style="font-size: 50px; margin-top: 60px;"></i>
                                </el-tooltip>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog title="语义识别" v-model="audioRecognitionDialogVisible" width="50%" :close-on-click-modal="false">
                <div style="margin-bottom: 20px;"
                     v-if="!dialog.audioRecognitionDialog.result.hasOwnProperty('RequestId')">
                    <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="该条语音尚未进行语义识别！点击进行语义识别！"
                            placement="right"
                    >
                        <el-button type="primary" size="small" :loading="audioRecognitionDialogButtonLoading"
                                   @click="audioRecognition(dialog.audioRecognitionDialog.id)">识别
                        </el-button>
                    </el-tooltip>
                </div>
                <el-descriptions
                        direction="vertical"
                        :column="1"
                        size="small"
                        border
                        v-else
                >
                    <el-descriptions-item label="识别结果">
                        <code class="javaScript">{{dialog.audioRecognitionDialog.result}}</code>
                    </el-descriptions-item>
                    <el-descriptions-item label="分词">
                        <el-button v-for="word in dialog.audioRecognitionDialog.wordList" size="small" round @click="handleCopy(word)">{{word}}</el-button>
                    </el-descriptions-item>
                </el-descriptions>
            </el-dialog>

            <el-dialog title="指令转换" v-model="audioInstructionDialogVisible" width="50%" :close-on-click-modal="false">
                <el-descriptions
                        direction="vertical"
                        :column="1"
                        size="small"
                        border
                >
                    <el-descriptions-item label="指令关键词">
                        <code class="javaScript">{{dialog.audioInstructionDialog.keyword}}</code>
                    </el-descriptions-item>
                    <el-descriptions-item label="控制信息">
                        <code class="javaScript">{{dialog.audioInstructionDialog.content}}</code>
                    </el-descriptions-item>
                </el-descriptions>

                <el-button style="margin-top: 20px;" type="primary" size="small" v-if="dialog.audioInstructionDialog.audio_serial" v-loading="audioInstructionDialogButtonLoading" @click="audioInstructionTest">测试</el-button>

            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="audioPageSize"
                    layout="total, prev, pager, next"
                    :total="totalAudio"
                    @current-change="handleAudioPaginationCurrentClick"
            />

        </el-card>

    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {
        audioRecognitionByAudioId,
        getAudios,
        audioInstructionByAudioId,
        uploadAudioRecognition, audioCommand
    } from "../api/index";
    import EnumHelper from "../utils/enum_helper";
    import TimeHelper from "../utils/time_helper";
    import UrlHelper from "../utils/url_helper";
    import VersatileHelper from "../utils/versatile_helper";
    import MessageHelper from "../utils/message_helper";
    import ObjectHelper from "../utils/object_helper";

    export default {
        name: "audio_recognition_management",

        data() {
            return {
                pageIndex: 0,
                audioPageSize: 0,
                totalAudio: 0,
                audioList: [],

                audioTableLoading: true,
                audioRecognitionDialogButtonLoading: false,
                audioInstructionDialogButtonLoading: false,

                audioUploadDialogVisible: false,
                audioRecognitionDialogVisible: false,
                audioInstructionDialogVisible: false,

                dialog: {
                    audioRecognitionDialog: {
                        result: ""
                    },
                    audioInstructionDialog: {}
                },

                indicator: {
                    audioUploadDialog: {
                        audio: "请上传不大于500KB的MP3音频！"
                    }
                },

                fileList: {
                    testUpload: {
                        tempAudioList: []
                    }
                },

            }
        },

        watch: {
            audioRecognitionDialogVisible() {
                if (!this.audioRecognitionDialogVisible) {
                    this.dialog.audioRecognitionDialog = {
                        result: ""
                    };
                }
            }
        },

        methods: {

            handleAudioUploadDialog() {
                this.audioUploadDialogVisible = true;
            },

            async getAudios() {
                let result = await getAudios(this.pageIndex);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    let data = result.info;
                    this.totalAudio = data.audio_count;
                    this.audioPageSize = data.batch;
                    let audioList = data.audio_data;
                    audioList.forEach((audio) => {
                        audio.time_created = new Date(audio.time_created);
                        audio.time_created_string = TimeHelper.convert_date_to_date_time_string(audio.time_created);
                        audio.time_modified = new Date(audio.time_modified);
                        audio.time_modified_string = TimeHelper.convert_date_to_date_time_string(audio.time_modified);
                        audio.result = JSON.parse(audio.result);
                        audio.url = UrlHelper.parseUrl(audio.url);
                    });
                    this.audioList = audioList;
                    this.audioTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async audioRecognition(audio_id) {
                this.audioRecognitionDialogButtonLoading = true;
                let result = await audioRecognitionByAudioId(audio_id);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(result.message);
                    this.audioRecognitionDialogButtonLoading = false;
                    this.audioRecognitionDialogVisible = false;
                    await this.getAudios();
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async audioInstruction(audio_id) {
                let result = await audioInstructionByAudioId(audio_id);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    this.dialog.audioInstructionDialog = ObjectHelper.cloneObject(result.info);
                    console.log(this.dialog.audioInstructionDialog);
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async audioInstructionTest() {
                this.audioInstructionDialogButtonLoading = true;
                let result = await audioCommand(this.dialog.audioInstructionDialog.audio_serial);
                console.log(result);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(result.info.hardware.message);
                } else {
                    ElMessage.warning(result.info.hardware.message);
                }
                this.audioInstructionDialogButtonLoading = false;
            },

            getWordListFromAudioRecognitionResult(result) {
                let wordList = [];
                result.result.WordList.forEach((word) => {
                    wordList.push(word.Word);
                });
                return wordList;
            },

            handleAudioRecognitionDialog(audio) {
                audio.resultString = JSON.stringify(audio.result);
                this.dialog.audioRecognitionDialog = ObjectHelper.cloneObject(audio);
                if (this.dialog.audioRecognitionDialog.result.hasOwnProperty('RequestId')) {
                    this.dialog.audioRecognitionDialog.wordList = this.getWordListFromAudioRecognitionResult(this.dialog.audioRecognitionDialog);
                }
                this.audioRecognitionDialogVisible = true;
            },

            handleAudioInstructionDialog(audio) {
                this.dialog.audioInstructionDialog = ObjectHelper.cloneObject(audio);
                this.audioInstructionDialogVisible = true;
                this.audioInstruction(audio.id);
            },

            handleAudioDownload(e) {
                window.open(e, '_blank');
            },

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
                    await this.getAudios();
                    this.audioUploadDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleAudioRemove(res, file) {

            },

            handleCopy(e) {
                let result = VersatileHelper.copyContent(e);
                if (result) {
                    ElMessage.success(MessageHelper.copy.success);
                } else {
                    ElMessage.warning(MessageHelper.copy.failed);
                }
            },

            async handleAudioPaginationCurrentClick(current) {
                this.audioTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getAudios();
            }

        },

        created() {
            this.getAudios();
        },

        mounted() {

        }

    }
</script>

<style scoped>

</style>