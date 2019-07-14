<template>
    <a-layout id="main-site">
        <a-layout-sider
            :trigger="null"
            collapsible
            v-model="collapsed">
            <div class="logo"/>
            <a-menu theme="dark" mode="inline"  v-model="current">
                <a-menu-item key="/">
                    <n-link to="/">
                        <a-icon type="bar-chart"/>
                        <span>Báo cáo</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="/ban-hang/">
                    <n-link to="/ban-hang/">
                        <a-icon type="shopping-cart"/>
                        <span>Bán hàng</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="/don-hang/">
                    <n-link to="/don-hang/">
                        <a-icon type="shopping-cart"/>
                        <span>Đơn hàng</span>
                    </n-link>
                </a-menu-item>
                <a-sub-menu key="/san-pham/">
                    <div slot="title">
                        <n-link to="/san-pham/">
                            <a-icon type="file"/>
                            <span>Sản phẩm</span>
                        </n-link>
                    </div>
                    <a-menu-item key="/san-pham/kho">
                        <n-link to="/san-pham/kho/">Kho hàng</n-link>
                    </a-menu-item>
                    <a-menu-item key="/san-pham/danh-muc/">
                        <n-link to="/san-pham/danh-muc/">Danh mục</n-link>
                    </a-menu-item>
                    <a-menu-item key="/san-pham/the/">
                        <n-link to="/san-pham/the/">Thẻ</n-link>
                    </a-menu-item>
                    <a-menu-item key="/san-pham/nhap-kho/">
                        <n-link to="/san-pham/nhap-kho/">Nhập kho</n-link>
                    </a-menu-item>
                </a-sub-menu>

                <a-menu-item key="/khach-hang/">
                    <n-link to="/khach-hang/">
                        <a-icon type="user"/>
                        <span>Khách hàng</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="/van-chuyen/">
                    <n-link to="/van-chuyen/">
                        <a-icon type="car"/>
                        <span>Vận chuyển</span>
                    </n-link>
                </a-menu-item>
                <a-menu-item key="/nhan-vien/">
                    <n-link to="/nhan-vien/">
                        <a-icon type="team"/>
                        <span>Nhân viên</span>
                    </n-link>
                </a-menu-item>
                <a-sub-menu key="/cau-hinh/">
                    <div slot="title">
                        <n-link to="/cau-hinh/">
                            <a-icon type="setting"/>
                            <span>Cấu hình</span>
                        </n-link>
                    </div>
                    <a-menu-item key="/cau-hinh/destination">
                        <n-link to="/cau-hinh/destination">
                            <a-icon type="pushpin"/>
                            <span>Địa danh</span>
                        </n-link>
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0 16px;">
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="()=> collapsed = !collapsed"
                />
                <div v-if="!$auth.loggedIn" style="float: right">
                    <a-button @click="visible = true" type="primary">
                        <a-icon type="edit"/>
                        Đăng nhập
                    </a-button>
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                <nuxt/>
            </a-layout-content>
        </a-layout>
        <a-drawer
            title="Đăng nhập hệ thống"
            :width="520"
            :visible="visible"
            @close="visible = false"
            :wrapStyle="{overflow: 'auto'}">
            <Login @done="visible = false"/>
        </a-drawer>
    </a-layout>
</template>

<script>
    import Login from '../components/Staff/Login'

    export default {
        data() {
            let current = [this.$route.path || 0]
            return {
                collapsed: false,
                visible: false,
                current
            }
        },
        components: {
            Login
        }
    }
</script>
<style>

</style>
