<template>
    <div>
        <el-card shadow="hover">

        </el-card>
    </div>
</template>

<script>
    import Schart from "vue-schart";
    import {Line} from '@antv/g2plot';
    import {reactive, ref} from "vue";
    import TimeHelper from "../utils/time_helper";
    import VersatileHelper from "../utils/versatile_helper";
    import {getUsers} from "../api/index";

    export default {
        name: "dashboard",
        data() {
            return {
                username: "...",
                lastLogin: "...",
                level: null,
                role: "",
                lineChartObject: null,
                activeName: ref("first"),
                message: ref("first"),
            }
        },
        components: {Schart},
        methods: {
        },

        created() {

        },

        mounted() {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate",function(e) {
                history.pushState(null, null, document.URL);
            }, false);
        }

    };
</script>

<style scoped>


    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
    }

    .user-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .scrollbar-demo-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        margin: 10px;
        text-align: center;
        border-radius: 4px;
        background: gainsboro;
        color: gray;
    }
</style>
