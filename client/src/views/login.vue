<template>
    <div class="login-wrap">
        <div class="ms-login shadow-filter">
            <div class="ms-title">{{projectName}}</div>
            <el-form :model="params" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="params.username" placeholder="username">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="params.password">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <div style="text-align: center; padding: 10px;">
                    <p class="login-tips">© {{team}} 2022-{{new Date().getFullYear()}}</p>
                    <p class="login-tips" style="font-weight: bold;">{{company}}</p>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {ref, reactive} from "vue";
    import {useStore} from "vuex";
    import {useRouter} from "vue-router";
    import {ElMessage} from "element-plus";
    import {login} from "../api/index";
    import TimeHelper from "../utils/time_helper";
    import EnumHelper from "../utils/enum_helper";
    import URLHelper from "../utils/url_helper";
    import MessageHelper from "../utils/message_helper";
    import Config from "../utils/config"

    export default {
        data() {
            return {
                projectName: Config.PROJECT_NAME,
                company: Config.COMPANY,
                team: Config.TEAM
            }
        },

        setup() {
            const router = useRouter();
            const params = reactive({
                username: "",
                password: "",
            });

            const rules = {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    },
                ]
            };

            const form = ref();

            const submitForm = () => {
                // form.value as login form object
                form.value.validate(async (valid) => {
                    if (valid) {
                        // not empty, send request to login
                        let result = await login({username: params.username, password: params.password});
                        if (result.code === 200) {
                            ElMessage.success(result.message);
                            let userinfo = result.info.userinfo;
                            localStorage.setItem(EnumHelper.localStorageItem.avatar, URLHelper.parseUrl(userinfo.avatar));
                            localStorage.setItem(EnumHelper.localStorageItem.realname, userinfo.realname);
                            localStorage.setItem(EnumHelper.localStorageItem.username, userinfo.username);
                            localStorage.setItem(EnumHelper.localStorageItem.authority, userinfo.authority);
                            localStorage.setItem(EnumHelper.localStorageItem.email, userinfo.email);
                            localStorage.setItem(EnumHelper.localStorageItem.nickname, userinfo.nickname);
                            localStorage.setItem(EnumHelper.localStorageItem.tel, userinfo.tel);
                            localStorage.setItem(EnumHelper.localStorageItem.user_id, userinfo.id);
                            localStorage.setItem(EnumHelper.localStorageItem.token, result.info.token);
                            await router.replace("/");
                        } else {
                            ElMessage.error(result.message);
                            return false;
                        }
                    } else {
                        ElMessage.info();
                        return false;
                    }
                });
            };

            const store = useStore();
            store.commit("clearTags");

            return {
                params: params,
                rules,
                login: form,
                submitForm,
            };
        },

        mounted() {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate", function (e) {
                history.pushState(null, null, document.URL);
            }, false);
            if (localStorage.getItem("token")) {
                const router = useRouter();
                router.replace("/");
            }
        }
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../assets/img/login-bg.png);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        color: #333;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.9);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #333;
    }
</style>