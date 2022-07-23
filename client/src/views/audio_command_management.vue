<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-mic"></i> 音频管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>音频指令管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover">
            <div style="margin-bottom: 20px;">
                <el-button type="primary" size="small" @click="handleCommandRegisterDialog">新建指令</el-button>
            </div>

            <el-table border :data="commandList" style="width: 100%;"
                      v-loading="commandTableLoading" size="small">
                <el-table-column align="center" prop="id" label="指令ID" width="100"/>
                <el-table-column align="center" prop="keyword" label="关键词"/>
                <el-table-column align="center" prop="time_created_string" label="创建时间"/>
                <el-table-column align="center" prop="time_modified_string" label="修改时间"/>
                <el-table-column align="center" fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="handleCommandUpdateDialog(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" :disabled="scope.row.is_valid" @click="enableCommand({command: scope.row, enable: true})">启用</el-button>
                        <el-button type="text" size="small" :disabled="!scope.row.is_valid" @click="enableCommand({command: scope.row, enable: false})">停用</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-dialog title="新建指令" v-model="commandRegisterDialogVisible" width="50%" :close-on-click-modal="false">
                <el-form label-width="100px" size="small">
                    <el-form-item label="关键词">
                        <el-input v-model="dialog.commandRegisterDialog.keyword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="indicator.commandRegisterDialog.keyword"
                                placement="right"
                        >
                            <i class="el-icon-lx-info"></i>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="2"
                                  v-model="dialog.commandRegisterDialog.description"></el-input>
                    </el-form-item>
                    <el-form-item label="控制信息">
                        <codemirror v-model="dialog.commandRegisterDialog.content"
                                    placeholder="JSON with param replaced by ?"
                                    style="height: 200px;"
                                    :autofocus="true"
                                    :indent-with-tab="true"
                                    :tab-size="4"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="indicator.commandRegisterDialog.content"
                                placement="right"
                        >
                            <i class="el-icon-lx-info"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="commandRegisterDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="commandRegisterConfirmDialogVisible = true">确定</el-button>
                    </span>
                </template>

                <el-dialog title="提示" v-model="commandRegisterConfirmDialogVisible" width="30%">
                    <span>确定注册指令？</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="commandRegisterConfirmDialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitCommandRegister">确定</el-button>
                        </span>
                    </template>
                </el-dialog>

            </el-dialog>

            <el-dialog title="编辑指令" v-model="commandUpdateDialogVisible" width="50%" :close-on-click-modal="false">
                <codemirror v-if="commandUpdateDialogVisible"
                            v-model="dialog.commandUpdateDialog.content"
                            placeholder="Code goes here..."
                            style="height: 200px;"
                            :autofocus="true"
                            :indent-with-tab="false"
                            :tab-size="2"
                />
            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="commandPageSize"
                    layout="total, prev, pager, next"
                    :total="totalCommand"
                    @current-change="handleCommandPaginationCurrentClick"
            />

        </el-card>

    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {Codemirror} from "vue-codemirror";
    import VersatileHelper from "../utils/versatile_helper";
    import {getCommands, commandRegister, commandUpdate} from "../api/index";
    import MessageHelper from "../utils/message_helper";
    import UrlHelper from "../utils/url_helper";
    import TimeHelper from "../utils/time_helper";
    import ObjectHelper from "../utils/object_helper";
    import EnumHelper from "../utils/enum_helper";
    import VerificationHelper from "../utils/verification_helper";

    export default {
        name: "audio_command_management",

        components: {
            Codemirror
        },

        data() {
            return {
                pageIndex: 0,
                commandPageSize: 0,
                totalCommand: 0,
                commandList: [],

                commandTableLoading: false,

                code: "let a = 1;",

                commandRegisterDialogVisible: false,
                commandRegisterConfirmDialogVisible: false,
                commandUpdateDialogVisible: false,

                indicator: {
                    commandRegisterDialog: {
                        keyword: "指令关键词：系统从语义识别结果匹配指令的重要依据，唯一，如“调整LED亮度”",
                        content: "指令控制信息：JSON对象，含有控制外设（device）与参数两个字段，参数位置以英文“?”指明，如{\"device\": \"LED\", \"brightness\": ?}"
                    }
                },

                dialog: {
                    commandRegisterDialog: {
                        keyword: "",
                        description: "",
                        content: "",
                    },
                    commandUpdateDialog: {},
                }
            }
        },

        watch: {
            commandRegisterDialogVisible() {
                if (!this.commandRegisterDialogVisible) {
                    this.commandRegisterConfirmDialogVisible = false;
                    this.dialog.commandRegisterDialog = {
                        keyword: "",
                        description: "",
                        content: "",
                    };
                }
            }
        },

        methods: {

            async getCommands() {
                this.commandTableLoading = true;
                let result = await getCommands(this.pageIndex);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    let data = result.info;
                    this.totalCommand = data.command_count;
                    this.commandPageSize = data.batch;
                    let commandList = data.command_data;
                    commandList.forEach((command) => {
                        command.time_created = new Date(command.time_created);
                        command.time_created_string = TimeHelper.convert_date_to_date_time_string(command.time_created);
                        command.time_modified = new Date(command.time_modified);
                        command.time_modified_string = TimeHelper.convert_date_to_date_time_string(command.time_modified);
                    });
                    this.commandList = commandList;
                    console.log(this.commandList);
                    this.commandTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                    this.commandTableLoading = false;
                }
            },

            async register() {
                let result = await commandRegister(this.dialog.commandRegisterDialog);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(result.message);
                    this.commandRegisterDialogVisible = false;
                    await this.getCommands();
                } else {
                    ElMessage.warning(result.message);
                    this.commandRegisterDialogVisible = false;
                }
            },

            async enableCommand(e) {
                let command_id = e.command.id;
                if (e.enable) {
                    ElMessage.success("")
                } else {
                    ElMessage.error("")
                }
            },

            async update() {

            },

            handleCommandRegisterDialog() {
                this.commandRegisterDialogVisible = true;
            },

            submitCommandRegister() {
                if (this.dialog.commandRegisterDialog.keyword === "" || VerificationHelper.constainsSpace(this.dialog.commandRegisterDialog.keyword)) {
                    ElMessage.warning("关键词格式错误！");
                    this.commandRegisterConfirmDialogVisible = false;
                    return;
                }
                if (this.dialog.commandRegisterDialog.description.length >= 200) {
                    ElMessage.warning("指令描述过长！");
                    this.commandRegisterConfirmDialogVisible = false;
                    return;
                }
                if (VerificationHelper.jsonStringWithParamVerification(this.dialog.commandRegisterDialog.content).has_error) {
                    ElMessage.warning(VerificationHelper.jsonStringWithParamVerification(this.dialog.commandRegisterDialog.content).detail);
                    this.commandRegisterConfirmDialogVisible = false;
                    return;
                }
                this.register();
            },

            handleCommandUpdateDialog(command) {
                this.dialog.commandUpdateDialog = ObjectHelper.cloneObject(command);
                this.commandUpdateDialogVisible = true;
                this.$forceUpdate();
            },

            async handleCommandPaginationCurrentClick(current) {
                this.commandTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getCommands();
            }
        },

        created() {
            this.getCommands();
        },

        mounted() {

        }
    }
</script>

<style scoped>

    .el-textarea .el-textarea__inner {
        resize: none;
    }

</style>