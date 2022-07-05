import request from '../utils/request';

import ajax from "../api/ajax";
import ajax_fileupload from "../api/ajax_fileupload";

// const BASE_URL = "http://127.0.0.1:3000/api/admin";

const BASE_URL = "https://miemie.com.cn/api/admin";

export const login = (username, password) => ajax({
    url: `${BASE_URL}/login`,
    params: {
        username: username,
        password: password
    },
    method: "POST"
});

export const getDashboardGraphData = () => ajax({
    url: `${BASE_URL}/get_dashboard_graph_data`,
    method: "POST"
});

export const getWechatminiprogramSwiper = () => ajax({
    url: `${BASE_URL}/get_wechat_miniprogram_swiper`,
    method: "POST"
});


export const preuploadSwiperImage = (form) => ajax_fileupload(`${BASE_URL}/preupload_swiper_image`, form);

export const editSwiper = (params) => ajax({
    url: `${BASE_URL}/edit_swiper`,
    method: "POST",
    params: params
});

export const getProductType = () => ajax({
    url: `${BASE_URL}/get_product_type`,
    method: "POST",
});

export const addProductType = (admin_id, name, parent_id, depth) => ajax({
    url: `${BASE_URL}/add_product_type`,
    method: "POST",
    params: {
        admin_id: admin_id,
        name: name,
        parent_id: parent_id,
        depth: depth
    }
});

export const getProductTypeByName = (name) => ajax({
    url: `${BASE_URL}/get_product_type_by_name`,
    method: "POST",
    params: {
        name: name
    }
});

export const editProductType = (params) => ajax({
    url: `${BASE_URL}/edit_product_type`,
    method: "POST",
    params: params
});

export const getProduct = (page_index) => ajax({
    url: `${BASE_URL}/get_product`,
    method: "POST",
    params: {
        page_index: page_index
    }
});

export const getProductByName = (name) => ajax({
    url: `${BASE_URL}/get_product_by_name`,
    method: "POST",
    params: {
        name: name
    }
});

export const getProductById = (product_id) => ajax({
    url: `${BASE_URL}/get_product_by_id`,
    method: "POST",
    params: {
        product_id: product_id
    }
});

export const editProduct = (params) => ajax({
    url: `${BASE_URL}/edit_product`,
    method: "POST",
    params: params
});

export const addProduct = (admin_id, name, type_id, brand_id, sku, price) => ajax({
    url: `${BASE_URL}/add_product`,
    method: "POST",
    params: {
        admin_id: admin_id,
        name: name,
        type_id: type_id,
        brand_id: Number(brand_id),
        sku: sku,
        price: Number(price)
    }
});

export const getBrand = () => ajax({
    url: `${BASE_URL}/get_brand`,
    method: "POST"
});

export const getUserOrder = (type, page_index) => ajax({
    url: `${BASE_URL}/get_user_order`,
    method: "POST",
    params: {
        type: type,
        page_index: page_index
    }
});

export const getUserOrderBySerial = (serial) => ajax({
    url: `${BASE_URL}/get_user_order_by_serial`,
    method: "POST",
    params: {
        serial: serial
    }
});

export const getUserOrderItemByOrderId = (order_id) => ajax({
    url: `${BASE_URL}/get_user_order_item_by_order_id`,
    method: "POST",
    params: {
        order_id: order_id
    }
});

export const updateUserOrder = (params) => ajax({
    url: `${BASE_URL}/update_user_order`,
    method: "POST",
    params: params
});

export const getLogisticsCompany = () => ajax({
    url: `${BASE_URL}/get_logistics_company`,
    method: "POST",
    params: {}
});

export const getTrackData = (logistics_company_code, shipping_serial, tel) => ajax({
    url: `${BASE_URL}/track_user_shipping`,
    method: "POST",
    params: {
        logistics_company_code: logistics_company_code,
        shipping_serial: shipping_serial,
        tel: tel
    }
});

export const preuploadProductDetailImage = (form) => ajax_fileupload(`${BASE_URL}/preupload_product_detail_image`, form);

export const preuploadProductCoverImage = (form) => ajax_fileupload(`${BASE_URL}/preupload_product_cover_image`, form);



