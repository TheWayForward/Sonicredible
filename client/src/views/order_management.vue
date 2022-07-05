<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>订单查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card shadow="hover" style="margin-bottom: 20px;">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input v-model="serial_input" placeholder="请输入订单号"/>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" :disabled="serial_input.length === 0" maxlength="19"
                               @click="getUserOrder">查询
                    </el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- info panel -->
        <el-card shadow="hover" style="margin-bottom: 20px;"
                 v-loading="userOrderInfoCardLoading" v-if="currentUserOrderData.hasOwnProperty('order_id')">

            <!-- header -->
            <div class="card-header" style="font-weight: bold; margin-bottom: 10px;">
                <span>订单号：{{currentUserOrderData.order_serial}}</span>
                <el-tooltip
                        class="box-item"
                        effect="light"
                        content="点击刷新"
                        placement="top"
                >
                    <el-button class="button" type="text" @click="getUserOrder">
                        <i class="el-icon-lx-refresh hover-rotate" style="font-size: 20px;"/>
                    </el-button>
                </el-tooltip>
            </div>

            <el-card shadow="hover" style="margin-bottom: 20px;">
                <!--status-->
                <el-tag type="primary" style="margin-bottom: 20px;"
                        v-if="currentUserOrderData.status === StatusHelper.user_order_status.unpaid">已下单，等待用户付款
                </el-tag>
                <el-tag type="warning" style="margin-bottom: 20px;"
                        v-if="currentUserOrderData.status === StatusHelper.user_order_status.paid">已付款，正在发货
                </el-tag>
                <el-tag type="primary" style="margin-bottom: 20px;"
                        v-if="currentUserOrderData.status === StatusHelper.user_order_status.sent">已发货，正在运输
                </el-tag>
                <el-tag type="success" style="margin-bottom: 20px;"
                        v-if="currentUserOrderData.status === StatusHelper.user_order_status.completed">已完成
                </el-tag>
                <el-tag type="danger" style="margin-bottom: 20px;"
                        v-if="currentUserOrderData.status === StatusHelper.user_order_status.closed">用户未及时支付或管理员操作，订单已关闭
                </el-tag>

                <!-- steps -->
                <el-steps v-if="currentUserOrderData.status === StatusHelper.user_order_status.unpaid"
                          style="padding: 20px;">
                    <el-step title="用户下单" status="success" :description="currentUserOrderData.time_created_string"/>
                    <el-step title="用户付款" status="process" description="等待中"/>
                    <el-step title="商家发货"/>
                    <el-step title="用户签收"/>
                </el-steps>
                <el-steps v-if="currentUserOrderData.status === StatusHelper.user_order_status.paid"
                          style="padding: 20px;">
                    <el-step title="用户下单" status="success" :description="currentUserOrderData.time_created_string"/>
                    <el-step title="用户付款" status="success" :description="currentUserOrderData.payment_time_string"/>
                    <el-step title="商家发货" status="process" description="等待中"/>
                    <el-step title="用户签收"/>
                </el-steps>
                <el-steps v-if="currentUserOrderData.status === StatusHelper.user_order_status.sent"
                          style="padding: 20px;">
                    <el-step title="用户下单" status="success" :description="currentUserOrderData.time_created_string"/>
                    <el-step title="用户付款" status="success" :description="currentUserOrderData.payment_time_string"/>
                    <el-step title="商家发货" status="success" :description="currentUserOrderData.send_time_string"/>
                    <el-step title="用户签收" status="process" description="等待中"/>
                </el-steps>
                <el-steps v-if="currentUserOrderData.status === StatusHelper.user_order_status.completed"
                          style="padding: 20px;">
                    <el-step title="用户下单" status="success" :description="currentUserOrderData.time_created_string"/>
                    <el-step title="用户付款" status="success" :description="currentUserOrderData.payment_time_string"/>
                    <el-step title="商家发货" status="success" :description="currentUserOrderData.send_time_string"/>
                    <el-step title="用户签收" status="success" :description="currentUserOrderData.complete_time_string"/>
                </el-steps>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-steps v-if="currentUserOrderData.status === StatusHelper.user_order_status.closed"
                                  style="padding: 20px;">
                            <el-step title="用户下单" status="success"
                                     :description="currentUserOrderData.time_created_string"/>
                            <el-step title="订单关闭" status="error" :description="currentUserOrderData.close_time_string"/>
                        </el-steps>
                    </el-col>
                </el-row>
            </el-card>

            <!-- user info -->
            <el-card shadow="hover" style="margin-bottom: 20px;">
                <el-descriptions
                        direction="vertical"
                        :column="8"
                        title="买家信息"
                        size="large"
                        border
                >
                    <el-descriptions-item label="头像">
                        <el-image class="table-td-thumb" :src="currentUserOrderData.avatar"></el-image>
                    </el-descriptions-item>
                    <el-descriptions-item label="昵称">{{currentUserOrderData.nickname}}</el-descriptions-item>
                    <el-descriptions-item label="unionid">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.unionid})">
                                {{currentUserOrderData.unionid}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                    <el-descriptions-item label="电话">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.user_tel})">
                                {{currentUserOrderData.user_tel}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                    <el-descriptions-item label="住址">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.user_address_string})">
                                {{currentUserOrderData.user_address_string}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- items -->
            <el-card shadow="hover" style="margin-bottom: 20px;">
                <div class="card-header" style="font-weight: bold;">
                    <span>订单详情</span>
                </div>
                <el-table :data="currentUserOrderItemsData" style="width: 100%; margin-top: 20px;"
                          v-loading="currentUserOrderItemsTableLoading" border>
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

            <!-- payment info -->
            <el-card shadow="hover" style="margin-bottom: 20px;"
                     v-if="currentUserOrderData.status === StatusHelper.user_order_status.paid || currentUserOrderData.status === StatusHelper.user_order_status.sent || currentUserOrderData.status === StatusHelper.user_order_status.completed">
                <el-descriptions
                        direction="vertical"
                        :column="8"
                        title="支付信息"
                        size="large"
                        border
                >
                    <el-descriptions-item label="支付方式">
                        <el-image
                                v-if="currentUserOrderData.payment_type === StatusHelper.user_order_payment_type.wxpay"
                                class="table-td-thumb"
                                :src="staticImage.wxpay_image">
                        </el-image>
                        <el-image
                                v-if="currentUserOrderData.payment_type === StatusHelper.user_order_payment_type.alipay"
                                class="table-td-thumb"
                                :src="staticImage.alipay_image">
                        </el-image>
                        <el-image
                                v-if="currentUserOrderData.payment_type === StatusHelper.user_order_payment_type.paypal"
                                class="table-td-thumb"
                                :src="staticImage.paypal_image">
                        </el-image>
                        <el-image v-if="currentUserOrderData.payment_type === StatusHelper.user_order_payment_type.cash"
                                  class="table-td-thumb"
                                  :src="staticImage.cash">
                        </el-image>
                    </el-descriptions-item>
                    <el-descriptions-item label="支付参数">
                        <code class="javaScript">{{currentUserOrderData.payment_detail_string}}</code>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- shipping -->
            <el-card shadow="hover" style="margin-bottom: 20px;"
                     v-if="currentUserOrderData.status === StatusHelper.user_order_status.sent || currentUserOrderData.status === StatusHelper.user_order_status.completed">
                <el-descriptions
                        direction="vertical"
                        :column="8"
                        title="运单详情"
                        size="large"
                        border
                >
                    <el-descriptions-item label="承运人">
                        <el-image class="table-td-thumb" :src="currentUserOrderData.logistics_company_icon"></el-image>
                    </el-descriptions-item>
                    <el-descriptions-item label="运单号">{{currentUserOrderData.shipping_serial}}</el-descriptions-item>
                    <el-descriptions-item label="收货人姓名">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.shipping_name})">
                                {{currentUserOrderData.shipping_name}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                    <el-descriptions-item label="收货人电话">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.user_shipping_tel})">
                                {{currentUserOrderData.user_shipping_tel}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                    <el-descriptions-item label="收货地址">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="点击复制"
                                placement="top"
                        >
                            <el-button @click="handleCopy({value: currentUserOrderData.address})">
                                {{currentUserOrderData.address}}
                            </el-button>
                        </el-tooltip>
                    </el-descriptions-item>
                </el-descriptions>
                <el-card shadow="hover" style="margin-top: 20px;">
                    <el-scrollbar height="400px" style="padding: 20px;"
                                  v-loading="currentUserOrderTrackTimelineLoading">
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
            </el-card>

            <!-- operations -->
            <el-card shadow="hover" style="margin-bottom: 20px;"
                     v-if="currentUserOrderData.status !== StatusHelper.user_order_status.closed && currentUserOrderData.status !== StatusHelper.user_order_status.completed">
                <div class="card-header" style="font-weight: bold;">
                    <span>可用操作</span>
                </div>
                <div style="margin-top: 20px;">
                    <el-button type="danger" @click="handleUserOrderSentCompleteDialog"
                               v-if="currentUserOrderData.status === StatusHelper.user_order_status.sent">确认收货
                    </el-button>
                    <el-button type="primary" @click="handleUpdateUserOrderPaidLogisticsInfoDialog"
                               v-if="currentUserOrderData.status === StatusHelper.user_order_status.paid">发货
                    </el-button>
                    <el-button type="danger" @click="handleUserOrderCancelDialog"
                               v-if="currentUserOrderData.status === StatusHelper.user_order_status.unpaid">手动取消
                    </el-button>
                </div>
            </el-card>
        </el-card>

        <el-card shadow="hover" style="margin-bottom: 20px;" v-else>
            <el-empty description="输入订单号，点击查询，查看订单详情并进行操作！"/>
        </el-card>

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

        <el-dialog v-model="userOrderSentCompleteDialogVisible" width="30%" title="提示">
            <p>您正在以管理员身份完成订单！</p>
            <p>请确保用户已收货，再确认操作！</p>
            <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userOrderSentCompleteDialogVisible = false">取消</el-button>
                            <el-button type="danger" @click="submitUpdateUserOrderSent"
                                       :disabled="confirmSubmitUpdateUserOrderSent">确定</el-button>
                        </span>
            </template>
        </el-dialog>

        <el-dialog v-model="userOrderUnpaidCancelDialogVisible" width="30%" title="提示">
            <p>您正在以管理员身份取消订单！</p>
            <p>请仔细核对订单信息，再确认操作！</p>
            <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="userOrderUnpaidCancelDialogVisible = false">取消</el-button>
                            <el-button type="danger" @click="submitCancelUserOrderUnpaid"
                                       :disabled="confirmSubmitUpdateUserOrderUnpaid">确定</el-button>
                        </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {
        getLogisticsCompany, getTrackData,
        getUserOrder,
        getUserOrderBySerial,
        getUserOrderItemByOrderId,
        updateUserOrder
    } from "../api";
    import VersatileHelper from "../utils/versatile_helper";
    import TimeHelper from "../utils/time_helper";
    import VerificationHelper from "../utils/verification_helper";
    import StatusHelper from "../utils/status_helper";
    import wxpay_image from "../assets/img/wxpay.png";
    import alipay_image from "../assets/img/alipay.png";
    import paypal_image from "../assets/img/paypal.png";
    import cash_image from "../assets/img/cash.png";

    export default {
        name: "order_management",
        data() {
            return {
                serial_input: "",
                userOrderInfoCardLoading: false,
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
                currentUserOrderTrackTimelineLoading: false,
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
                userOrderUnpaidCancelDialogVisible: false,
                confirmSubmitUpdateUserOrderUnpaid: false,
                confirmSubmitUpdateUserOrderPaid: false,
                userOrderSentCompleteDialogVisible: false,
                confirmSubmitUpdateUserOrderSent: false,

                staticImage: {
                    wxpay_image: wxpay_image,
                    alipay_image: alipay_image,
                    paypal_image: paypal_image,
                    cash_image: cash_image
                },

                StatusHelper: StatusHelper
            }
        },
        watch: {},
        methods: {
            async getUserOrder() {
                let v = VerificationHelper.user_order_serial_verification(this.serial_input);
                if (v.has_error) {
                    ElMessage.warning(v.detail);
                } else {
                    this.userOrderInfoCardLoading = true;
                    this.currentUserOrderItemsTableLoading = true;
                    this.currentUserOrderTrackTimelineLoading = true;
                    let result = await getUserOrderBySerial(this.serial_input);
                    if (result.code === 200) {
                        let data = result.info;
                        data.time_created = new Date(data.time_created);
                        data.time_created_string = TimeHelper.convert_date_to_date_time_string(data.time_created);
                        data.user_address = JSON.parse(data.user_address);
                        data.user_address_string = VersatileHelper.generate_address_string(data.user_address).address_detail_string;
                        if (data.hasOwnProperty("close_time")) {
                            data.close_time = new Date(data.close_time);
                            data.close_time_string = TimeHelper.convert_date_to_date_time_string(data.close_time);
                        }
                        if (data.hasOwnProperty("payment_time")) {
                            data.payment_time = new Date(data.payment_time);
                            data.payment_time_string = TimeHelper.convert_date_to_date_time_string(data.payment_time);
                        }
                        if (data.hasOwnProperty("send_time")) {
                            data.send_time = new Date(data.send_time);
                            data.send_time_string = TimeHelper.convert_date_to_date_time_string(data.send_time);
                        }
                        if (data.hasOwnProperty("complete_time")) {
                            data.complete_time = new Date(data.complete_time);
                            data.complete_time_string = TimeHelper.convert_date_to_date_time_string(data.complete_time);
                        }
                        if (data.hasOwnProperty("payment_detail")) {
                            data.payment_detail = JSON.parse(data.payment_detail);
                            data.payment_detail_string = JSON.stringify(data.payment_detail);
                        }
                        if (data.hasOwnProperty("logistics_company_icon")) {
                            data.logistics_company_icon = VersatileHelper.parse_url(data.logistics_company_icon);
                        }
                        if (data.hasOwnProperty("logistics_company_params")) {
                            data.logistics_company_params = JSON.parse(data.logistics_company_params);
                        }
                        this.currentUserOrderData = VersatileHelper.clone_object(data);
                        this.userOrderInfoCardLoading = false;
                    } else {
                        ElMessage.warning(result.message);
                        return;
                    }
                    await this.getUserOrderItemByOrderId(this.currentUserOrderData.order_id);
                    if (this.currentUserOrderData.status === StatusHelper.user_order_status.paid) {
                        await this.getLogisticsCompanyData();
                    }
                    if (this.currentUserOrderData.status === StatusHelper.user_order_status.sent || this.currentUserOrderData.status === StatusHelper.user_order_status.completed) {
                        await this.getTrackData();
                    }
                }
            },

            async getUserOrderItemByOrderId(order_id) {
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
                let result = await getTrackData(this.currentUserOrderData.logistics_company_params.code, this.currentUserOrderData.shipping_serial, this.currentUserOrderData.tel);
                if (result.code === 200) {
                    this.currentUserOrderTrackData = VersatileHelper.clone_object(result.info);
                    this.currentUserOrderTrackTimelineLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                }
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
                    order_id: this.currentUserOrderData.order_id,
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
                    ElMessage.success(result.message);
                    await this.getUserOrder();
                } else {
                    ElMessage.warning(result.message);
                    this.updateUserOrderPaidLogisticsInfoConfirmDialogVisible = false;
                    setTimeout(() => {
                        this.confirmSubmitUpdateUserOrderPaid = false;
                    }, 1000);
                }
            },

            submitUpdateUserOrderSent() {
                this.completeUserOrder();
            },

            async completeUserOrder() {
                this.confirmSubmitUpdateUserOrderSent = true;
                let result = await updateUserOrder({
                    current_type: StatusHelper.user_order_status.sent,
                    target_type: StatusHelper.user_order_status.completed,
                    admin_id: localStorage.getItem("user_id"),
                    order_id: this.currentUserOrderData.order_id
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getUserOrder();
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

            submitCancelUserOrderUnpaid() {
                this.cancelUserOrderUnpaid();
            },

            async cancelUserOrderUnpaid() {
                this.confirmSubmitUpdateUserOrderUnpaid = true;
                let result = await updateUserOrder({
                    current_type: StatusHelper.user_order_status.unpaid,
                    target_type: StatusHelper.user_order_status.closed,
                    admin_id: localStorage.getItem("user_id"),
                    order_id: this.currentUserOrderData.order_id
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getUserOrder();
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

            handleUserOrderCancelDialog() {
                this.userOrderUnpaidCancelDialogVisible = true;
            },

            handleUpdateUserOrderPaidLogisticsInfoDialog() {
                let currentUserOrderData = this.currentUserOrderData;
                let shippingData = {
                    logisticsCompanyId: "",
                    shippingSerial: "",
                    address: this.currentUserOrderData.user_address_string,
                    tel: currentUserOrderData.user_tel,
                    shippingName: currentUserOrderData.user_shipping_name
                };
                this.defaultShippingData = VersatileHelper.clone_object(shippingData);
                this.currentShippingData = VersatileHelper.clone_object(shippingData);
                this.updateUserOrderPaidLogisticsInfoDialogVisible = true;
            },

            handleLogisticsCompanyDataClick(e) {
                this.currentLogisticsCompanyData = VersatileHelper.clone_object(e);
                this.currentShippingData.logisticsCompanyId = this.currentLogisticsCompanyData.id;
            },

            handleUserOrderSentCompleteDialog() {
                this.userOrderSentCompleteDialogVisible = true;
            },

            handleCopy(e) {
                let result = VersatileHelper.copy_content(e.value);
                if (result) {
                    ElMessage.success(`已复制到剪贴板！`);
                } else {
                    ElMessage.warning("复制失败，请直接选中复制！");
                }
            },
        },
        created() {

        },
        mounted() {

        }
    };
</script>

<style scoped>

</style>