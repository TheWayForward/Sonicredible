<template>
    <div class="header">
        <div class="collapse-btn" @click="collapseChange">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{projectName}}</div>
        <div class="header-right">
            <div class="header-user-con">
                <div class="user-avatar">
                    <img :src="avatar"/>
                </div>

                <el-dropdown class="user-name" style="margin: 0 15px;" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user">个人中心</el-dropdown-item>
                            <el-dropdown-item divided command="logout">登出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>
        </div>
    </div>
</template>
<script>
    import {computed, onMounted} from "vue";
    import {useStore} from "vuex";
    import {useRouter} from "vue-router";
    import Config from "../utils/config";
    import EnumHelper from "../utils/enum_helper";

    export default {
        setup() {
            const projectName = Config.PROJECT_NAME;
            const username = localStorage.getItem(EnumHelper.localStorageItem.username);
            const avatar = localStorage.getItem(EnumHelper.localStorageItem.avatar);
            const store = useStore();
            const collapse = computed(() => store.state.collapse);

            const collapseChange = () => {
                store.commit("handleCollapse", !collapse.value);
            };

            onMounted(() => {
                if (document.body.clientWidth < 1500) {
                    collapseChange();
                }
            });

            const router = useRouter();
            const handleCommand = (command) => {
                if (command === "logout") {
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
                    router.replace("/login");
                } else if (command === "user") {
                    router.push("/user");
                }
            };

            return {
                username,
                avatar,
                projectName,
                collapse,
                collapseChange: collapseChange,
                handleCommand
            };
        },
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 15px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avatar {
        margin-left: 20px;
    }

    .user-avatar img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
