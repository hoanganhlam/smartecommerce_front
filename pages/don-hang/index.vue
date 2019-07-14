<template>
    <a-table :columns="columns"
             :rowKey="record => record.id"
             :dataSource="data"
             :loading="loading">
        <template slot="ordering" slot-scope="ordering">
            <a-list itemLayout="horizontal" :dataSource="ordering">
                <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta>
                        <h4 slot="title">{{item.product_instance.name}}</h4>
                        <template slot="avatar">
                            <a-carousel style="max-width: 50px;">
                                <div v-for="photo in item.product_instance.photos" :key="photo.id">
                                    <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                                </div>
                            </a-carousel>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </a-list>
        </template>
        <template slot="customer" slot-scope="customer">
            {{customer.fullname}} ({{customer.phone}})
        </template>
        <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <OrderForm :order="record"/>
        </div>
    </a-table>
</template>
<script>
    import OrderForm from '../../components/Order/Form'

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            scopedSlots: {customRender: 'id'},
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            scopedSlots: {customRender: 'note'},
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            scopedSlots: {customRender: 'customer'},
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            scopedSlots: {customRender: 'address'},
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'ordering',
            scopedSlots: {customRender: 'ordering'},
            width: '300px'
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'created',
            scopedSlots: {customRender: 'created'},
        },
        {
            title: 'Cập nhập',
            dataIndex: 'updated',
            scopedSlots: {customRender: 'updated'},
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            scopedSlots: {customRender: 'total'},
        },
        {
            title: 'Phí giao hàng',
            dataIndex: 'delivery_cost',
            scopedSlots: {customRender: 'delivery_cost'},
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        }
    ];

    export default {
        name: 'OrderPage',
        mounted() {
            this.fetch();
        },
        components: {
            OrderForm
        },
        data() {
            return {
                data: [],
                pagination: {},
                loading: false,
                columns,
            }
        },
        methods: {
            fetch() {
                this.loading = true
                this.$axios.$get('/warehouse/orders').then((data) => {
                    this.data = data.results;
                    this.loading = false
                });
            }
        },
    }
</script>

<style>
</style>
