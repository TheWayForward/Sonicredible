<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>待发货</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- paid -->
        <el-card shadow="hover" style="margin-bottom: 20px;">
            <el-table :data="userOrderPaidData" style="width: 100%; margin-top: 20px;"
                      v-loading="userOrderPaidTableLoading">
                <el-table-column align="center" prop="serial" label="订单号" width="180"/>
                <el-table-column align="center" prop="payment_time_string" label="付款时间" width="200">
                    <template #default="scope">
                        <el-tag>{{scope.row.payment_time_string}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="付款金额" width="100">
                    <template #default="scope">
                        <el-tag type="success">￥{{scope.row.payment.toFixed(2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运费" width="100">
                    <template #default="scope">
                        <el-tag type="success">￥{{scope.row.postage.toFixed(2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="付款方式" width="100">
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
                            <el-button size="small" @click="handleUserOrderPaidTelClick({tel: scope.row.tel})">
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
                            <el-button type="text" size="medium"
                                       @click="handleUserOrderPaidDetailDialog({order: scope.row})">
                                订单详情
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content='填写快递单号等，操作后，系统将生成运单，订单状态更新为"已发货"'
                                placement="left"
                        >
                            <el-button type="text" size="medium"
                                       @click="handleUpdateUserOrderPaidLogisticsInfoDialog({order: scope.row})">
                                发货
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="订单详情" v-model="userOrderPaidDetailDialogVisible" width="80%">

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

            <el-dialog title="发货" v-model="updateUserOrderPaidLogisticsInfoDialogVisible" width="50%">
                <el-form label-width="120px">
                    <el-form-item label="物流公司">
                        <el-tag v-if="currentLogisticsCompanyData.hasOwnProperty('id')" style="margin-right: 10px;">
                            {{currentLogisticsCompanyData.name}}
                        </el-tag>
                        <el-dropdown>
                            <el-button size="small">
                                点击选择
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="logisticsCompany in logisticsCompanyData"
                                                      @click="handleLogisticsCompanyDataClick(logisticsCompany)">
                                        {{logisticsCompany.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input placeholder="填写快递单号" v-model="currentShippingData.shippingSerial"></el-input>
                    </el-form-item>
                    <el-form :inline="true" label-width="120px">
                        <el-form-item label="收货地址">
                            <el-input placeholder="填写收货地址" v-model="currentShippingData.address"></el-input>
                        </el-form-item>
                        <el-form-item v-if="currentShippingData.address !== defaultShippingData.address">
                            <el-button size="small" @click="handleUpdateUserOrderPaidSetAddressAsDefaultClicked">使用默认
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" label-width="120px">
                        <el-form-item label="收货人电话">
                            <el-input placeholder="填写收货人电话" maxlength="11" v-model="currentShippingData.tel"></el-input>
                        </el-form-item>
                        <el-form-item v-if="currentShippingData.tel !== defaultShippingData.tel">
                            <el-button size="small" @click="handleUpdateUserOrderPaidSetTelAsDefaultClicked">使用默认
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" label-width="120px">
                        <el-form-item label="收货人用名">
                            <el-input placeholder="填写收货人用名" v-model="currentShippingData.shippingName"></el-input>
                        </el-form-item>
                        <el-form-item v-if="currentShippingData.shippingName !== defaultShippingData.shippingName">
                            <el-button size="small" @click="handleUpdateUserOrderPaidSetShippingNameAsDefaultClicked">
                                使用默认
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="updateUserOrderPaidLogisticsInfoDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="beforeSubmitUpdateUserOrder">确定</el-button>
                    </span>
                </template>

                <el-dialog title="提示" v-model="updateUserOrderPaidLogisticsInfoConfirmDialogVisible" width="30%">
                    <span>请确认全部信息填写正确后发货！</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="updateUserOrderPaidLogisticsInfoDialogVisible = false">取消</el-button>
                            <el-button type="danger" @click="submitUpdateUserOrderPaid"
                                       :disabled="confirmSubmitUpdateUserOrderPaid">确定</el-button>
                        </span>
                    </template>
                </el-dialog>

            </el-dialog>

            <el-pagination
                    small
                    background
                    style="margin-top: 20px;"
                    :page-size="userOrderPaidPageSize"
                    layout="total, prev, pager, next"
                    :total="totalUserOrderPaid"
                    @current-change="handleUserOrderPaidPaginationCurrentClick"
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
        name: "order_paid",
        data() {
            return {
                pageIndex: 0,
                userOrderPaidData: [],
                userOrderPaidPageSize: 0,
                totalUserOrderPaidPage: 0,
                totalUserOrderPaid: 0,
                userOrderPaidTableLoading: true,
                userOrderPaidDetailDialogVisible: false,

                currentUserOrderData: {},
                currentUserOrderItemsData: [],
                currentUserOrderItemsTableLoading: false,

                updateUserOrderPaidLogisticsInfoDialogVisible: false,
                updateUserOrderPaidLogisticsInfoConfirmDialogVisible: false,
                logisticsCompanyData: [],
                currentLogisticsCompanyData: {},
                defaultShippingData: {},
                currentShippingData: {
                    logisticsCompanyId: "",
                    shippingSerial: "",
                    address: "",
                    tel: "",
                    shippingName: ""
                },

                confirmSubmitUpdateUserOrderPaid: false,

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
            userOrderPaidDetailDialogVisible() {

            },

            updateUserOrderPaidLogisticsInfoDialogVisible() {
                if (!this.updateUserOrderPaidLogisticsInfoDialogVisible) {
                    this.clearAll();
                }
            }
        },
        methods: {
            async getUserOrderPaid() {
                let result = await getUserOrder(StatusHelper.user_order_status.paid, this.pageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalOrder = result.info.total_user_order_paid;
                    for (let i = 0; i < data.length; i++) {
                        data[i].address = JSON.parse(data[i].address);
                        data[i].payment_time = new Date(data[i].payment_time);
                        data[i].payment_time_string = TimeHelper.convert_date_to_date_time_string(data[i].payment_time);
                        let address = VersatileHelper.generate_address_string(data[i].address);
                        data[i].address_string = address.address_string
                        data[i].address_detail_string = address.address_detail_string;
                    }
                    this.userOrderPaidPageSize = pageSize;
                    this.totalUserOrderPaidPage = totalPage;
                    this.totalUserOrderPaid = totalOrder;
                    this.userOrderPaidData = VersatileHelper.clone_object(data);
                    this.userOrderPaidTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUserOrderPaidTelClick(e) {
                let result = VersatileHelper.copy_content(e.tel);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },

            handleUserOrderPaidDetailDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                this.userOrderPaidDetailDialogVisible = true;
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

            handleUpdateUserOrderPaidLogisticsInfoDialog(e) {
                this.currentUserOrderData = VersatileHelper.clone_object(e.order);
                let shippingData = {
                    logisticsCompanyId: "",
                    shippingSerial: "",
                    address: this.currentUserOrderData.address_detail_string,
                    tel: this.currentUserOrderData.tel,
                    shippingName: this.currentUserOrderData.shipping_name
                };
                this.defaultShippingData = VersatileHelper.clone_object(shippingData);
                this.currentShippingData = VersatileHelper.clone_object(shippingData);
                this.updateUserOrderPaidLogisticsInfoDialogVisible = true;
            },

            handleLogisticsCompanyDataClick(e) {
                this.currentLogisticsCompanyData = VersatileHelper.clone_object(e);
                this.currentShippingData.logisticsCompanyId = this.currentLogisticsCompanyData.id;
            },

            async getLogisticsCompanyData() {
                let result = await getLogisticsCompany();
                if (result.code === 200) {
                    let data = result.info;
                    for (let i = 0; i < data.length; i++) {
                        data[i].icon = VersatileHelper.parse_url(data[i].icon);
                        data[i].params = JSON.parse(data[i].params);
                    }
                    this.logisticsCompanyData = VersatileHelper.clone_object(data);
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleUpdateUserOrderPaidSetAddressAsDefaultClicked() {
                this.currentShippingData.address = this.defaultShippingData.address;
            },

            handleUpdateUserOrderPaidSetTelAsDefaultClicked() {
                this.currentShippingData.tel = this.defaultShippingData.tel;
            },

            handleUpdateUserOrderPaidSetShippingNameAsDefaultClicked() {
                this.currentShippingData.shippingName = this.defaultShippingData.shippingName;
            },

            beforeSubmitUpdateUserOrder() {
                if (this.currentShippingData.logisticsCompanyId === "") {
                    ElMessage.warning("请选择物流公司！");
                    return;
                }
                if (this.currentShippingData.shippingSerial === "") {
                    ElMessage.warning("请填写快递单号！");
                    return;
                }
                if (this.currentShippingData.address === "") {
                    ElMessage.warning("请填写收货地址！");
                    return;
                }
                if (this.currentShippingData.tel === "") {
                    ElMessage.warning("请填写收货人电话！");
                    return;
                }
                if (this.currentShippingData.shippingName === "") {
                    ElMessage.warning("请填写收货人用名！");
                    return;
                }
                this.updateUserOrderPaidLogisticsInfoConfirmDialogVisible = true;
            },

            async submitUpdateUserOrderPaid() {
                this.confirmSubmitUpdateUserOrderPaid = true;
                let params = {
                    order_id: this.currentUserOrderData.id,
                    user_id: this.currentUserOrderData.user_id,
                    current_type: StatusHelper.user_order_status.paid,
                    target_type: StatusHelper.user_order_status.sent,
                    address: this.currentShippingData.address,
                    tel: this.currentShippingData.tel,
                    shipping_name: this.currentShippingData.shippingName,
                    shipping_serial: this.currentShippingData.shippingSerial,
                    logistics_company_id: this.currentShippingData.logisticsCompanyId
                };
                let result = await updateUserOrder(params);
                if (result.code === 200) {
                    this.updateUserOrderPaidLogisticsInfoConfirmDialogVisible = false;
                    this.updateUserOrderPaidLogisticsInfoDialogVisible = false;
                    this.confirmSubmitUpdateUserOrderPaid = false;
                    this.clearAll();
                    ElMessage.success(result.message);
                    await this.getUserOrderPaid();
                } else {
                    ElMessage.warning(result.message);
                    this.updateUserOrderPaidLogisticsInfoConfirmDialogVisible = false;
                    setTimeout(() => {
                        this.confirmSubmitUpdateUserOrderPaid = false;
                    }, 1000);
                }
            },

            clearAll() {
                this.defaultShippingData = {};
                this.currentLogisticsCompanyData = {};
                this.currentShippingData = {};
                this.currentUserOrderData = {};
            },

            async handleUserOrderPaidPaginationCurrentClick() {
                this.userOrderPaidTableLoading = true;
                this.pageIndex = parseInt(current) - 1;
                await this.getUserOrderPaid();
            }
        },
        created() {

        },
        mounted() {
            this.getUserOrderPaid();
            this.getLogisticsCompanyData();
        }
    };
</script>

<style scoped>

</style>