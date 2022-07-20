<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-user"></i> 用户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover">
            <div style="margin-bottom: 20px;">
                <el-button type="primary" size="small" @click="userRegisterDialogVisible = true">新建用户</el-button>
            </div>
            <el-table border :data="userList" style="width: 100%;"
                      v-loading="userTableLoading" size="small">
                <el-table-column align="center" prop="id" label="用户ID" width="100"/>
                <el-table-column align="center" prop="realname" label="真实姓名"/>
                <el-table-column align="center" prop="username" label="用户名"/>
                <el-table-column label="头像" align="center" width="100">
                    <template #default="scope">
                        <el-image class="table-td-thumb shadow-filter" style="border-radius: 50%;"
                                  :src="scope.row.avatar"
                                  :preview-src-list="[scope.row.avatar]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="authority" label="权限"/>
                <el-table-column align="center" prop="nickname" label="昵称"/>
                <el-table-column align="center" prop="tel" label="电话"/>
                <el-table-column align="center" prop="email" label="电子邮箱"/>
                <el-table-column align="center" prop="time_created_string" label="创建时间"/>
                <el-table-column align="center" fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button type="text" size="small" :disabled="!disableOthers(scope.row)" @click="handleUserUpdateDialog(scope.row)">编辑</el-button>
                        <el-button type="text" style="color: red;" size="small"
                                   :disabled="disableOthers(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="新建用户" v-model="userRegisterDialogVisible" width="50%" :close-on-click-modal="false">
                <el-form label-width="100px" :inline="true" size="small">
                    <el-form-item label="用户名">
                        <el-input v-model="dialog.userRegisterDialog.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="dialog.userRegisterDialog.password"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="dialog.userRegisterDialog.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="dialog.userRegisterDialog.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="dialog.userRegisterDialog.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱">
                        <el-input v-model="dialog.userRegisterDialog.email"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="userRegisterDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="userRegisterConfirmDialogVisible = true">确定</el-button>
                    </span>
                </template>

                <el-dialog title="提示" v-model="userRegisterConfirmDialogVisible" width="30%">
                    <span>确定注册用户{{dialog.userRegisterDialog.username}}？</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userRegisterConfirmDialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitUserRegister">确定</el-button>
                        </span>
                    </template>
                </el-dialog>

            </el-dialog>

            <el-dialog title="编辑用户" v-model="userUpdateDialogVisible" width="50%" :close-on-click-modal="false">
                <el-form label-width="100px" :inline="true" size="small">
                    <el-form-item label="用户名">
                        <el-input :disabled="true" v-model="dialog.userUpdateDialog.username"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="dialog.userUpdateDialog.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="dialog.userUpdateDialog.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="dialog.userUpdateDialog.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱">
                        <el-input v-model="dialog.userUpdateDialog.email"></el-input>
                    </el-form-item>
                </el-form>

                <el-form label-width="100px" :inline="true">
                    <el-form-item label="头像">
                        <template #default="scope">
                            <el-upload
                                    list-type="picture-card"
                                    :on-preview="handleAvatarPreview"
                                    :on-change="handleAvatarChange"
                                    :on-remove="handleAvatarRemove"
                                    :file-list="imageList.userUpdateDialog.tempImageList"
                                    :limit="1"
                                    :auto-upload="false"
                                    action="#">
                                <template #default>
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="最多添加1张图片"
                                            placement="top"
                                    >
                                        <i class="el-icon-lx-roundadd"></i>
                                    </el-tooltip>
                                </template>
                            </el-upload>

                            <el-dialog v-model="avatarPreviewDialogVisible" width="30%">
                                <img style="width: 100%" :src="imageList.userUpdateDialog.preview" :preview-src-list="imageList.userUpdateDialog.tempImageList" alt=""/>
                            </el-dialog>

                        </template>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="userUpdateDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="userUpdateConfirmDialogVisible = true">确定</el-button>
                    </span>
                </template>

                <el-dialog title="提示" v-model="userUpdateConfirmDialogVisible" width="30%">
                    <span>确定修改用户信息？</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userUpdateConfirmDialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitUserUpdate">确定</el-button>
                        </span>
                    </template>
                </el-dialog>
                
            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="userPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUser"
                    @current-change="handleUserPaginationCurrentClick"
            />
        </el-card>
    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {getUsers, userFullRegister, userUpdate, uploadAvatar} from "../api/index";
    import TimeHelper from "../utils/time_helper";
    import UrlHelper from "../utils/url_helper";
    import EnumHelper from "../utils/enum_helper";
    import MessageHelper from "../utils/message_helper";
    import VerificationHelper from "../utils/verification_helper";
    import VersatileHelper from "../utils/versatile_helper";
    import ObjectHelper from "../utils/object_helper";
    import {useRouter} from "vue-router";

    export default {
        name: "user_management",

        data() {
            return {
                pageIndex: 0,
                userPageSize: 0,
                totalUser: 0,
                userList: [],

                userTableLoading: true,

                deleteUserEnabled: false,

                userRegisterDialogVisible: false,
                userRegisterConfirmDialogVisible: false,
                userUpdateDialogVisible: false,
                userUpdateConfirmDialogVisible: false,
                avatarPreviewDialogVisible: false,

                dialog: {
                    userRegisterDialog: {
                        username: "",
                        password: "",
                        realname: "",
                        nickname: "",
                        tel: "",
                        email: "",
                    },
                    userUpdateDialog: {
                        username: "",
                        realname: "",
                        nickname: "",
                        tel: "",
                        email: "",
                    }
                },

                imageList: {
                    userUpdateDialog: {
                        tempImageList: [],
                        preview: ""
                    }
                }
            }
        },

        watch: {
            userRegisterDialogVisible() {
                if (!this.userRegisterDialogVisible) {
                    this.userRegisterConfirmDialogVisible = false;
                    this.dialog.userRegisterDialog = {
                        username: "",
                        password: "",
                        realname: "",
                        nickname: "",
                        tel: "",
                        email: "",
                    };
                }
            },

            userUpdateDialogVisible() {
                if (!this.userUpdateDialogVisible) {
                    this.userUpdateConfirmDialogVisible = false;
                    this.dialog.userUpdateDialog = {
                        realname: "",
                        nickname: "",
                        tel: "",
                        email: "",
                    };
                }
            }
        },

        methods: {

            async getUsers() {
                this.userTableLoading = true;
                let result = await getUsers(this.pageIndex);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    let data = result.info;
                    this.totalUser = data.user_count;
                    this.userPageSize = data.batch;
                    let userList = data.user_data;
                    userList.forEach((user) => {
                        user.time_created = new Date(user.time_created);
                        user.time_created_string = TimeHelper.convert_date_to_date_time_string(user.time_created);
                        user.time_modified = new Date(user.time_modified);
                        user.time_modified_string = TimeHelper.convert_date_to_date_time_string(user.time_modified);
                        user.avatar = UrlHelper.parseUrl(user.avatar);
                    });
                    this.userList = userList;
                    this.userTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                    this.userTableLoading = false;
                }
            },

            async register() {
                let result = await userFullRegister(this.dialog.userRegisterDialog);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(result.message);
                    this.userRegisterDialogVisible = false;
                    await this.getUsers();
                } else {
                    ElMessage.warning(result.message);
                    this.userRegisterConfirmDialogVisible = false;
                }
            },

            async update() {
                this.dialog.userUpdateDialog.avatar = UrlHelper.redoUrl(this.dialog.userUpdateDialog.avatar);
                let result = await userUpdate(this.dialog.userUpdateDialog);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(result.message);
                    this.userUpdateDialogVisible = false;
                    if (Number(this.dialog.userUpdateDialog.id) === Number(localStorage.getItem(EnumHelper.localStorageItem.user_id))) {
                        sessionStorage.clear();
                        localStorage.removeItem(EnumHelper.localStorageItem.avatar);
                        localStorage.removeItem(EnumHelper.localStorageItem.username);
                        localStorage.removeItem(EnumHelper.localStorageItem.token);
                        localStorage.removeItem(EnumHelper.localStorageItem.user_id);
                        localStorage.removeItem(EnumHelper.localStorageItem.tel);
                        localStorage.removeItem(EnumHelper.localStorageItem.nickname);
                        localStorage.removeItem(EnumHelper.localStorageItem.email);
                        localStorage.removeItem(EnumHelper.localStorageItem.authority);
                        localStorage.removeItem(EnumHelper.localStorageItem.realname);
                        this.$router.replace("/login");
                    }
                    await this.getUsers();
                } else {
                    ElMessage.warning(result.message);
                    this.userRegisterConfirmDialogVisible = false;
                }
            },

            submitUserRegister() {
                let verificationResult = {
                    username: VerificationHelper.usernameVerification(this.dialog.userRegisterDialog.username),
                    password: VerificationHelper.passwordVerification(this.dialog.userRegisterDialog.password),
                    realname: VerificationHelper.realnameVerification(this.dialog.userRegisterDialog.realname),
                    nickname: VerificationHelper.nicknameVerification(this.dialog.userRegisterDialog.nickname),
                    tel: VerificationHelper.telVerification(this.dialog.userRegisterDialog.tel),
                    email: VerificationHelper.emailVerification(this.dialog.userRegisterDialog.email)
                };
                if (verificationResult.username.has_error) {
                    ElMessage.warning(verificationResult.username.detail);
                    return;
                } else if (verificationResult.password.has_error) {
                    ElMessage.warning(verificationResult.password.detail);
                    return;
                } else if (verificationResult.realname.has_error) {
                    ElMessage.warning(verificationResult.realname.detail);
                    return;
                } else if (verificationResult.nickname.has_error) {
                    ElMessage.warning(verificationResult.nickname.detail);
                    return;
                } else if (verificationResult.tel.has_error) {
                    ElMessage.warning(verificationResult.tel.detail);
                    return;
                } else if (verificationResult.email.has_error) {
                    ElMessage.warning(verificationResult.email.detail);
                    return;
                }
                this.register();
            },

            handleAvatarPreview(e) {
                this.imageList.userUpdateDialog.preview = e.url;
                this.avatarPreviewDialogVisible = true;
            },

            async handleAvatarChange(res, file) {
                let tempFile = res;
                if (tempFile.raw.type !== EnumHelper.imageType.PNG && tempFile.raw.type !== EnumHelper.imageType.JPG && tempFile.raw.type !== EnumHelper.imageType.JPEG) {
                    ElMessage.warning("只能上传png、jpeg或jpg格式的图片！");
                    return;
                }
                if (VersatileHelper.byteToSize(tempFile.raw.size) > 0.5) {
                    ElMessage.warning("图片不能大于500KB！");
                    return;
                }
                let form = new FormData();
                form.append(EnumHelper.formField.avatar, tempFile.raw);
                let result = await uploadAvatar(form);
                if (result.code === EnumHelper.HTTPStatus.OK) {
                    ElMessage.success(MessageHelper.upload.success);
                    let url = result.info.path;
                    console.log(url);
                    file[file.length - 1].url = url;
                    this.imageList.userUpdateDialog.tempImageList.push({
                        url: UrlHelper.parseUrl(url),
                        name: (this.imageList.userUpdateDialog.tempImageList.length + 1).toString()
                    });
                    console.log(this.imageList.userUpdateDialog);
                    this.dialog.userUpdateDialog.avatar = url;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleAvatarRemove(res, file) {
                this.imageList.userUpdateDialog.tempImageList = [];
                for (let i = 0; i < file.length; i++) {
                    this.imageList.userUpdateDialog.tempImageList.push({
                        url: file[i].url,
                        name: (i + 1).toString()
                    });
                }
            },

            submitUserUpdate() {
                let verificationResult = {
                    realname: VerificationHelper.realnameVerification(this.dialog.userUpdateDialog.realname),
                    nickname: VerificationHelper.nicknameVerification(this.dialog.userUpdateDialog.nickname),
                    tel: VerificationHelper.telVerification(this.dialog.userUpdateDialog.tel),
                    email: VerificationHelper.emailVerification(this.dialog.userUpdateDialog.email)
                };
                if (verificationResult.realname.has_error) {
                    ElMessage.warning(verificationResult.realname.detail);
                    return;
                } else if (verificationResult.nickname.has_error) {
                    ElMessage.warning(verificationResult.nickname.detail);
                    return;
                } else if (verificationResult.tel.has_error) {
                    ElMessage.warning(verificationResult.tel.detail);
                    return;
                } else if (verificationResult.email.has_error) {
                    ElMessage.warning(verificationResult.email.detail);
                    return;
                }
                this.update();
            },

            disableOthers(user) {
                return Number(localStorage.getItem(EnumHelper.localStorageItem.user_id)) === Number(user.id);
            },

            handleUserUpdateDialog(user) {
                console.log(user.avatar);
                this.dialog.userUpdateDialog = ObjectHelper.cloneObject(user);
                this.imageList.userUpdateDialog.tempImageList = [{url: user.avatar}];
                this.userUpdateDialogVisible = true;
            },

            handleUserPaginationCurrentClick() {

            }

        },

        created() {
            this.getUsers();
        },

        mounted() {

        }
    }
</script>

<style scoped>

</style>