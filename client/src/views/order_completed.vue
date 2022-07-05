<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>已完成</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover" style="margin-bottom: 20px;">
            <el-table :data="userOrderCompletedData" style="width: 100%; margin-top: 20px;"
                      v-loading="userOrderCompletedTableLoading">
                <el-table-column align="center" prop="serial" label="订单号" width="180"/>
                <el-table-column align="center" prop="payment_time_string" label="付款时间" width="180">
                    <template #default="scope">
                        <el-tag>{{scope.row.payment_time_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="send_time_string" label="发货时间" width="180">
                    <template #default="scope">
                        <el-tag>{{scope.row.send_time_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="complete_time_string" label="完成时间" width="180">
                    <template #default="scope">
                        <el-tag>{{scope.row.complete_time_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单金额" width="100">
                    <template #default="scope">
                        <el-tag type="success">￥{{scope.row.payment.toFixed(2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="买家" width="100">
                    <template #default="scope">
                        <el-tag>{{scope.row.nickname}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收货地址" width="160">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                :content="scope.row.address"
                                placement="top"
                        >
                            <el-tag>{{scope.row.address.slice(0, 10) + '...'}}</el-tag>
                        </el-tooltip>
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
                            <el-button size="small" @click="handleUserOrderCompletedTelClick({tel: scope.row.tel})">
                                {{scope.row.tel}}
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="查看订单包含的物品"
                                placement="top"
                        >
                            <el-button type="text" size="medium" @click="handleUserOrderCompletedDetailDialog({order: scope.row})">
                                订单详情
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="订单详情" v-model="userOrderCompletedDetailDialogVisible" width="80%">

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

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="userOrderCompletedPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUserOrderCompleted"
                    @current-change="handleUserOrderCompletedPaginationCurrentClick"
            />
        </el-card>
    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {getLogisticsCompany, getUserOrder, getUserOrderItemByOrderId, updateUserOrder} from "../api";
    import VersatileHelper from "../utils/versatile_helper";
    import TimeHelper from "../utils/time_helper";
    import StatusHelper from "../utils/status_helper";
    import wxpay_image from "../assets/img/wxpay.png";
    import alipay_image from "../assets/img/alipay.png";
    import paypal_image from "../assets/img/paypal.png";
    import cash_image from "../assets/img/cash.png";

    export default {
        name: "order_closed",
        data() {
            return {
                pageIndex: 0,
                userOrderCompletedData: [],
                userOrderCompletedPageSize: 0,
                totalUserOrderCompletedPage: 0,
                totalUserOrderCompleted: 0,
                userOrderCompletedTableLoading: true,
                userOrderCompletedDetailDialogVisible: false,

                currentUserOrderData: {},
                currentUserOrderItemsData: [],
                currentUserOrderItemsTableLoading: false,

                staticImage: {
                    wxpay_image: wxpay_image,
                    alipay_image: alipay_image,
                    paypal_image: paypal_image,
                    cash_image: cash_image
                },

                StatusHelper: StatusHelper
            }
        },
        watch: {
            userOrderCompletedDetailDialogVisible() {

            }
        },
        methods: {
            async getUserOrderCompleted() {
                let result = await getUserOrder(StatusHelper.user_order_status.completed, this.pageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    console.log(data);
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalOrder = result.info.total_user_order_closed;
                    for (let i = 0; i < data.length; i++) {
                        data[i].payment_time = new Date(data[i].payment_time);
                        data[i].payment_time_string = TimeHelper.convert_date_to_date_time_string(data[i].payment_time);
                        data[i].send_time = new Date(data[i].send_time);
                        data[i].send_time_string = TimeHelper.convert_date_to_date_time_string(data[i].send_time);
                        data[i].complete_time = new Date(data[i].complete_time);
                        data[i].complete_time_string = TimeHelper.convert_date_to_date_time_string(data[i].complete_time);
                    }
                    this.userOrderCompletedPageSize = pageSize;
                    this.totalUserOrderCompletedPage = totalPage;
                    this.totalUserOrderCompleted = totalOrder;
                    this.userOrderCompletedData = VersatileHelper.clone_object(data);
                    this.userOrderCompletedTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUserOrderCompletedTelClick(e) {
                let result = VersatileHelper.copy_content(e.tel);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderCompletedDetailDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderCompletedDetailDialogVisible = true;
                this.getUserOrderItemByOrderId(this.currentUserOrderData.id);
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

            clearAll() {
                this.currentUserOrderData = {};
            },

            async handleUserOrderCompletedPaginationCurrentClick(current) {
                this.userOrderCompletedTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getUserOrderCompleted();
            }
        },
        created() {

        },
        mounted() {
            this.getUserOrderCompleted();
        }
    };
</script>

<style scoped>

</style>