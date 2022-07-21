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
                        <el-button type="text" size="small" :disabled="scope.row.is_valid">启用</el-button>
                        <el-button type="text" size="small" :disabled="!scope.row.is_valid">停用</el-button>
                    </template>
                </el-table-column>
            </el-table>



            <el-dialog title="新建指令" v-model="commandRegisterDialogVisible" width="50%" :close-on-click-modal="false">

            </el-dialog>

            <el-dialog title="编辑指令" v-model="commandUpdateDialogVisible" width="50%" :close-on-click-modal="false">
                <codemirror v-if="commandUpdateDialogVisible"
                        v-model="dialog.commandUpdateDialog.content"
                        placeholder="Code goes here..."
                        style="height: 200px;"
                        :autofocus="true"
                        :indent-with-tab="true"
                        :tab-size="4"
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
    import {getCommands, getUsers} from "../api/index";
    import MessageHelper from "../utils/message_helper";
    import UrlHelper from "../utils/url_helper";
    import TimeHelper from "../utils/time_helper";
    import ObjectHelper from "../utils/object_helper";
    import EnumHelper from "../utils/enum_helper";

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
                commandUpdateDialogVisible: false,

                dialog: {
                    commandRegisterDialog: {},
                    commandUpdateDialog: {
                    },
                }
            }
        },

        watch: {

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
            
            handleCommandRegisterDialog() {

                this.commandRegisterDialogVisible = true;
            },

            handleCommandUpdateDialog(command) {
                this.dialog.commandUpdateDialog = ObjectHelper.cloneObject(command);
                this.commandUpdateDialogVisible = true;
                this.$forceUpdate();
            },

            handleCommandPaginationCurrentClick() {

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

</style>