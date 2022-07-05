<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-grid"></i> 商品管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script>
    import { useRouter } from "vue-router";
    export default {
        name: "add_item",
        setup() {
            const router = useRouter();
            const goBack = () => {
                router.go(-1);
            };
            return {
                goBack,
            };
        },
    };
</script>

<style scoped>

</style>