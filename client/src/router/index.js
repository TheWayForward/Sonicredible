import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '首页'
                },
                component: () => import ("../views/dashboard.vue")
            },
            {
                path: "/user_management",
                name: "user_management",
                meta: {
                    title: "用户管理"
                },
                component: () => import("../views/user_management.vue")
            },
            {
                path: "/audio_print_management",
                name: "audio_print_management",
                meta: {
                    title: "声纹识别音频管理"
                },
                component: () => import("../views/audio_print_management.vue")
            },
            {
                path: "/audio_recognition_management",
                name: "audio_recognition_management",
                meta: {
                    title: "语义识别音频管理"
                },
                component: () => import("../views/audio_recognition_management.vue")
            },
            {
                path: "/audio_command_management",
                name: "audio_command_management",
                meta: {
                    title: "语义识别音频管理"
                },
                component: () => import("../views/audio_command_management.vue")
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | Sonicredible 声不凡`;
    const token = localStorage.getItem("token");
    if (token && to.path === "login") {
        next("/dashboard");
    }
    if (!token && to.path !== "/login") {
        next("/login");
    } else {
        next();
    }
});

export default router;