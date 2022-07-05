<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-s-grid"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- product type -->
        <el-card shadow="hover" style="margin-bottom: 20px;">

            <div class="card-header" style="margin-bottom: 20px;">
                <span>商品类别</span>
            </div>

            <el-collapse>

                <el-collapse-item title="查看类别" name="1-1">
                    <div style="display: flex;">
                        <el-tree
                                style="margin-top: 20px; width: 600px;"
                                class="filter-tree"
                                :data="treeData"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
                                :default-checked-keys="treeDataDefaultKeys"/>
                        <!--
                            <el-card style="margin-top: 20px ;margin-left: 20px; width: 650px;" shadow="hover">
                            <div class="card-header">
                                <span>详情</span>
                            </div>
                            </el-card>
                        -->
                    </div>
                </el-collapse-item>

                <el-collapse-item title="编辑类别" name="1-2">
                    <el-input v-model="searchProductTypeInput" placeholder="搜索类别"/>
                    <el-table :data="searchProductTypeData" v-loading="searchProductTypeTableLoading"
                              v-if="searchProductTypeInput !== ''" style="width: 100%; margin-top: 20px;">
                        <el-table-column prop="name" label="类别名称" width="180"/>
                        <el-table-column prop="depth" label="层级" width="180"/>
                        <el-table-column prop="time_modified_string" label="创建/更新时间"/>
                        <el-table-column fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button type="text" size="medium" @click="handleProductTypeRenameDialog(scope.row)">
                                    重命名
                                </el-button>
                                <el-button type="text" size="medium" @click="handleDeleteProductTypeDialog(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-dialog title="重命名" v-model="productTypeRenameDialogVisible" width="50%">
                        <el-form label-width="120px">
                            <el-form-item label="新的名称">
                                <el-input v-model="productTypeRenameData.newName"/>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="productTypeRenameDialogVisible = false">取消</el-button>
                                    <el-button type="primary" @click="submitProductTypeRename">确定</el-button>
                              </span>
                        </template>
                    </el-dialog>
                    <el-dialog title="删除" v-model="deleteProductTypeDialogVisible" width="50%">
                        <span>确定删除商品类别“{{deleteProductTypeData.currentProductTypeData.name}}”？</span>
                        <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="deleteProductTypeDialogVisible = false">取消</el-button>
                                    <el-button type="danger" @click="submitDeleteProductType">确定</el-button>
                              </span>
                        </template>
                    </el-dialog>
                </el-collapse-item>

                <!-- add type -->
                <el-collapse-item title="添加类别" name="1-3">
                    <el-form style="margin-top: 20px;" label-width="120px">
                        <!-- new type name input -->
                        <el-form-item label="类别名称">
                            <el-input v-model="addProductTypeData.name"/>
                        </el-form-item>

                        <!-- parent selector-->
                        <el-form-item label="使用父类">
                            <el-switch v-model="addProductTypeData.useParent"
                                       @change="handleUseParentChange"></el-switch>
                            <el-card v-if="addProductTypeData.useParent" style="margin-top: 20px;">
                                <el-tree
                                        style="margin-top: 20px;"
                                        class="filter-tree"
                                        :data="treeData"
                                        :props="defaultProps"
                                        default-expand-all
                                        :filter-node-method="filterNode"
                                        :default-checked-keys="treeDataDefaultKeys"
                                        @node-click="handleTreeSelectParent"
                                />
                                <el-tag style="margin-top: 20px;" v-if="addProductTypeData.parent.name">
                                    已选择父类：{{addProductTypeData.parent.name}}
                                </el-tag>
                            </el-card>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAddProductTypeDialog">提交</el-button>
                        </el-form-item>
                        <el-dialog
                                v-model="addProductTypeDialogVisible"
                                title="提示"
                                width="30%">
                            <span>确定添加商品类别“{{addProductTypeData.name}}”吗？</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="addProductTypeDialogVisible = false">取消</el-button>
                                    <el-button type="primary" @click="submitAddProductType">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </el-card>

        <!-- product info -->
        <el-card shadow="hover" style="margin-bottom: 20px;">

            <div class="card-header" style="margin-bottom: 20px;">
                <span>商品信息</span>
            </div>

            <el-collapse>
                <el-collapse-item title="查看商品" name="2-1">
                    <el-table :data="productData" style="width: 100%; margin-top: 20px;"
                              v-loading="productTableLoading">
                        <el-table-column prop="brand_name" label="品牌" width="100"/>
                        <el-table-column prop="name" label="商品名称" width="400"/>
                        <el-table-column prop="type_name" label="商品类别" width="150"/>
                        <el-table-column prop="name" label="封面">
                            <template #default="scope">
                                <el-badge :value="scope.row.image_url.length" type="danger" class="badge-item">
                                    <el-image class="table-td-thumb shadow-filter" :src="scope.row.image_url[0]"
                                              :preview-src-list="scope.row.image_url">
                                    </el-image>
                                </el-badge>
                            </template>
                        </el-table-column>
                        <el-table-column prop="discount" label="优惠标记">
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.discount === 1">有优惠</el-tag>
                                <el-tag type="info" v-else>无优惠</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="库存">
                            <template #default="scope">
                                <el-tag v-if="scope.row.stock > 0">余量：{{scope.row.stock}}</el-tag>
                                <el-tag type="danger" v-else>无库存</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="销售单位">
                            <template #default="scope">
                                <el-tag>
                                    {{scope.row.sku}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="单价">
                            <template #default="scope">
                                <el-tag type="success">
                                    ￥{{scope.row.price.toFixed(2)}}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            small
                            background
                            style="margin-top: 20px;"
                            :page-size="productPageSize"
                            layout="prev, pager, next"
                            :total="totalProduct"
                            @current-change="handleProductPaginationCurrentClick"
                    />
                </el-collapse-item>
            </el-collapse>

            <el-collapse>
                <el-collapse-item title="编辑商品" name="2-1">
                    <el-input v-model="searchProductInput" placeholder="搜索商品"/>
                    <el-table :data="searchProductData" style="width: 100%; margin-top: 20px;"
                              v-loading="searchProductTableLoading">
                        <el-table-column prop="name" label="商品名称" width="400"/>
                        <el-table-column prop="type_name" label="商品类别" width="100"/>
                        <el-table-column prop="image" label="封面" align="center">
                            <template #default="scope">
                                <el-badge :value="scope.row.image_url.length" type="danger" class="badge-item">
                                    <el-image class="table-td-thumb shadow-filter" :src="scope.row.cover"
                                              :preview-src-list="scope.row.image_url">
                                    </el-image>
                                </el-badge>
                            </template>
                        </el-table-column>
                        <el-table-column prop="discount" label="优惠标记" width="120">
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.discount === 1">有优惠</el-tag>
                                <el-tag type="info" v-else>无优惠</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="库存" width="120">
                            <template #default="scope">
                                <el-tag v-if="scope.row.stock > 0">余量：{{scope.row.stock}}</el-tag>
                                <el-tag type="danger" v-else>无库存</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="120">
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.is_valid">可售</el-tag>
                                <el-tag type="warning" v-else>停售</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="400">
                            <template #default="scope">
                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="编辑商品名称、类别、品牌、销售单位、单价（人民币）、优惠状态"
                                        placement="left"
                                >
                                    <el-button type="text" size="medium" @click="handleProductEditDialog(scope.row)">
                                        编辑信息
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="编辑用于展示的商品封面图片"
                                        placement="bottom"
                                >
                                    <el-button type="text" size="medium"
                                               @click="handleProductEditCoverDialog(scope.row)">
                                        编辑封面
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="编辑用于商城中详情展示的商品详情内容"
                                        placement="bottom"
                                >
                                    <el-button type="text" size="medium"
                                               @click="handleProductEditDetailDialog(scope.row)">
                                        编辑详情
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="上架后，商品在商城中对用户公开展示"
                                        placement="bottom"
                                >
                                    <el-button :disabled="Boolean(scope.row.is_valid)" type="text" size="medium"
                                               @click="handleProductEnableDialog(scope.row)">
                                        上架
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="基于销售单位添加商品库存，仅下架时可用"
                                        placement="bottom"
                                >
                                    <el-button :disabled="Boolean(scope.row.is_valid)" type="text" size="medium"
                                               @click="handleProductStockDialog(scope.row)">
                                        进货
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="下架后，商品对用户不可见，此时可以进货"
                                        placement="bottom"
                                >
                                    <el-button :disabled="!Boolean(scope.row.is_valid)" type="text" size="medium"
                                               @click="handleProductDisableDialog(scope.row)">
                                        下架
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip
                                        class="box-item"
                                        content="删除该商品全部信息，请谨慎操作"
                                        placement="left"
                                        effect="light"
                                >
                                    <el-button icon="el-icon-delete" type="text" style="color: red;" size="medium"
                                               :disabled="Boolean(scope.row.is_valid)"
                                               @click="handleProductDeleteDialog(scope.row)">
                                        删除
                                    </el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-dialog
                            v-model="productEditDialogVisible"
                            :title="`编辑信息：${currentProductData.current.name}`"
                            width="50%">
                        <el-form label-width="120px">
                            <el-form-item label="商品名称">
                                <el-input
                                        v-model="currentProductData.current.name"
                                        placeholder="Please input"
                                        class="input-with-select"
                                        maxlength="50"
                                        show-word-limit
                                />
                            </el-form-item>
                            <el-form-item label="商品类别">
                                <el-tag>{{currentProductData.current.type_name}}</el-tag>
                                <el-button size="small" style="margin-left: 10px;"
                                           @click="productEditProductTypeDialogVisible = true">更改
                                </el-button>
                            </el-form-item>
                            <el-form-item label="品牌信息">
                                <el-tag>{{currentProductData.current.brand_name}}</el-tag>
                                <el-dropdown style="margin-left: 10px;">
                                    <el-button size="small">
                                        更改
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="brand in brandData"
                                                              @click="handleProductEditBrandClick(brand)">{{brand.name}}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </el-form-item>
                            <el-form-item label="销售单位">
                                <el-tag>{{currentProductData.current.sku}}</el-tag>
                                <el-button size="small" style="margin-left: 10px;"
                                           @click="productEditSKUDialogVisible = true">更改
                                </el-button>
                            </el-form-item>
                            <el-form-item label="单价（人民币）">
                                <el-tag type="success">¥{{Number(currentProductData.current.price).toFixed(2)}}</el-tag>
                                <el-button size="small" style="margin-left: 10px;"
                                           @click="productEditPriceDialogVisible = true">更改
                                </el-button>
                            </el-form-item>
                            <el-form-item label="启用优惠">
                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="启用优惠标签可优先展示商品"
                                        placement="right"
                                >
                                    <el-switch
                                            v-model="currentProductData.current.discount_bool"
                                            @change="handleProductEditDiscountChange"
                                            size="large"/>
                                </el-tooltip>

                            </el-form-item>

                        </el-form>
                        <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoProductEdit">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary" @click="beforeSubmitEditProduct">确定</el-button>
                              </span>
                        </template>

                        <!-- confirm submit -->
                        <el-dialog v-model="productEditConfirmDialogVisible" title="提示" width="30%">
                            <span>您的每次提交都将被系统记录，请仔细核对后提交。</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="productEditConfirmDialogVisible = false">取消</el-button>
                                <el-button type="danger" @click="submitEditProduct">确定</el-button>
                                </span>
                            </template>
                        </el-dialog>

                        <!-- change type -->
                        <el-dialog v-model="productEditProductTypeDialogVisible"
                                   :title="`更改类别：${currentProductData.current.name}`" width="30%">
                            <el-scrollbar height="200px">
                                <el-tree
                                        class="filter-tree"
                                        :data="treeData"
                                        :props="defaultProps"
                                        default-expand-all
                                        :filter-node-method="filterNode"
                                        :default-checked-keys="treeDataDefaultKeys"
                                        @node-click="handleProductEditProductTypeDialogSelectProductType"
                                />
                            </el-scrollbar>
                            <el-tag style="margin-top: 20px;">当前类别：{{currentProductData.current.type_name}}</el-tag>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoProductEditProductType">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary"
                                               @click="productEditProductTypeDialogVisible = false">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>

                        <!-- change sku -->
                        <el-dialog v-model="productEditSKUDialogVisible"
                                   :title="`更改销售单位：${currentProductData.current.name}`" width="30%">
                            <el-form>
                                <el-form-item label="销售单位">
                                    <el-input v-model="currentProductData.current.sku"></el-input>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                       <el-button @click="undoProductEditSKU">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary"
                                               @click="productEditSKU">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>

                        <!-- change price -->
                        <el-dialog v-model="productEditPriceDialogVisible"
                                   :title="`更改单价（人民币）：${currentProductData.current.name}`" width="30%">
                            <el-form>
                                <el-form-item label="单价（人民币）">
                                    <el-input type="number" v-model="currentProductData.current.price"></el-input>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoProductEditPrice">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary"
                                               @click="productEditPrice">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>
                    </el-dialog>

                    <!-- cover -->
                    <el-dialog v-model="productEditCoverDialogVisible" v-loading="productEditCoverDialogLoading"
                               :title="`编辑封面：${currentProductData.current.name}`" width="50%">

                        <el-upload
                                list-type="picture-card"
                                :on-preview="handleProductEditCoverPreview"
                                :on-change="handleProductEditCoverChange"
                                :on-remove="handleProductEditCoverRemove"
                                :file-list="productEditCoverDialogImageList"
                                :limit="5"
                                :auto-upload="false"
                                action="#"
                        >

                            <template #default>
                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content="最多添加5张图片"
                                        placement="top"
                                >
                                    <i class="el-icon-lx-roundadd"></i>
                                </el-tooltip>
                            </template>
                        </el-upload>

                        <el-dialog v-model="productEditCoverPreviewDialogVisible">
                            <img style="width: 100%" :src="productEditCoverPreviewImageURL" alt="Preview Image"/>
                        </el-dialog>

                        <!-- confirm submit -->
                        <el-dialog v-model="productEditCoverConfirmDialogVisible" title="提示" width="30%">
                            <span>您的每次提交都将被系统记录，请仔细核对后提交。</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="productEditCoverConfirmDialogVisible = false">取消</el-button>
                                <el-button type="danger" @click="submitEditProductCover">确定</el-button>
                                </span>
                            </template>
                        </el-dialog>

                        <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoEditProductCover">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary" @click="beforeSubmitEditProductCover">确定</el-button>
                              </span>
                        </template>
                    </el-dialog>

                    <!-- detail -->
                    <el-dialog v-model="productEditDetailDialogVisible" v-loading="productEditDetailDialogLoading"
                               :title="`编辑详情：${currentProductData.current.name}`" width="70%">
                        <div class="container">
                            <div ref='editor'></div>
                        </div>
                        <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoEditProductDetail">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary" @click="beforeSubmitEditProductDetail">确定</el-button>
                              </span>
                        </template>

                        <!-- confirm submit -->
                        <el-dialog v-model="productEditDetailConfirmDialogVisible" title="提示" width="30%">
                            <span>您的每次提交都将被系统记录，请仔细核对后提交。</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="productEditDetailConfirmDialogVisible = false">取消</el-button>
                                <el-button type="danger" @click="submitEditProductDetail">确定</el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </el-dialog>

                    <!-- stock -->
                    <el-dialog v-model="productStockDialogVisible" v-loading="productStockDialogLoading"
                               :title="`进货：${currentProductData.current.name}`" width="70%">
                        <el-form :inline="true" label-width="120px">
                            <el-form-item label="当前库存">
                                <el-tag style="margin-right: 10px;" v-if="currentProductData.current.stock > 0">
                                    {{currentProductData.current.stock}}
                                </el-tag>
                                <el-tag style="margin-right: 10px;" type="danger" v-else>0</el-tag>
                                *
                                <el-tag type="info" effect="plain" style="margin-left: 10px;">
                                    {{currentProductData.current.sku}}
                                </el-tag>
                            </el-form-item>
                            <el-form-item label="添加库存">
                                <el-input v-model="productStock" type="tel" size="small" placeholder="输入库存"/>
                            </el-form-item>
                            <el-form-item>
                                *
                                <el-tag type="info" effect="plain" style="margin-left: 10px;">
                                    {{currentProductData.current.sku}}
                                </el-tag>
                            </el-form-item>
                        </el-form>

                        <template #footer>
                                <span class="dialog-footer">
                                    <el-tooltip
                                            class="box-item"
                                            effect="light"
                                            content="注意：取消操作，系统将还原商品初始信息"
                                            placement="left"
                                    >
                                        <el-button @click="undoProductStock">取消</el-button>
                                    </el-tooltip>
                                    <el-button type="primary" @click="beforeSubmitProductStock">确定</el-button>
                              </span>
                        </template>

                        <!-- confirm submit -->
                        <el-dialog v-model="productStockConfirmDialogVisible" title="提示" width="30%">
                            <span>您的每次提交都将被系统记录，请仔细核对后提交。</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="productStockConfirmDialogVisible = false">取消</el-button>
                                <el-button type="danger" @click="submitProductStock">确定</el-button>
                                </span>
                            </template>
                        </el-dialog>

                    </el-dialog>

                    <!-- delete -->
                    <el-dialog v-model="productDeleteDialogVisible" v-loading="productStockDialogLoading"
                               :title="`删除商品：${currentProductData.current.name}`" width="70%">
                        <span>您真的要删除商品“{{currentProductData.current.name}}”吗？商品删除后将不可恢复！</span>
                        <el-tooltip
                                class="box-item"
                                effect="light"
                                content="输入商品名称，点击“确定”，即可删除商品。"
                                placement="bottom">
                            <el-input v-model="productDeleteInput" style="margin-top: 20px;"></el-input>
                        </el-tooltip>
                        <template #footer>
                                <span class="dialog-footer"
                                      v-if="productDeleteInput === currentProductData.current.name">
                                        <el-button @click="undoProductDelete">取消</el-button>
                                    <el-button type="danger" @click="submitProductDelete">确定</el-button>
                              </span>
                        </template>
                    </el-dialog>

                </el-collapse-item>
            </el-collapse>

            <el-collapse>
                <el-collapse-item title="添加商品" name="2-1">
                    <el-form style="margin-top: 20px;" label-width="120px">

                        <el-form-item label="商品名称">
                            <el-input v-model="addProductData.name"/>
                        </el-form-item>

                        <el-form-item label="商品类别">
                            <el-tag style="margin-right: 10px;" v-if="addProductData.type_id !== 0">
                                {{addProductData.type_name}}
                            </el-tag>
                            <el-button size="small" @click="handleAddProductProductTypeDialog">选择类别</el-button>
                        </el-form-item>

                        <el-form-item label="品牌信息">
                            <el-tag style="margin-right: 10px;" v-if="addProductData.brand_id !== 0">
                                {{addProductData.brand_name}}
                            </el-tag>
                            <el-dropdown>
                                <el-button size="small">
                                    选择品牌
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item v-for="brand in brandData"
                                                          @click="handleAddProductBrandClick(brand)">{{brand.name}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-form-item>


                        <el-form-item label="销售单位">
                            <el-tooltip
                                    class="box-item"
                                    effect="light"
                                    content="示例：斤/500g，瓶/200g，只/5kg，不含空格"
                                    placement="bottom">
                                <el-input v-model="addProductData.sku"/>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="单价（人民币）">
                            <el-input v-model="addProductData.price" type="number"/>
                        </el-form-item>

                        <el-form :inline="true" label-width="120px">
                            <el-form-item style="margin-left: 120px;">
                                <el-button @click="beforeAddProductClear">清空</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-tooltip
                                        class="box-item"
                                        effect="light"
                                        content='提交商品基本信息后，请使用“编辑商品”功能编辑封面与商品详情'
                                        placement="right"
                                >
                                    <el-button type="primary" @click="beforeSubmitAddProduct">提交</el-button>
                                </el-tooltip>
                            </el-form-item>
                        </el-form>

                        <el-dialog
                                v-model="addProductProductTypeDialogVisible"
                                title="选择类别"
                                width="30%">
                            <el-scrollbar height="200px">
                                <el-tree
                                        class="filter-tree"
                                        :data="treeData"
                                        :props="defaultProps"
                                        default-expand-all
                                        :filter-node-method="filterNode"
                                        :default-checked-keys="treeDataDefaultKeys"
                                        @node-click="handleAddProductProductTypeDialogSelectProductType"
                                />
                            </el-scrollbar>
                            <el-tag style="margin-top: 20px;"
                                    v-if="addProductDataSelectedProductType.hasOwnProperty('name') ">
                                已选类别：{{addProductDataSelectedProductType.name}}
                            </el-tag>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="undoAddProductProductTypeSelect">取消</el-button>
                                    <el-button type="primary"
                                               v-if="addProductDataSelectedProductType.hasOwnProperty('id')"
                                               @click="handleAddProductProductTypeDialogConfirm">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>

                        <el-dialog
                                v-model="addProductClearDialogVisible"
                                title="提示"
                                width="30%">
                            <span>清空全部内容？</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="addProductClearDialogVisible = false">取消</el-button>
                                    <el-button type="primary" @click="handleAddProductClear">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>

                        <el-dialog
                                v-model="addProductDialogVisible"
                                title="提示"
                                width="30%">
                            <span>确定添加商品“{{addProductData.name}}”吗？</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="addProductDialogVisible = false">取消</el-button>
                                    <el-button type="primary" @click="submitAddProduct">确定</el-button>
                              </span>
                            </template>
                        </el-dialog>
                    </el-form>
                </el-collapse-item>
            </el-collapse>

        </el-card>
    </div>
</template>

<script>
    import {ElMessage} from "element-plus";
    import {ref, reactive, onMounted, onBeforeUnmount} from "vue";
    import WangEditor from "wangEditor";
    import lodash from "lodash";
    import {
        addProduct,
        addProductType, editProduct,
        editProductType, getBrand,
        getProduct, getProductById,
        getProductByName,
        getProductType,
        getProductTypeByName, preuploadProductCoverImage, preuploadProductDetailImage, preuploadSwiperImage
    } from "../api";
    import VersatileHelper from "../utils/versatile_helper";
    import VerificationHelper from "../utils/verification_helper";
    import TimeHelper from "../utils/time_helper";
    import {useRouter} from "vue-router";


    export default {
        name: "edit_item",

        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label',
                },

                treeData: [],

                // product type
                searchProductTypeInput: "",
                searchProductTypeData: [],
                searchProductTypeTableLoading: false,
                productTypeRenameDialogVisible: false,
                productTypeRenameData: {
                    currentProductTypeData: {},
                    newName: ""
                },
                deleteProductTypeDialogVisible: false,
                deleteProductTypeData: {
                    currentProductTypeData: {}
                },
                treeDataDefaultKeys: [],
                currentProductTypeData: {},
                addProductTypeData: {
                    name: "",
                    useParent: false,
                    parent: {}
                },
                addProductTypeDialogVisible: false,

                // product
                productPageSize: 0,
                productPageIndex: 0,
                totalProductPage: 0,
                totalProduct: 0,
                productTableLoading: false,
                productData: [],
                searchProductData: [],
                searchProductTableLoading: false,
                currentProductData: {
                    previous: {},
                    current: {}
                },
                brandData: [],

                searchProductInput: "",
                productEditProductTypeDialogVisible: false,
                productEditDialogVisible: false,
                productEditSKUDialogVisible: false,
                productEditPriceDialogVisible: false,
                productEditConfirmDialogVisible: false,

                productEditCoverDialogVisible: false,
                productEditCoverDialogLoading: false,
                productEditCoverPreviewDialogVisible: false,
                productEditCoverPreviewImageURL: "",
                productEditCoverDialogImageList: [],
                productEditCoverDialogImageTempFileList: [],
                productEditCoverConfirmDialogVisible: false,

                productEditDetailDialogVisible: false,
                productEditDetailDialogLoading: false,
                editor: ref("editor"),
                editorInstance: null,
                productEditDetailConfirmDialogVisible: false,

                productStockDialogVisible: false,
                productStockDialogLoading: false,
                productStockConfirmDialogVisible: false,
                productStock: 0,

                productDeleteDialogVisible: false,
                productDeleteInput: "",

                addProductData: {
                    name: "",
                    type_id: 0,
                    type_name: "",
                    brand_id: 0,
                    brand_name: "",
                    sku: "",
                    price: 0
                },
                addProductDataSelectedProductType: {},
                addProductDialogVisible: false,
                addProductClearDialogVisible: false,
                addProductProductTypeDialogVisible: false
            }
        },

        watch: {
            searchProductTypeInput: function () {
                if (this.searchProductTypeInput === "") {
                    this.searchProductTypeData = [];
                    return;
                }
                this.debouncedSearchProductType();
            },

            searchProductInput: function () {
                if (this.searchProductInput === "") {
                    this.searchProductData = VersatileHelper.clone_object(this.productData);
                    return;
                }
                this.debouncedSearchProduct();
            },

            productEditCoverDialogVisible: function () {
                if (!this.productEditCoverDialogVisible) {
                    this.productEditCoverDialogImageTempFileList = [];
                    this.productEditCoverDialogImageList = [];
                }
            },

            productEditDetailDialogVisible: function () {
                if (!this.productEditDetailDialogVisible) {
                    this.editorInstance.txt.clear();
                }
            },

            productStockDialogVisible: function () {
                if (!this.productStockDialogVisible) {
                    this.productStock = 0;
                }
            },

            productDeleteDialogVisible: function () {
                if (!this.productDeleteDialogVisible) {
                    this.productDeleteInput = "";
                }
            },

            addProductProductTypeDialogVisible: function () {
                if (!this.addProductProductTypeDialogVisible) {
                    this.addProductDataSelectedProductType = {}
                }
            }
        },

        methods: {

            // product type
            async getProductType() {
                let result = await getProductType();
                if (result.code === 200) {
                    for (let i = 0; i < result.info.length; i++) {
                        if (result.info[i].is_valid) {
                            this.treeDataDefaultKeys.push(result.info[i].id);
                        }
                    }
                    this.treeData = VersatileHelper.listToTree(result.info);
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async searchProductType() {
                if (this.searchProductTypeInput === "" || this.searchProductTypeInput === "类") return;
                this.searchProductTypeTableLoading = true;
                let result = await getProductTypeByName(this.searchProductTypeInput);
                if (result.code === 200) {
                    let data = result.info;
                    for (let i = 0; i < data.length; i++) {
                        data[i].time_modified_string = TimeHelper.convert_date_to_date_time_string(new Date(data[i].time_modified));
                    }
                    this.searchProductTypeData = data;
                    this.searchProductTypeTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.includes(value);
            },

            handleUseParentChange(e) {
                if (!e) {
                    this.addProductTypeData.parent = {}
                }
            },

            handleTreeSelectParent(node, data, value) {
                this.addProductTypeData.parent = node;
            },

            handleProductTypeRenameDialog(e) {
                this.productTypeRenameData.currentProductTypeData = e;
                this.productTypeRenameDialogVisible = true;
            },

            handleDeleteProductTypeDialog(e) {
                this.deleteProductTypeData.currentProductTypeData = e;
                this.deleteProductTypeDialogVisible = true;
            },

            handleAddProductTypeDialog() {
                if (VerificationHelper.realname_verification(this.addProductTypeData.name).has_error) {
                    ElMessage.warning("商品类别名称不能为空，须为汉字！");
                    return;
                }
                this.addProductTypeDialogVisible = true;
            },

            async submitProductTypeRename() {
                let new_name = this.productTypeRenameData.newName;
                if (VerificationHelper.realname_verification(new_name).has_error) {
                    ElMessage.warning("商品类别名称不能为空，须为汉字！");
                    return;
                }
                if (new_name === this.productTypeRenameData.currentProductTypeData.name) {
                    ElMessage.warning("新的名称与原名相同！");
                    return;
                }
                let result = await editProductType({
                    type: "rename",
                    id: this.productTypeRenameData.currentProductTypeData.id,
                    admin_id: localStorage.getItem("user_id"),
                    old_name: this.productTypeRenameData.currentProductTypeData.name,
                    new_name: new_name
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getProductType();
                    await this.searchProductType();
                    this.$forceUpdate();
                    this.productTypeRenameDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.productTypeRenameDialogVisible = false;
                }
            },

            async submitDeleteProductType() {
                let result = await editProductType({
                    type: "delete",
                    id: this.deleteProductTypeData.currentProductTypeData.id,
                    admin_id: localStorage.getItem("user_id"),
                });
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getProductType();
                    await this.searchProductType();
                    this.$forceUpdate();
                    this.deleteProductTypeDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.deleteProductTypeDialogVisible = false;
                }
            },

            async submitAddProductType() {
                let name = this.addProductTypeData.name, parent_id, depth;
                if (this.addProductTypeData.useParent) {
                    if (!this.addProductTypeData.parent.id) {
                        ElMessage.warning("请选择父类，或关闭“使用父类”选项！");
                        return;
                    }
                    parent_id = this.addProductTypeData.parent.id;
                    depth = this.addProductTypeData.parent.depth + 1;
                } else {
                    parent_id = 0;
                    depth = 0;
                }
                let admin_id = localStorage.getItem("user_id");
                let result = await addProductType(admin_id, name, parent_id, depth);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    this.addProductTypeData.name = "";
                    this.addProductTypeData.useParent = false;
                    this.addProductTypeData.parent = {}
                    await this.getProductType();
                    await this.searchProductType();
                    this.addProductTypeDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.addProductTypeDialogVisible = false;
                }
            },

            // product
            async getProduct() {
                this.productTableLoading = true;
                let result = await getProduct(this.productPageIndex);
                if (result.code === 200) {
                    let data = result.info.data;
                    let pageSize = result.info.page_size;
                    let totalPage = result.info.total_page;
                    let totalProduct = result.info.total_product;
                    for (let i = 0; i < data.length; i++) {
                        data[i].time_modified_string = TimeHelper.convert_date_to_date_time_string(new Date(data[i].time_modified));
                        data[i].image_url = JSON.parse(data[i].image_url);
                        for (let j = 0; j < data[i].image_url.length; j++) {
                            data[i].image_url[j] = VersatileHelper.parse_url(data[i].image_url[j]);
                            data[i].cover = data[i].image_url[0]
                        }
                    }
                    this.productPageSize = pageSize;
                    this.totalProductPage = totalPage;
                    this.totalProduct = totalProduct;
                    this.productData = VersatileHelper.clone_object(data);
                    this.searchProductData = VersatileHelper.clone_object(data);
                    this.productTableLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                    this.productTableLoading = false;
                }
            },

            handleProductPaginationCurrentClick(e) {
                this.productPageIndex = e - 1;
                this.getProduct();
            },

            async searchProduct() {
                if (this.searchProductInput === "") return;
                this.searchProductTableLoading = true;
                let result = await getProductByName(this.searchProductInput);
                if (result.code === 200) {
                    let data = result.info;
                    for (let i = 0; i < data.length; i++) {
                        data[i].time_modified_string = TimeHelper.convert_date_to_date_time_string(new Date(data[i].time_modified));
                        data[i].image_url = JSON.parse(data[i].image_url);
                        for (let j = 0; j < data[i].image_url.length; j++) {
                            data[i].image_url[j] = VersatileHelper.parse_url(data[i].image_url[j]);
                            data[i].cover = data[i].image_url[0]
                        }
                    }
                    this.searchProductData = data;
                    this.searchProductTableLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                    this.searchProductTableLoading = false;
                }
            },

            async handleProductEditDialog(e) {
                let result = await getProductById(e.id);
                if (result.code === 200) {
                    let data = result.info;
                    data.time_modified = new Date(data.time_modified);
                    data.time_modified_string = TimeHelper.convert_date_to_date_time_string(data.time_modified);
                    data.discount_bool = Boolean(data.discount);
                    console.log(data);
                    this.currentProductData.previous = VersatileHelper.clone_object(data);
                    this.currentProductData.current = VersatileHelper.clone_object(data);
                    this.productEditDialogVisible = true;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleProductEditBrandClick(e) {
                this.currentProductData.current.brand_name = e.name;
                this.currentProductData.current.brand_id = e.id;
            },

            undoProductEdit() {
                this.productEditDialogVisible = false;
                this.currentProductData.current = VersatileHelper.clone_object(this.currentProductData.previous);
            },

            handleProductEditProductTypeDialogSelectProductType(e) {
                this.currentProductData.current.type_name = e.name;
                this.currentProductData.current.type_id = e.id;
            },

            undoProductEditProductType() {
                this.currentProductData.current.type_name = this.currentProductData.previous.type_name;
                this.currentProductData.current.type_id = this.currentProductData.previous.type_id;
                this.productEditProductTypeDialogVisible = false;
            },

            undoProductEditSKU() {
                this.currentProductData.current.sku = this.currentProductData.previous.sku;
                this.productEditSKUDialogVisible = false;
            },

            undoProductEditPrice() {
                this.currentProductData.current.price = this.currentProductData.previous.price;
                this.productEditPriceDialogVisible = false;
            },

            productEditSKU() {
                if (!this.currentProductData.current.sku.length || VerificationHelper.contains_space(this.currentProductData.current.sku)) {
                    ElMessage.warning("输入内容不合规范（如：斤/500g，请重新输入！");
                } else {
                    this.productEditSKUDialogVisible = false;
                }
            },

            productEditPrice() {
                if (!VerificationHelper.price_verification(this.currentProductData.current.price)) {
                    ElMessage.warning("输入内容不合规范（如：100.00），请重新输入！");
                } else if (Number(this.currentProductData.current.price) > 5000) {
                    ElMessage.warning("单价（人民币）过高！");
                } else {
                    this.productEditPriceDialogVisible = false;
                }
            },

            handleProductEditDiscountChange(e) {
                this.currentProductData.current.discount_bool = e ? true : false;
                this.currentProductData.current.discount = e ? 1 : 0;
            },

            handleProductEnableDialog(e) {
                let productId = e.id;
                let adminId = localStorage.getItem("user_id");
                this.currentProductData.previous = e;
                let params = {
                    product_id: productId,
                    admin_id: adminId,
                    type: "enable"
                };
                this.editProductOperation(params);
            },

            handleProductStockDialog(e) {
                this.currentProductData.previous = VersatileHelper.clone_object(e);
                this.currentProductData.current = VersatileHelper.clone_object(e);
                this.productStockDialogVisible = true;
            },

            handleProductDisableDialog(e) {
                let productId = e.id;
                let adminId = localStorage.getItem("user_id");
                this.currentProductData.previous = VersatileHelper.clone_object(e);
                let params = {
                    product_id: productId,
                    admin_id: adminId,
                    type: "disable"
                };
                this.editProductOperation(params);
            },

            handleProductDeleteDialog(e) {
                if (e.stock > 0) {
                    ElMessage.warning("商品库存尚未清空，不能删除。建议点击“下架”，下架商品！");
                } else {
                    this.currentProductData.previous = VersatileHelper.clone_object(e);
                    this.currentProductData.current = VersatileHelper.clone_object(e);
                    this.productDeleteDialogVisible = true;
                }
            },

            undoProductDelete() {
                this.productDeleteInput = "",
                    this.productDeleteDialogVisible = false;
            },

            async submitProductDelete() {
                let params = {
                    product_id: this.currentProductData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "delete",
                    previous: this.currentProductData.previous,
                    current: this.currentProductData.current
                };
                let result = await editProduct(params);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getProduct();
                    await this.searchProduct();
                    this.productDeleteDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async editProductOperation(params) {
                this.searchProductTableLoading = true;
                let result = await editProduct(params);
                if (result.code === 200) {
                    await this.getProduct();
                    await this.searchProduct();
                    ElMessage.success(result.message);
                    this.searchProductTableLoading = false;
                } else {
                    ElMessage.warning(result.message);
                    this.searchProductTableLoading = false;
                }
            },

            async beforeSubmitEditProduct() {
                if (VersatileHelper.object_equal(this.currentProductData.current, this.currentProductData.previous)) {
                    ElMessage.warning("商品信息未改动，无需提交！");
                } else {
                    this.productEditConfirmDialogVisible = true;
                }
            },

            async submitEditProduct() {
                let params = {
                    product_id: this.currentProductData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "edit_info",
                    previous: this.currentProductData.previous,
                    current: this.currentProductData.current
                };
                let result = await editProduct(params);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getProduct();
                    await this.searchProduct();
                    this.productEditConfirmDialogVisible = false;
                    this.productEditDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async handleProductEditCoverDialog(e) {
                this.productEditCoverDialogVisible = true;
                this.productEditCoverDialogLoading = true;
                let result = await getProductById(e.id);
                if (result.code === 200) {
                    let data = result.info;
                    data.time_modified = new Date(data.time_modified);
                    data.time_modified_string = TimeHelper.convert_date_to_date_time_string(data.time_modified);
                    data.discount_bool = Boolean(data.discount);
                    data.image_url = JSON.parse(data.image_url);
                    this.currentProductData.previous = VersatileHelper.clone_object(data);
                    this.currentProductData.current = VersatileHelper.clone_object(data);
                    this.productEditCoverDialogImageList = [];
                    for (let i = 0; i < data.image_url.length; i++) {
                        this.productEditCoverDialogImageList.push({
                            url: VersatileHelper.parse_url(data.image_url[i]),
                            name: (i + 1).toString()
                        });
                        this.productEditCoverDialogImageTempFileList = VersatileHelper.clone_object(this.productEditCoverDialogImageList);
                    }
                    this.productEditCoverDialogLoading = false;
                    this.$forceUpdate();
                } else {
                    ElMessage.warning(result.message);
                    this.productEditCoverDialogLoading = false;
                }
            },

            handleProductEditCoverPreview(e) {
                this.productEditCoverPreviewImageURL = e.url;
                this.productEditCoverPreviewDialogVisible = true;
            },

            async handleProductEditCoverChange(res, file) {
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
                form.append("product_cover_image", tempFile.raw);
                let result = await preuploadProductCoverImage(form);
                if (result.code === 200) {
                    let url = VersatileHelper.parse_url(result.info.path);
                    file[file.length - 1].url = url;
                    this.productEditCoverDialogImageTempFileList.push({
                        url: VersatileHelper.parse_url(url),
                        name: (this.productEditCoverDialogImageTempFileList.length + 1).toString()
                    });
                } else {
                    ElMessage.warning(result.message);
                }
            },

            handleProductEditCoverRemove(res, file) {
                this.productEditCoverDialogImageTempFileList = [];
                for (let i = 0; i < file.length; i++) {
                    this.productEditCoverDialogImageTempFileList.push({
                        url: file[i].url,
                        name: (i + 1).toString()
                    });
                }
            },


            undoEditProductCover() {
                this.productEditCoverDialogImageList = [];
                this.productEditCoverDialogImageTempFileList = [];
                this.productEditCoverDialogVisible = false;
            },

            beforeSubmitEditProductCover() {
                if (!this.productEditCoverDialogImageTempFileList.length) {
                    ElMessage.warning("至少选择一张图片！");
                } else {
                    this.productEditCoverConfirmDialogVisible = true;
                }
            },

            async submitEditProductCover() {
                let image_url = [];
                for (let i = 0; i < this.productEditCoverDialogImageTempFileList.length; i++) {
                    image_url.push(VersatileHelper.redo_url(this.productEditCoverDialogImageTempFileList[i].url));
                }
                let params = {
                    product_id: this.currentProductData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "edit_cover",
                    previous: {
                        id: this.currentProductData.current.id,
                        image_url: VersatileHelper.clone_object(this.currentProductData.previous.image_url)
                    },
                    current: {
                        id: this.currentProductData.current.id,
                        image_url: image_url
                    }
                };
                let result = await editProduct(params);
                if (result.code === 200) {
                    await this.getProduct();
                    await this.searchProduct();
                    ElMessage.success(result.message);
                    this.productEditCoverDialogImageList = [];
                    this.productEditCoverDialogImageTempFileList = [];
                    this.productEditCoverConfirmDialogVisible = false;
                    this.productEditCoverDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.productEditCoverConfirmDialogVisible = false;
                }
            },

            async handleProductEditDetailDialog(e) {
                this.productEditDetailDialogVisible = true;
                this.productEditDetailDialogLoading = true;
                let result = await getProductById(e.id);
                if (result.code === 200) {
                    let data = result.info;
                    data.time_modified = new Date(data.time_modified);
                    data.time_modified_string = TimeHelper.convert_date_to_date_time_string(data.time_modified);
                    data.discount_bool = Boolean(data.discount);
                    this.currentProductData.previous = VersatileHelper.clone_object(data);
                    this.currentProductData.current = VersatileHelper.clone_object(data);
                    this.productEditDetailDialogVisible = true;
                    this.initEditor();
                } else {
                    ElMessage.warning(result.message);
                    this.productEditDetailDialogVisible = false;
                }
            },

            initEditor() {
                setTimeout(() => {
                    if (this.editorInstance !== null) {
                        this.editorInstance.txt.clear();
                    } else {
                        this.editor = this.$refs.editor;
                        this.editorInstance = new WangEditor(this.editor);
                        this.editorInstance.config.zIndex = 1;
                        this.editorInstance.config.showLinkImg = false;
                        this.editorInstance.config.uploadImgMaxLength = 15;
                        this.editorInstance.config.uploadImgMaxSize = 3 * 1024 * 1024;
                        this.editorInstance.config.customUploadImg = async (files, insert) => {
                            let form = new FormData();
                            form.append('product_detail_image', files[0]);
                            let result = await preuploadProductDetailImage(form);
                            console.log(result);
                            if (result.code === 200) {
                                let url = VersatileHelper.parse_url(result.info.path);
                                insert(url);
                            }
                        }
                        this.editorInstance.config.onchange = (html) => {
                        }
                        this.editorInstance.create();
                    }
                    this.editorInstance.txt.html(this.currentProductData.current.detail);
                    this.productEditDetailDialogLoading = false;
                }, 250);
            },

            undoEditProductDetail() {
                this.currentProductData.current = VersatileHelper.clone_object(this.currentProductData.previous);
                this.productEditDetailDialogVisible = false;
            },

            beforeSubmitEditProductDetail() {
                if (this.currentProductData.previous.detail === this.editorInstance.txt.html()) {
                    ElMessage.warning("商品详情未改动，无需提交！");
                } else {
                    this.productEditDetailConfirmDialogVisible = true;
                }
            },

            async submitEditProductDetail() {
                let detail = this.editorInstance.txt.html();
                let params = {
                    product_id: this.currentProductData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "edit_detail",
                    previous: {
                        id: this.currentProductData.current.id,
                        detail: this.currentProductData.current.detail
                    },
                    current: {
                        id: this.currentProductData.current.id,
                        detail: detail
                    }
                };
                console.log(params);
                let result = await editProduct(params);
                console.log(result);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    await this.getProduct();
                    await this.searchProduct();
                    this.editorInstance.txt.clear();
                    this.productEditDetailConfirmDialogVisible = false;
                    this.productEditDetailDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.productEditDetailConfirmDialogVisible = false;
                }
            },

            beforeSubmitProductStock() {
                if (!VerificationHelper.quantity_verification(this.productStock)) {
                    ElMessage.warning("进货量须为正整数！");
                } else if (Number(this.productStock) > 1000) {
                    ElMessage.warning("每次添加货品单位不能大于1000！");
                } else {
                    this.productStockConfirmDialogVisible = true;
                }
            },

            undoProductStock() {
                this.productStock = 0;
                this.productStockDialogVisible = false;
            },

            async submitProductStock() {
                let params = {
                    product_id: this.currentProductData.current.id,
                    admin_id: localStorage.getItem("user_id"),
                    type: "stock",
                    previous: {
                        id: this.currentProductData.previous.id,
                        stock: Number(this.currentProductData.previous.stock)
                    },
                    current: {
                        id: this.currentProductData.previous.id,
                        stock: Number(this.productStock) + Number(this.currentProductData.previous.stock)
                    }
                };
                let result = await editProduct(params);
                if (result.code === 200) {
                    console.log(result);
                    await this.getProduct();
                    await this.searchProduct();
                    ElMessage.success(result.message);
                    this.productStock = 0;
                    this.productStockConfirmDialogVisible = false;
                    this.productStockDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                    this.productStockConfirmDialogVisible = false;
                }
            },

            handleAddProductBrandClick(e) {
                this.addProductData.brand_id = e.id;
                this.addProductData.brand_name = e.name;
            },

            handleAddProductProductTypeDialog() {
                this.addProductProductTypeDialogVisible = true;
            },

            handleAddProductProductTypeDialogSelectProductType(e) {
                this.addProductDataSelectedProductType = VersatileHelper.clone_object(e);
            },

            undoAddProductProductTypeSelect() {
                this.addProductProductTypeDialogVisible = false;
                this.addProductDataSelectedProductType = {};
            },

            handleAddProductProductTypeDialogConfirm() {
                this.addProductData.type_id = this.addProductDataSelectedProductType.id;
                this.addProductData.type_name = this.addProductDataSelectedProductType.name;
                this.addProductProductTypeDialogVisible = false;
            },

            beforeAddProductClear() {
                this.addProductClearDialogVisible = true;
            },

            handleAddProductClear() {
                this.addProductClearDialogVisible = false;
                this.addProductData = {
                    name: "",
                    type_id: 0,
                    type_name: "",
                    brand_id: 0,
                    brand_name: "",
                    sku: "",
                    price: 0
                };
                this.addProductDataSelectedProductType = {};
            },

            beforeSubmitAddProduct() {
                if (this.addProductData.name === "") {
                    ElMessage.warning("商品名称不能为空！");
                    return;
                }
                if (this.addProductData.type_id === 0) {
                    ElMessage.warning("请选择商品类别！");
                    return;
                }
                if (this.addProductData.brand_id === 0) {
                    ElMessage.warning("请选择品牌信息！");
                    return;
                }
                if (!this.addProductData.sku.length || VerificationHelper.contains_space(this.addProductData.sku)) {
                    ElMessage.warning("销售单位不合规范！");
                }
                if (!VerificationHelper.price_verification(this.addProductData.price)) {
                    ElMessage.warning("单价不合规范（如：100.00），请重新输入！");
                    return;
                }
                if (Number(this.addProductData.price) > 5000) {
                    ElMessage.warning("单价（人民币）过高！");
                    return;
                }
                this.addProductDialogVisible = true;
            },

            async submitAddProduct() {
                let admin_id = localStorage.getItem("user_id");
                let name = this.addProductData.name;
                let type_id = this.addProductData.type_id;
                let brand_id = this.addProductData.brand_id;
                let sku = this.addProductData.sku;
                let price = this.addProductData.price;
                let result = await addProduct(admin_id, name, type_id, brand_id, sku, price);
                if (result.code === 200) {
                    ElMessage.success(result.message);
                    this.handleAddProductClear();
                    await this.getProduct();
                    await this.searchProduct();
                    this.addProductDialogVisible = false;
                } else {
                    ElMessage.warning(result.message);
                }
            },

            async getBrand() {
                let result = await getBrand();
                console.log(result);
                if (result.code === 200) {
                    this.brandData = result.info;
                } else {
                    ElMessage.warning(result.message);
                }
            },

        },

        created() {
            this.debouncedSearchProductType = lodash.debounce(this.searchProductType, 250);
            this.debouncedSearchProduct = lodash.debounce(this.searchProduct, 250);
        },

        mounted() {
            this.getProductType();
            this.getProduct();
            this.getBrand();
        }
    }

</script>

<style scoped>
    .el-popper.is-customized {
        /* Set padding to ensure the height is 32px */
        padding: 6px 12px;
        background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
    }

    .el-popper.is-customized .el-popper__arrow::before {
        background: linear-gradient(45deg, #b2e68d, #bce689);
        right: 0;
    }
</style>