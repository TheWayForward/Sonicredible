<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>已发货</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- sent -->
        <el-card shadow="hover" style="margin-bottom: 20px;">
            <el-table :data="userOrderSentData" style="width: 100%; margin-top: 20px;"
                      v-loading="userOrderSentTableLoading">
                <el-table-column align="center" prop="serial" label="订单号" width="180"/>
                <el-table-column prop="name" align="center" label="承运人" width="100">
                    <template #default="scope">
                        <el-image
                                v-if="scope.row.logistics_company_name === StatusHelper.logistics_company_type_name.jd"
                                class="table-td-thumb"
                                :src="staticImage.jd_image">
                        </el-image>
                        <el-image
                                v-if="scope.row.logistics_company_name === StatusHelper.logistics_company_type_name.sf"
                                class="table-td-thumb"
                                :src="staticImage.sf_image">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运单号" width="180">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small"
                                       @click="handleUserOrderSentUserShippingSerialClick({user_shipping_serial: scope.row.user_shipping_serial})">
                                {{scope.row.user_shipping_serial}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="payment_time_string" label="付款时间" width="180">
                    <template #default="scope">
                        <el-tag>{{scope.row.payment_time_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="payment_time_string" label="发货时间" width="180">
                    <template #default="scope">
                        <el-tag>{{scope.row.time_created_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收货地址" width="180">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                :content="scope.row.address"
                                placement="top"
                        >
                            <el-button size="small"
                                       @click="handleUserOrderSentAddressClick({address: scope.row.address})">
                                {{scope.row.address.slice(0, 10) + '...'}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="买家" width="100">
                    <template #default="scope">
                        <el-tag>{{scope.row.nickname}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收货人姓名" width="150">
                    <template #default="scope">
                        <el-tag>{{scope.row.shipping_name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="电话" width="150">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button size="small" @click="handleUserOrderSentTelClick({tel: scope.row.tel})">
                                {{scope.row.tel}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="250">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="查看订单包含的物品"
                                placement="top"
                        >
                            <el-button type="text" size="medium"
                                       @click="handleUserOrderSentDetailDialog({order: scope.row})">
                                订单详情
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="查看运单物流进度"
                                placement="top"
                        >
                            <el-button type="text" size="medium"
                                       @click="handleUserOrderSentTrackDialog({order: scope.row})">
                                物流追踪
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="以管理员身份确认收货，请谨慎操作"
                                placement="left"
                        >
                            <el-button type="text" size="medium" style="color: red;"
                                       @click="handleUserOrderSentCompleteDialog({order: scope.row})">
                                确认收货
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="订单详情" v-model="userOrderSentDetailDialogVisible" width="80%">

                <!-- order content -->
                <el-card shadow="hover">
                    <div class="card-header">
                        <span>商品</span>
                    </div>
                    <el-scrollbar height="200px">
                        <el-table :data="currentUserOrderItemsData" style="width: 100%; margin-top: 20px;"
                                  v-loading="currentUserOrderItemsTableLoading">
                            <el-table-column prop="product_name" label="商品名称" width="400"/>
                            <el-table-column label="封面" align="center" width="100">
                                <template #default="scope">
                                    <el-image class="table-td-thumb shadow-filter" :src="scope.row.product_image"
                                              :preview-src-list="[scope.row.product_image]">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售时单位" align="center">
                                <template #default="scope">
                                    <el-tag>{{scope.row.sku}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售时单价" align="center">
                                <template #default="scope">
                                    <el-tag type="success">￥{{scope.row.sku_price.toFixed(2)}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="数量" align="center">
                                <template #default="scope">
                                    {{scope.row.quantity}}
                                </template>
                            </el-table-column>
                            <el-table-column label="总价" align="center">
                                <template #default="scope">
                                    <el-tag>￥{{(scope.row.sku_price * scope.row.quantity).toFixed(2)}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </el-card>

                <!-- total -->
                <el-card shadow="hover" style="margin-top: 20px;">
                    <div class="card-header">
                        <span>合计</span>
                    </div>
                    <el-descriptions style="margin-top: 20px;" border>
                        <el-descriptions-item label="商品总数">{{currentUserOrderData.quantity}}</el-descriptions-item>
                        <el-descriptions-item label="商品总价">￥{{currentUserOrderData.payment.toFixed(2)}}
                        </el-descriptions-item>
                        <el-descriptions-item label="运费">￥{{currentUserOrderData.postage.toFixed(2)}}
                        </el-descriptions-item>
                        <el-descriptions-item label="订单总价">￥{{(currentUserOrderData.payment +
                            currentUserOrderData.postage).toFixed(2)}}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-card>
            </el-dialog>

            <el-dialog title="物流追踪" v-model="userOrderSentTrackDialogVisible" width="80%">
                <el-card shadow="hover">
                    <div class="card-header">
                        <span>承运人：{{currentUserOrderData.logistics_company_name}}（{{currentUserOrderData.user_shipping_serial}}）</span>
                    </div>
                    <el-scrollbar height="400px" style="padding: 20px;" v-loading="userOrderSentTrackTimelineLoading">
                        <el-timeline style="padding-left: 5px">
                            <el-timeline-item
                                    v-for="(progress, index) in currentUserOrderTrackData.data"
                                    :key="index"
                                    type="primary"
                                    :hollow="true"
                                    :timestamp="progress.ftime"
                            >
                                {{ progress.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </el-scrollbar>
                </el-card>
            </el-dialog>

            <el-dialog v-model="userOrderSentCompleteDialogVisible" width="30%" title="提示">
                <p>您正在以管理员身份完成订单！</p>
                <p>请确保用户已收货，再确认操作！</p>
                <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userOrderSentCompleteDialogVisible = false">取消</el-button>
                            <el-button type="danger" @click="submitUpdateUserOrderSent" :disabled="confirmSubmitUpdateUserOrderSent">确定</el-button>
                        </span>
                </template>
            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="userOrderSentPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUserOrderSent"
                    @current-change="handleUserOrderSentPaginationCurrentClick"
            />
        </el-card>
    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {getLogisticsCompany, getTrackData, getUserOrder, getUserOrderItemByOrderId, updateUserOrder} from "../api";
    import VersatileHelper from "../utils/versatile_helper";
    import TimeHelper from "../utils/time_helper";
    import StatusHelper from "../utils/status_helper";
    import jd_image from "../assets/img/jd.png";
    import sf_image from "../assets/img/sf.png";

    export default {
        name: "order_closed",
        data() {
            return {
                pageIndex: 0,
                userOrderSentData: [],
                userOrderSentPageSize: 0,
                totalUserOrderSentPage: 0,
                totalUserOrderSent: 0,
                userOrderSentTableLoading: true,
                userOrderSentDetailDialogVisible: false,
                userOrderSentTrackDialogVisible: false,
                userOrderSentTrackTimelineLoading: false,
                userOrderSentCompleteDialogVisible: false,
                confirmSubmitUpdateUserOrderSent: false,

                currentUserOrderData: {},
                currentUserOrderItemsData: [],
                currentUserOrderItemsTableLoading: false,
                currentUserOrderTrackData: {
                    "message": "ok",
                    "nu": "JDVA11630320613",
                    "ischeck": "1",
                    "condition": "F00",
                    "com": "jd",
                    "status": "200",
                    "state": "3",
                    "data": []
                },

                staticImage: {
                    jd_image: jd_image,
                    sf_image: sf_image
                },

                StatusHelper: StatusHelper
            }
        },
        watch: {
            userOrderClosedDetailDialogVisible() {

            },

            userOrderSentTrackDialogVisible() {
                if (!this.userOrderClosedDetailDialogVisible) {
                    this.currentUserOrderTrackData.data = [];
                }
            }
        },
        methods: {
            async getUserOrderSent() {
                this.userOrderSentTableLoading = true;
                let result = await getUserOrder(StatusHelper.user_order_status.sent, this.pageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalOrder = result.info.total_user_order_sent;
                    for (let i = 0; i < data.length; i++) {
                        data[i].logistics_company_params = JSON.parse(data[i].logistics_company_params);
                        data[i].payment_time = new Date(data[i].payment_time);
                        data[i].payment_time_string = TimeHelper.convert_date_to_date_time_string(data[i].payment_time);
                        data[i].time_created = new Date(data[i].time_created);
                        data[i].time_created_string = TimeHelper.convert_date_to_date_time_string(data[i].time_created);
                    }
                    this.userOrderSentPageSize = pageSize;
                    this.totalUserOrderSentPage = totalPage;
                    this.totalUserOrderSent = totalOrder;
                    this.userOrderSentData = VersatileHelper.clone_object(data);
                    this.userOrderSentTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUserOrderSentUserShippingSerialClick(e) {
                let result = VersatileHelper.copy_content(e.user_shipping_serial);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderSentAddressClick(e) {
                let result = VersatileHelper.copy_content(e.address);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderSentTelClick(e) {
                let result = VersatileHelper.copy_content(e.tel);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderSentDetailDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderSentDetailDialogVisible = true;
                this.getUserOrderItemByOrderId(this.currentUserOrderData.user_order_id);
            },

            handleUserOrderSentTrackDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderSentTrackDialogVisible = true;
                this.userOrderSentTrackTimelineLoading = true;
                this.getTrackData();

            },

            handleUserOrderSentCompleteDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderSentCompleteDialogVisible = true;
            },

            submitUpdateUserOrderSent() {
                this.completeUserOrder();
            },

            async getUserOrderItemByOrderId(order_id) {
                this.currentUserOrderItemsTableLoading = true;
                let result = await getUserOrderItemByOrderId(order_id);
                if (result.code === 200) {
                    let data = result.info;
                    let quantity = 0;
                    for (let i = 0; i < data.length; i++) {
                        data[i].product_image = VersatileHelper.parse_url(data[i].product_image);
                        quantity += data[i].quantity;
                    }
                    this.currentUserOrderItemsData = data;
                    this.currentUserOrderData.quantity = quantity;
                    this.currentUserOrderItemsTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                    this.currentUserOrderItemsTableLoading = false;
                }
            },

            async getTrackData() {
                let result = await getTrackData(this.currentUserOrderData.logistics_company_params.code, this.currentUserOrderData.user_shipping_serial, this.currentUserOrderData.tel);
                if (result.code === 200) {
                    console.log(result.info);
                    this.currentUserOrderTrackData = VersatileHelper.clone_object(result.info);
                    this.userOrderSentTrackTimelineLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async completeUserOrder() {
                this.confirmSubmitUpdateUserOrderSent = true;
                let result = await updateUserOrder({
                    current_type: StatusHelper.user_order_status.sent,
                    target_type: StatusHelper.user_order_status.completed,
                    admin_id: localStorage.getItem("user_id"),
                    order_id: this.currentUserOrderData.user_order_id
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    this.clearAll();
                    await this.getUserOrderSent();
                    this.userOrderSentCompleteDialogVisible = false;
                    this.confirmSubmitUpdateUserOrderSent = false;
                } else {
                    ElMessage.warning(result.message);
                    this.userOrderSentCompleteDialogVisible = false;
                    setTimeout(() => {
                        this.confirmSubmitUpdateUserOrderSent = false;
                    }, 1000);
                }
            },

            clearAll() {
                this.currentUserOrderData = {};
            },

            async handleUserOrderSentPaginationCurrentClick(current) {
                this.userOrderSentTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getUserOrderSent();
            }
        },
        created() {

        },
        mounted() {
            this.getUserOrderSent();
        }
    };
</script>

<style scoped>

</style>