<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 内容管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>微信小程序</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- carousel -->
        <el-card shadow="hover" style="margin-bottom: 20px;">
            <div class="card-header" style="margin-bottom: 20px;">
                <span>首页-轮播图</span>
            </div>

            <!-- carousel edit table -->
            <el-table :data="swiper" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                      v-loading="tableLoading">

                <el-table-column label="图片" width="300" align="center">
                    <template #default="scope">
                        <el-image class="shadow-filter" style="width: 250px;" :src="scope.row.url"
                                  :preview-src-list="[scope.row.url]">
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column label="相关商品" width="200" prop="product_name" align="center">
                    <template #default="scope">
                        <el-tag type="danger" v-if="scope.row.product_name === ''">未绑定</el-tag>
                        <span v-else>{{scope.row.product_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="创建/修改时间" width="200" prop="time_created_string"
                                 align="center"></el-table-column>

                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="编辑轮播图及其关联商品、描述，仅禁用时可用"
                                placement="left"
                        >
                            <el-button type="text" :disabled="Boolean(scope.row.is_valid)"
                                       @click="handleSwiperEditDialog(scope.row)">编辑
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="启用后，轮播图对用户可见"
                                placement="bottom"
                        >
                            <el-button type="text" :disabled="Boolean(scope.row.is_valid)"
                                       @click="changeSwiperVisibility({id: scope.row.id, is_valid: 1, previous_is_valid: scope.row.is_valid})">启用
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="禁用后，轮播图对用户不可见"
                                placement="left"
                        >
                            <el-button type="text" :disabled="!Boolean(scope.row.is_valid)"
                                       @click="changeSwiperVisibility({id: scope.row.id, is_valid: 0, previous_is_valid: scope.row.is_valid})">禁用
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- swiper edit dialog -->
        <el-dialog v-loading="swiperEditDialogLoading" title="编辑" v-model="swiperEditDialogVisible" width="50%">
            <el-form label-width="120px">
                <el-form-item label="图片">
                    <el-upload
                            list-type="picture-card"
                            :on-preview="handleSwiperPreview"
                            :on-change="handleSwiperChange"
                            :on-remove="handleSwiperRemove"
                            :file-list="swiperEditDialogImageList"
                            :limit="1"
                            :auto-upload="false"
                            action="#">
                        <template #default>
                            <el-tooltip
                                    class="box-item"
                                    effect="light"
                                    content="最多添加1张图片"
                                    placement="top"
                            >
                                <i class="el-icon-lx-roundadd"></i>
                            </el-tooltip>
                        </template>
                    </el-upload>
                    <el-dialog v-model="swiperEditImagePreviewDialogVisible">
                        <img width="100%" :src="swiperEditDialogImageURL" alt=""/>
                    </el-dialog>
                </el-form-item>
                <el-form-item label="关联商品">
                    <el-tag style="margin-right: 10px;"
                            v-if="currentSwiperData.current.product_id !== 0">
                        {{currentSwiperData.current.product_name}}
                    </el-tag>
                    <el-tag type="danger" style="margin-right: 10px;" v-else>
                        未绑定
                    </el-tag>
                    <el-button size="small" @click="handleSwiperEditSelectProductDialog">{{currentSwiperData.current.product_id === 0 ? "选择商品" : "更改"}}</el-button>
                    <el-button size="small" @click="handleSwiperEditDeselectProduct">取消关联</el-button>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                            :rows="3"
                            v-model="currentSwiperData.current.description"
                            maxlength="100"
                            placeholder="请输入描述"
                            show-word-limit
                            type="textarea"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-tooltip
                            class="box-item"
                            effect="light"
                            content="注意：取消操作，系统将还原初始内容"
                            placement="left"
                    >
                        <el-button @click="undoSwiperEdit">取消</el-button>
                    </el-tooltip>
                    <el-button type="primary" @click="beforeSubmitSwiperEdit">确定</el-button>
                </span>
            </template>

            <el-dialog v-model="swiperEditSelectProductDialogVisible" width="50%" title="关联商品">
                <el-input placeholder="搜索商品" v-model="swiperEditSelectProductSearchProductInput"></el-input>
                <el-table v-if="swiperEditSelectProductSearchProductInput !== ''" :data="swiperEditSearchProductData"
                          v-loading="swiperEditSearchProductTableLoading"
                          style="margin-top: 20px;">
                    <el-table-column prop="name" label="商品名称" width="400"/>
                    <el-table-column label="封面">
                        <template #default="scope">
                            <el-image class="table-td-thumb shadow-filter" :src="scope.row.image_url[0]"
                                      :preview-src-list="scope.row.image_url">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="text" @click="handleSwiperSelectProduct(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog v-model="swiperEditConfirmDialogVisible" width="30%" title="提示">
                <span>您的每次提交都将被系统记录，请仔细核对后提交。</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="swiperEditConfirmDialogVisible = false">取消</el-button>
                        <el-button type="danger" @click="submitSwiperEdit">确定</el-button>
                    </span>
                </template>
            </el-dialog>

        </el-dialog>
    </div>

</template>

<script>
    import {ElMessage} from "element-plus";
    import {ref} from 'vue'
    import {
        editSwiper, getProductByName,
        getWechatminiprogramSwiper,
        preuploadSwiperImage
    } from "../api";
    import {VueCropper} from "vue-cropper";
    import VersatileHelper from "../utils/versatile_helper";
    import TimeHelper from "../utils/time_helper";
    import Config from "../utils/config";
    import lodash from "lodash";

    export default {
        name: "wechatminiprogram_content_management",
        components: {
            VueCropper
        },
        data() {
            return {
                swiper: [],
                currentSwiperData: {
                    previous: {},
                    current: {}
                },
                swiperEditTempFileList: [],
                swiperEditDialogImageList: [],
                swiperEditDialogVisible: false,
                swiperEditDialogImageURL: "",
                swiperEditImagePreviewDialogVisible: false,
                swiperTableLoading: false,
                swiperEditDialogLoading: false,
                swiperEditSelectProductDialogVisible: false,
                swiperEditSelectProductSearchProductInput: "",
                swiperEditSearchProductData: [],
                swiperEditSelectedProductData: {},
                swiperEditSearchProductTableLoading: false,
                swiperEditConfirmDialogVisible: false
            }
        },

        watch: {
            swiperEditSelectProductSearchProductInput: function () {
                if (this.swiperEditSelectProductSearchProductInput === "") {
                    return;
                } else {
                    this.debouncedSearchProduct();
                }
            },

            swiperEditSelectProductDialogVisible: function () {
                if (!this.swiperEditSelectedProductData.hasOwnProperty("id") && this.swiperEditSelectProductDialogVisible === false) {
                    this.undoSwiperSelectProduct();
                }
            }
        },

        methods: {
            async getSwiper() {
                this.swiperTableLoading = true;
                this.carouselLoading = true;
                let result = await getWechatminiprogramSwiper();
                if (result.code === 200) {
                    let data = result.info;
                    for (let i = 0; i < data.length; i++) {
                        data[i].url = VersatileHelper.parse_url(data[i].url);
                        data[i].time_created = new Date(data[i].time_created);
                        data[i].time_created_string = TimeHelper.convert_date_to_date_time_string(data[i].time_created);
                        data[i].product_name = data[i].product_id === 0 ? "" : data[i].product_name;
                        data[i].is_valid = Boolean(parseInt(data[i].is_valid));
                    }
                    this.swiper = data;
                    this.swiperTableLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                    this.swiperTableLoading = false;
                }
            },

            handleSwiperEditDialog(e) {
                this.currentSwiperData.previous = VersatileHelper.clone_object(e);
                this.currentSwiperData.current = VersatileHelper.clone_object(e);
                this.swiperEditDialogImageList = [{url: e.url}];
                this.swiperEditTempFileList = [{url: e.url}];
                this.swiperEditDialogVisible = true;
            },

            async searchProduct() {
                if (this.swiperEditSelectProductSearchProductInput === "") return;
                this.swiperEditSearchProductTableLoading = true;
                let result = await getProductByName(this.swiperEditSelectProductSearchProductInput);
                if (result.code === 200) {
                    console.log(result);
                    let data = result.info;
                    for (let i = 0; i < data.length; i++) {
                        data[i].time_modified_string = TimeHelper.convert_date_to_date_time_string(new Date(data[i].time_modified));
                        data[i].image_url = JSON.parse(data[i].image_url);
                        for (let j = 0; j < data[i].image_url.length; j++) {
                            data[i].image_url[j] = VersatileHelper.parse_url(data[i].image_url[j]);
                            data[i].cover = data[i].image_url[0]
                        }
                    }
                    this.swiperEditSearchProductData = data;
                    this.swiperEditSearchProductTableLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                    this.swiperEditSearchProductTableLoading = false;
                }
            },

            async changeSwiperVisibility(e) {
                let params = {
                    swiper_id: e.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: e.is_valid ? "enable" : "disable",
                    previous: {
                        id: e.id,
                        is_valid: e.previous_is_valid
                    },
                    current: {
                        id: e.id,
                        is_valid: e.is_valid
                    }
                };
                let result = await editSwiper(params);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getSwiper();
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleSwiperPreview() {

            },

            async handleSwiperChange(res, file) {
                // add cover image
                let tempFile = res;
                if (tempFile.raw.type !== "image/png" && tempFile.raw.type !== "image/jpg" && tempFile.raw.type !== "image/jpeg") {
                    ElMessage.warning("只能上传png、jpeg或jpg格式的图片！");
                    return;
                }
                if (VersatileHelper.byteToSize(tempFile.raw.size) > 2) {
                    ElMessage.warning("图片不能大于2MB！");
                    return;
                }
                let form = new FormData();
                form.append("swiper", tempFile.raw);
                let result = await preuploadSwiperImage(form);
                console.log(result);
                if (result.code === 200) {
                    let url = VersatileHelper.parse_url(result.info.path);
                    file[file.length - 1].url = url;
                    this.swiperEditTempFileList.push({
                        url: VersatileHelper.parse_url(url),
                        name: (this.swiperEditTempFileList.length + 1).toString()
                    });
                    this.currentSwiperData.current.image_url = this.swiperEditTempFileList[0].url;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleSwiperRemove(res, file) {
                this.swiperEditTempFileList = [];
                for (let i = 0; i < file.length; i++) {
                    this.swiperEditTempFileList.push({
                        url: file[i].url,
                        name: (i + 1).toString()
                    });
                }
                this.currentSwiperData.current.image_url =  this.swiperEditTempFileList.length ? this.swiperEditTempFileList[0].url : "";
            },

            handleSwiperEditSelectProductDialog() {
                this.swiperEditSelectProductDialogVisible = true;
            },

            handleSwiperEditDeselectProduct() {
                this.swiperEditSelectedProductData = {};
                this.currentSwiperData.current.product_id = 0;
                this.$forceUpdate();
            },

            undoSwiperSelectProduct() {
                this.currentSwiperData.current = VersatileHelper.clone_object(this.currentSwiperData.previous);
                this.swiperEditSelectProductSearchProductInput = "";
                this.swiperEditSelectedProductData = {};
                this.swiperEditSelectProductDialogVisible = false;
            },

            handleSwiperSelectProduct(e) {
                this.swiperEditSelectedProductData = VersatileHelper.clone_object(e);
                this.currentSwiperData.current.product_id = this.swiperEditSelectedProductData.id;
                this.currentSwiperData.current.product_name = this.swiperEditSelectedProductData.name;
                this.swiperEditSelectProductSearchProductInput = "";
                this.swiperEditSelectProductDialogVisible = false;
                this.swiperEditSearchProductData = [];
            },

            undoSwiperEdit() {
                this.swiperEditDialogVisible = false;
                this.currentSwiperData.previous = {};
                this.currentSwiperData.current = {};
                this.swiperEditTempFileList = [];
                this.swiperEditDialogImageList = [];
            },

            beforeSubmitSwiperEdit() {
                if (lodash.isEqual(this.currentSwiperData.previous, this.currentSwiperData.current)) {
                    ElMessage.warning("轮播图信息未改动，无需提交！");
                    return;
                }
                if (!this.swiperEditTempFileList.length) {
                    ElMessage.warning("至少上传1张图片！");
                    return;
                }
                this.swiperEditConfirmDialogVisible = true;
            },

            async submitSwiperEdit() {
                this.currentSwiperData.current.url = this.swiperEditTempFileList[0].url;
                let params = {
                    swiper_id: this.currentSwiperData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "edit",
                    previous: {
                        id: this.currentSwiperData.previous.id,
                        description: this.currentSwiperData.previous.description,
                        product_id: this.currentSwiperData.previous.product_id,
                        url: VersatileHelper.redo_url(this.currentSwiperData.previous.url)
                    },
                    current: {
                        id: this.currentSwiperData.current.id,
                        description: this.currentSwiperData.current.description,
                        product_id: this.currentSwiperData.current.product_id,
                        url: VersatileHelper.redo_url(this.currentSwiperData.current.url)
                    }
                };
                let result = await editSwiper(params);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getSwiper();
                    this.swiperEditConfirmDialogVisible = false;
                    this.swiperEditDialogVisible = false;
                    this.currentSwiperData.previous = {};
                    this.currentSwiperData.current = {};
                    this.swiperEditTempFileList = [];
                    this.swiperEditDialogImageList = [];
                } else {
                    ElMessage.warning(result.message);
                    this.swiperEditConfirmDialogVisible = false;
                }
            }

        },
        created() {
            this.debouncedSearchProduct = lodash.debounce(this.searchProduct, 250);
        },
        mounted() {
            this.getSwiper();
        }
    };
</script>

<style scoped>


</style>