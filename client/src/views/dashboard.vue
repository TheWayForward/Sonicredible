<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">

                <!-- admin info card -->
                <el-card shadow="hover" class="mgb20">
                    <div class="user-info">
                        <img src="../assets/img/img.jpg" class="user-avatar shadow" alt/>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ username }}</div>
                            <div>{{ role }}</div>
                        </div>

                    </div>
                    <div style="display: flex;">
                        <el-tag style="margin-right: 20px;">上次登录：{{lastLogin}}</el-tag>
                    </div>
                </el-card>

                <!-- data sum card -->
                <el-card shadow="hover" id="chart_card" v-loading="chartLoading">
                    <div class="card-header">
                        <span style="font-weight: bold;">本周数据概览</span>
                        <el-button class="button" type="text">
                            <i class="el-icon-lx-refresh hover-rotate" style="font-size: 20px;"/>
                        </el-button>
                    </div>
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <!-- sum data chart -->
                        <el-tab-pane label="访问" name="first" lazy>
                            <div id="view_chart" v-show="true"></div>
                        </el-tab-pane>
                        <el-tab-pane label="订单" name="second" lazy>
                            <div id="order_chart" v-show="true"></div>
                        </el-tab-pane>
                        <el-tab-pane label="收入" name="third" lazy>
                            <div id="income_chart" v-show="true"></div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>

            <el-col :span="16">

                <!-- work order card -->
                <el-card shadow="hover" style="height: 754px;">
                    <div class="card-header">
                        <span style="font-weight: bold;">工单</span>
                        <el-button class="button" type="text">
                            <i class="el-icon-lx-refresh hover-rotate" style="font-size: 20px;"/>
                        </el-button>
                    </div>
                    <el-tabs v-model="message">
                        <el-tab-pane :label="`订单（${workOrder.order.length}）`" name="first">
                            <el-scrollbar height="553px" style="margin-bottom: 20px;">
                                <el-table :data="workOrder.order" :show-header="false" style="width: 100%">
                                    <el-table-column>
                                        <template #default="scope">
                                            <span class="message-title">{{scope.row.title}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="date" width="180"></el-table-column>
                                    <el-table-column width="120">
                                        <template #default="scope">
                                            <el-button size="small" @click="handleRead(scope.$index)">处理</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-scrollbar>

                            <div class="handle-row">
                                <el-pagination background layout="prev, pager, next" :total="1000" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="`商品（${workOrder.item.length}）`" name="second">
                            <el-scrollbar height="553px" style="margin-bottom: 20px;">
                                <el-table :data="workOrder.item" :show-header="false" style="width: 100%">
                                    <el-table-column>
                                        <template #default="scope">
                                            <span class="message-title">{{scope.row.title}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="date" width="180"></el-table-column>
                                    <el-table-column width="120">
                                        <template #default="scope">
                                            <el-button size="small" @click="handleRead(scope.$index)">处理</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-scrollbar>

                            <div class="handle-row">
                                <el-pagination background layout="prev, pager, next" :total="1000" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="`内容（${workOrder.content.length}）`" name="third">
                            <el-scrollbar height="553px" style="margin-bottom: 20px;">
                                <el-table :data="workOrder.content" :show-header="false" style="width: 100%">
                                    <el-table-column>
                                        <template #default="scope">
                                            <span class="message-title">{{scope.row.title}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="date" width="180"></el-table-column>
                                    <el-table-column width="120">
                                        <template #default="scope">
                                            <el-button size="small" @click="handleRead(scope.$index)">处理</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-scrollbar>

                            <div class="handle-row">
                                <el-pagination background layout="prev, pager, next" :total="1000" />
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from "vue-schart";
    import {Line} from '@antv/g2plot';
    import {reactive, ref} from "vue";
    import {computed} from "@vue/reactivity";
    import * as echarts from "echarts";
    import {getDashboardGraphData} from "../api/index";
    import TimeHelper from "../utils/time_helper";
    import VersatileHelper from "../utils/versatile_helper";

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
                chartLoading: true,
                userOrderGraphData: [],
                workOrder: {
                    order: [
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },{
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                        {
                            date: "2018-04-19 21:00:00",
                            title: "今晚12点整发大红包，先到先得",
                        },
                    ],
                    item: [
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                    ],
                    content: [
                        {
                            date: "2018-04-19 20:00:00",
                            title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                        },
                    ],
                }
            }
        },
        components: {Schart},
        methods: {
            // handle chart click, render when click
            async handleClick(tab, event) {
                this.chartLoading = true;
                await this.getGraphData();
                if (this.lineChartObject !== null) this.lineChartObject.destroy();
                switch (tab.props.name) {
                    case "first":
                        this.renderViewChart();
                        return;
                    case "second":
                        this.renderUserOrderChart();
                        return;
                    case "third":
                        this.renderIncomeChart();
                        return;
                }
            },
            handleRead(index) {
                const item = state.unread.splice(index, 1);
                console.log(item);
                state.read = item.concat(state.read);
            },
            handleDel(index) {
                const item = state.read.splice(index, 1);
                state.recycle = item.concat(state.recycle);
            },
            handleRestore(index) {
                const item = state.recycle.splice(index, 1);
                state.read = item.concat(state.read);
            },

            async getGraphData() {
                let result = await getDashboardGraphData();
                let timestampList = TimeHelper.generate_week_string_array();
                if (result.code === 200) {
                    // generate view graph data

                    // generate user order & income graph data
                    let userOrderTimestampList = VersatileHelper.clone_object(timestampList);
                    let user_order = result.info.user_order;
                    for (let i = 0; i < user_order.length; i++) {
                        user_order[i].time_created = new Date(user_order[i].time_created);
                        user_order[i].time_created_string = TimeHelper.convert_date_to_short_date_string(user_order[i].time_created);
                        for (let j = 0; j < userOrderTimestampList.length; j++) {
                            if (userOrderTimestampList[j].timestamp === user_order[i].time_created_string) {
                                userOrderTimestampList[j].value++;
                                userOrderTimestampList[j].payment += user_order[i].payment;
                                break;
                            }
                        }
                    }
                    this.userOrderGraphData = userOrderTimestampList;
                }
            },

            renderViewChart() {
                const data = [
                    {year: '1991', value: 3},
                    {year: '1992', value: 4},
                    {year: '1993', value: 3.5},
                    {year: '1994', value: 5},
                    {year: '1995', value: 4.9},
                    {year: '1996', value: 6},
                    {year: '1997', value: 7},
                    {year: '1998', value: 9},
                    {year: '1999', value: 100},
                ];
                setTimeout(() => {
                    this.lineChartObject = new Line("view_chart", {
                        data,
                        xField: 'year',
                        yField: 'value',
                        smooth: true
                    });
                    this.lineChartObject.render();
                    this.chartLoading = false;
                }, 250);
            },

            renderUserOrderChart() {
                const data = this.userOrderGraphData;
                setTimeout(() => {
                    this.lineChartObject = new Line("order_chart", {
                        data,
                        xField: 'timestamp',
                        yField: 'value',
                        smooth: true
                    });
                    this.lineChartObject.render();
                    this.chartLoading = false;
                }, 250);
            },

            renderIncomeChart() {
                const data = this.userOrderGraphData;
                setTimeout(() => {
                    this.lineChartObject = new Line("income_chart", {
                        data,
                        xField: 'timestamp',
                        yField: 'payment',
                        smooth: true
                    });
                    this.lineChartObject.render();
                    this.chartLoading = false;
                }, 250);
            },
        },

        created() {
            this.username = localStorage.getItem("username");
            this.level = parseInt(localStorage.getItem("level"));
            this.lastLogin = localStorage.getItem("last_login");
            this.role = this.level === 1 ? "超级管理员" : "管理员";
            this.getGraphData();
        },
        mounted() {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate",function(e) {
                history.pushState(null, null, document.URL);
            }, false);
            this.renderViewChart();
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
