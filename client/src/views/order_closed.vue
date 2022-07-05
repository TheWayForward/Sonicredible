<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>已关闭</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- closed -->
        <el-card shadow="hover" style="margin-bottom: 20px;">
            <el-table :data="userOrderClosedData" style="width: 100%; margin-top: 20px;"
                      v-loading="userOrderClosedTableLoading">
                <el-table-column align="center" prop="serial" label="订单号" width="180"/>
                <el-table-column align="center" prop="payment_time_string" label="下单时间" width="200">
                    <template #default="scope">
                        <el-tag>{{scope.row.time_created_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="payment_time_string" label="关单时间" width="200">
                    <template #default="scope">
                        <el-tag type="danger">{{scope.row.time_modified_string}}</el-tag>
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
                <el-table-column align="center" label="买家地址" width="150">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                :content="scope.row.address_detail_string"
                                placement="top"
                        >
                            <el-tag>{{scope.row.address_string}}</el-tag>
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
                            <el-button size="small" @click="handleUserOrderClosedTelClick({tel: scope.row.tel})">
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
                            <el-button type="text" size="medium" @click="handleUserOrderClosedDetailDialog({order: scope.row})">
                                订单详情
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="订单详情" v-model="userOrderClosedDetailDialogVisible" width="80%">

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
                    :page-size="userOrderClosedPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUserOrderClosed"
                    @current-change="handleUserOrderClosedPaginationCurrentClick"
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
                userOrderClosedData: [],
                userOrderClosedPageSize: 0,
                totalUserOrderClosedPage: 0,
                totalUserOrderClosed: 0,
                userOrderClosedTableLoading: true,
                userOrderClosedDetailDialogVisible: false,

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
            userOrderClosedDetailDialogVisible() {

            }
        },
        methods: {
            async getUserOrderClosed() {
                let result = await getUserOrder(StatusHelper.user_order_status.closed, this.pageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalOrder = result.info.total_user_order_closed;
                    for (let i = 0; i < data.length; i++) {
                        data[i].address = JSON.parse(data[i].address);
                        let address = VersatileHelper.generate_address_string(data[i].address);
                        data[i].address_string = address.address_string;
                        data[i].address_detail_string = address.address_detail_string;
                        data[i].time_created = new Date(data[i].time_created);
                        data[i].time_created_string = TimeHelper.convert_date_to_date_time_string(data[i].time_created);
                        data[i].time_modified = new Date(data[i].time_modified);
                        data[i].time_modified_string = TimeHelper.convert_date_to_date_time_string(data[i].time_modified);
                    }
                    this.userOrderClosedPageSize = pageSize;
                    this.totalUserOrderClosedPage = totalPage;
                    this.totalUserOrderClosed = totalOrder;
                    this.userOrderClosedData = VersatileHelper.clone_object(data);
                    this.userOrderClosedTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUserOrderClosedTelClick(e) {
                let result = VersatileHelper.copy_content(e.tel);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderClosedDetailDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderClosedDetailDialogVisible = true;
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

            async handleUserOrderClosedPaginationCurrentClick(current) {
                this.userOrderClosedTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getUserOrderClosed();
            }
        },
        created() {

        },
        mounted() {
            this.getUserOrderClosed();
        }
    };
</script>

<style scoped>

</style>