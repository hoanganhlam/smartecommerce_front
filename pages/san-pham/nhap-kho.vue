<template>
    <div>
        <a-table :columns="columns" :dataSource="res.results" bordered rowKey="id">
            <template slot="title" slot-scope="currentPageData">
                <a-row>
                    <a-col :md="12">
                        <a-button @click="visible = true">Thêm mới</a-button>
                    </a-col>
                    <a-col :md="12"></a-col>
                </a-row>
            </template>
            <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                    v-if="res.results.length"
                    title="Chắc xóa không?"
                    @confirm="() => onDelete(record.id)">
                    <a href="javascript:;">
                        <a-icon type="delete"/>
                    </a>
                </a-popconfirm>
            </template>
            <template slot="user" slot-scope="user, record">
                {{user.username}}
            </template>
            <template slot="warehouse" slot-scope="warehouse, record">
                {{warehouse.name}}
            </template>
            <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <a-table :columns="columnsSub" :dataSource="record.transactions" bordered rowKey="id">
                    <template slot="total" slot-scope="text, record">
                        {{record.amount * record.price_in}}
                    </template>
                    <template slot="product_code" slot-scope="text, record">
                        {{text.name}}
                    </template>
                    <template slot="product_photo" slot-scope="text, record">
                        <a-carousel style="max-width: 100px;">
                            <div v-for="photo in text.photos" :key="photo.id">
                                <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                            </div>
                        </a-carousel>
                    </template>
                </a-table>
            </div>
        </a-table>
        <a-modal width="700px" title="Thêm danh mục mới" v-model="visible">
            <WarehousingForm @done="item => res.results.push(item)"/>
        </a-modal>
    </div>
</template>

<script>
    import WarehousingForm from '../../components/Warehouse/WarehousingForm'
    import EditableCell from '../../components/Generic/CellEditable'

    const columns = [
        {
            title: 'Người tạo',
            dataIndex: 'user',
            scopedSlots: {customRender: 'user'},
        },
        {
            title: 'Kho',
            dataIndex: 'warehouse',
            scopedSlots: {customRender: 'warehouse'},
        },
        {
            title: 'Tổng hàng',
            dataIndex: 'total',
            scopedSlots: {customRender: 'total'},
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'money',
            scopedSlots: {customRender: 'money'},
        },
        {
            title: 'Thời gian',
            dataIndex: 'created',
            scopedSlots: {customRender: 'created'},
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
        }
    ];
    const columnsSub = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'product_instance',
            scopedSlots: {customRender: 'product_code'},
            width: 150
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'product_instance',
            scopedSlots: {customRender: 'product_photo'},
            width: 150
        },
        {
            title: 'Giá',
            dataIndex: 'price_in',
            scopedSlots: {customRender: 'price_in'},
            width: 150
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            scopedSlots: {customRender: 'amount'},
            width: 150
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'amount',
            scopedSlots: {customRender: 'total'},
            width: 150
        }
    ];
    export default {
        name: "Warehousing",
        components: {
            WarehousingForm,
            EditableCell
        },
        async asyncData({query}) {
            return {
                query
            }
        },
        data() {
            return {
                visible: false,
                res: {
                    results: [],
                    count: []
                },
                columns,
                columnsSub
            }
        },
        methods: {
            async fetch() {
                let params = '?start=true'
                if (typeof this.query.page === 'undefined') {
                    this.query.page = 1
                }
                for (let field in this.query) {
                    if (this.query[field]) {
                        params = params + `&${field}=${this.query[field]}`
                    }
                }
                this.res = await this.$axios.$get(`/warehouse/warehousing/${params}`)
            },
            async onDelete(key) {
                await this.$axios.delete(`/warehouse/warehousing/${key}/`)
                await this.fetch()
            },
            async onCellChange(key, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                await this.$axios.put(`/warehouse/warehousing/${key}/`, data)
            },
        },
        created() {
            this.fetch()
        }
    }
</script>

<style>
</style>
