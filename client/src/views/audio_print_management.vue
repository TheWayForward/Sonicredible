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
            <div style="margin-bottom: 20px;">
                <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="indicator.voiceprintRegisterButton"
                        placement="right"
                >
                <el-button type="primary" size="small" @click="handleVoiceprintRegisterDialog">注册/更新声纹</el-button>
                </el-tooltip>
            </div>

            <el-divider />

            <el-table border :data="voiceprintList" style="width: 100%;"
                      v-loading="voiceprintTableLoading" size="small">
                <el-table-column align="center" prop="id" label="声纹ID" width="100"/>
                <el-table-column align="center" prop="user_id" label="用户ID" width="100"/>
                <el-table-column label="路径" align="center">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small" @click="handleCopy(scope.row.url)">
                                {{scope.row.url}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="time_created_string" label="创建时间" width="180"/>
                <el-table-column align="center" prop="time_modified_string" label="修改时间" width="180"/>
                <el-table-column align="center" fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="handleAudioDownload(scope.row.url)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="注册/更新声纹" v-model="voiceprintRegisterDialogVisible" width="50%" :close-on-click-modal="false">

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
                                        :content="indicator.voiceprintRegisterDialog.voiceprint"
                                        placement="bottom"
                                >
                                    <i class="el-icon-lx-roundadd" style="font-size: 50px; margin-top: 60px;"></i>
                                </el-tooltip>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>

                <!--                <template #footer>-->
                <!--                    <span class="dialog-footer">-->
                <!--                        <el-button @click="voiceprintRegisterDialogVisible = false">取消</el-button>-->
                <!--                        <el-button type="primary" @click="voiceprintRegisterComfirmDialogVisible = true">确定</el-button>-->
                <!--                    </span>-->
                <!--                </template>-->

                <el-dialog title="提示" v-model="voiceprintRegisterComfirmDialogVisible" width="30%">
                    <span>确定注册声纹？</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="voiceprintRegisterComfirmDialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitVoiceprintRegister">确定</el-button>
                        </span>
                    </template>
                </el-dialog>

            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="voiceprintPageSize"
                    layout="total, prev, pager, next"
                    :total="totalVoiceprint"
                    @current-change="handleVoiceprintPaginationCurrentClick"
            />

        </el-card>
    </div>
</template>

<script>
    import EnumHelper from "../utils/enum_helper";
    import {ElMessage} from "element-plus";
    import VersatileHelper from "../utils/versatile_helper";
    import {getVoiceprints, uploadVoiceprint} from "../api/index";
    import MessageHelper from "../utils/message_helper";
    import UrlHelper from "../utils/url_helper";
    import TimeHelper from "../utils/time_helper";

    export default {
        name: "audio_print_management",

        data() {
            return {
                pageIndex: 0,
                voiceprintPageSize: 0,
                totalVoiceprint: 0,
                voiceprintList: [],

                voiceprintTableLoading: true,

                voiceprintRegisterDialogVisible: false,
                voiceprintRegisterComfirmDialogVisible: false,

                fileList: {
                    testUpload: {
                        tempAudioList: []
                    }
                },

                dialog: {
                    voiceprintRegisterDialog: {
                        voiceprint: ""
                    }
                },

                indicator: {
                    voiceprintRegisterButton: `注册或更新您的声纹（当前用户：${localStorage.getItem(EnumHelper.localStorageItem.username)}，${localStorage.getItem(EnumHelper.localStorageItem.realname)}）`,
                    voiceprintRegisterDialog: {
                        voiceprint: "请上传不大于500KB的MP3音频！"
                    }
                }
            }
        },

        watch: {
            voiceprintRegisterDialogVisible() {
                if (!this.voiceprintRegisterDialogVisible) {
                    this.fileList = {
                        testUpload: {
                            tempAudioList: []
                        }
                    }
                }
            }
        },

        methods: {

            async getVoiceprints() {
                this.voiceprintTableLoading = true;
                let result = await getVoiceprints(this.pageIndex);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    let data = result.info;
                    this.totalVoiceprint = data.voiceprint_count;
                    this.voiceprintPageSize = data.batch;
                    let voiceprintList = data.voiceprint_data;
                    voiceprintList.forEach((voiceprint) => {
                        voiceprint.time_created = new Date(voiceprint.time_created);
                        voiceprint.time_created_string = TimeHelper.convert_date_to_date_time_string(voiceprint.time_created);
                        voiceprint.time_modified = new Date(voiceprint.time_modified);
                        voiceprint.time_modified_string = TimeHelper.convert_date_to_date_time_string(voiceprint.time_modified);
                        voiceprint.url = UrlHelper.parseUrl(voiceprint.url);
                    });
                    this.voiceprintList = voiceprintList;
                    console.log(this.voiceprintList);
                    this.voiceprintTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                    this.voiceprintTableLoading = false;
                }
            },

            handleVoiceprintRegisterDialog() {
                this.voiceprintRegisterDialogVisible = true;
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
                let result = await uploadVoiceprint(form);
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
                    await this.getVoiceprints();
                    this.voiceprintRegisterDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleAudioRemove(res, file) {

            },

            submitVoiceprintRegister() {

            },

            handleCopy(e) {
                let result = VersatileHelper.copyContent(e);
                if (result) {
                    ElMessage.success(MessageHelper.copy.success);
                } else {
                    ElMessage.warning(MessageHelper.copy.failed);
                }
            },

            handleAudioDownload(e) {
                window.open(e, '_blank');
            },

            async handleVoiceprintPaginationCurrentClick(current) {
                this.voiceprintTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getVoiceprints();
            }

        },

        created() {
            this.getVoiceprints();
        }

    }
</script>

<style scoped>

</style>