<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>待支付</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- unpaid -->
        <el-card shadow="hover" style="margin-bottom: 20px;">

            <el-table :data="userOrderUnpaidData" style="width: 100%; margin-top: 20px;"
                      v-loading="userOrderUnpaidTableLoading">
                <el-table-column align="center" prop="serial" label="订单号" width="180"/>
                <el-table-column align="center" prop="payment_time_string" label="下单时间" width="170">
                    <template #default="scope">
                        <el-tag>{{scope.row.time_created_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应付金额">
                    <template #default="scope">
                        <el-tag type="success">￥{{scope.row.payment.toFixed(2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运费">
                    <template #default="scope">
                        <el-tag type="success">￥{{scope.row.postage.toFixed(2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="付款方式">
                    <template #default="scope">
                        <el-image v-if="scope.row.payment_type === StatusHelper.user_order_payment_type.wxpay"
                                  class="table-td-thumb"
                                  :src="staticImage.wxpay_image">
                        </el-image>
                        <el-image v-if="scope.row.payment_type === StatusHelper.user_order_payment_type.alipay"
                                  class="table-td-thumb"
                                  :src="staticImage.alipay_image">
                        </el-image>
                        <el-image v-if="scope.row.payment_type === StatusHelper.user_order_payment_type.paypal"
                                  class="table-td-thumb"
                                  :src="staticImage.paypal_image">
                        </el-image>
                        <el-image v-if="scope.row.payment_type === StatusHelper.user_order_payment_type.cash"
                                  class="table-td-thumb"
                                  :src="staticImage.cash">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="买家">
                    <template #default="scope">
                        <el-tag>{{scope.row.nickname}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="买家地址">
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
                            <el-button size="small" @click="handleUserOrderUnpaidTelClick({tel: scope.row.tel})">
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
                            <el-button type="text" size="medium" @click="handleUserOrderUnpaidDetailDialog({order: scope.row})">
                                订单详情
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="以管理员身份取消该订单，请谨慎操作"
                                placement="top"
                        >
                            <el-button type="text" size="medium" style="color: red;" @click="handleUserOrderCancelDialog({order: scope.row})">
                                手动取消
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="订单详情" v-model="userOrderUnpaidDetailDialogVisible" width="80%">

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

            <el-dialog v-model="userOrderUnpaidCancelDialogVisible" width="30%" title="提示">
                <p>您正在以管理员身份取消订单！</p>
                <p>请仔细核对订单信息，再确认操作！</p>
                <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userOrderUnpaidCancelDialogVisible = false">取消</el-button>
                            <el-button type="danger" @click="submitCancelUserOrderUnpaid" :disabled="confirmSubmitUpdateUserOrderUnpaid">确定</el-button>
                        </span>
                </template>
            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="userOrderUnpaidPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUserOrderUnpaid"
                    @current-change="handleUserOrderUnpaidPaginationCurrentClick"
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
        name: "order_unpaid",
        data() {
            return {
                pageIndex: 0,
                userOrderUnpaidData: [],
                userOrderUnpaidPageSize: 0,
                totalUserOrderUnpaidPage: 0,
                totalUserOrderUnpaid: 0,
                userOrderUnpaidTableLoading: true,
                userOrderUnpaidDetailDialogVisible: false,
                userOrderUnpaidCancelDialogVisible: false,
                confirmSubmitUpdateUserOrderUnpaid: false,

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
            userOrderUnpaidDetailDialogVisible() {

            }
        },
        methods: {
            async getUserOrderUnpaid() {
                let result = await getUserOrder(StatusHelper.user_order_status.unpaid, this.pageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalOrder = result.info.total_user_order_unpaid;
                    for (let i = 0; i < data.length; i++) {
                        data[i].address = JSON.parse(data[i].address);
                        let address = VersatileHelper.generate_address_string(data[i].address);
                        data[i].address_string = address.address_string;
                        data[i].address_detail_string = address.address_detail_string;
                        data[i].time_created = new Date(data[i].time_created);
                        data[i].time_created_string = TimeHelper.convert_date_to_date_time_string(data[i].time_created);
                    }
                    this.userOrderUnpaidPageSize = pageSize;
                    this.totalUserOrderUnpaidPage = totalPage;
                    this.totalUserOrderUnpaid = totalOrder;
                    this.userOrderUnpaidData = VersatileHelper.clone_object(data);
                    this.userOrderUnpaidTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUserOrderUnpaidTelClick(e) {
                let result = VersatileHelper.copy_content(e.tel);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderUnpaidDetailDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderUnpaidDetailDialogVisible = true;
                this.getUserOrderItemByOrderId(this.currentUserOrderData.id);
            },

            handleUserOrderCancelDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderUnpaidCancelDialogVisible = true;
            },

            submitCancelUserOrderUnpaid() {
                this.cancelUserOrderUnpaid();
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

            async cancelUserOrderUnpaid() {
                this.confirmSubmitUpdateUserOrderUnpaid = true;
                let result = await updateUserOrder({
                    current_type: StatusHelper.user_order_status.unpaid,
                    target_type: StatusHelper.user_order_status.closed,
                    admin_id: localStorage.getItem("user_id"),
                    order_id: this.currentUserOrderData.id
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    this.clearAll();
                    await this.getUserOrderUnpaid();
                    this.userOrderUnpaidCancelDialogVisible = false;
                    this.confirmSubmitUpdateUserOrderUnpaid = false;
                } else {
                    ElMessage.warning(result.message);
                    this.userOrderUnpaidCancelDialogVisible = false;
                    setTimeout(() => {
                        this.confirmSubmitUpdateUserOrderUnpaid = false;
                    }, 1000);
                }
            },

            clearAll() {
                this.currentUserOrderData = {};
            },

            async handleUserOrderUnpaidPaginationCurrentClick() {
                this.userOrderUnpaidTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getUserOrderUnpaid();
            }
        },
        created() {

        },
        mounted() {
            this.getUserOrderUnpaid();
        }
    };
</script>

<style scoped>

</style>