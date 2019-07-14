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
            <template slot="name" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'name', $event)"/>
            </template>
            <template slot="description" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'description', $event)"/>
            </template>
            <template slot="address" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'address', $event)"/>
            </template>
            <template slot="phone" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'phone', $event)"/>
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
        </a-table>
        <a-modal title="Thêm danh mục mới" v-model="visible">
            <WarehouseForm @done="item => res.results.push(item)"/>
        </a-modal>
    </div>
</template>

<script>
    import WarehouseForm from '../../components/Warehouse/Form'
    import EditableCell from '../../components/Generic/CellEditable'

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '250px',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            scopedSlots: {customRender: 'address'},
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
            width: '80px',
        }
    ];
    export default {
        name: "Warehouses",
        components: {
            WarehouseForm,
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
                columns
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
                this.res = await this.$axios.$get(`/warehouse/warehouses/${params}`)
            },
            async onDelete(key) {
                await this.$axios.delete(`/warehouse/warehouses/${key}/`)
                await this.fetch()
            },
            async onCellChange(key, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                await this.$axios.put(`/warehouse/warehouses/${key}/`, data)
            },
        },
        created() {
            this.fetch()
        }
    }
</script>

<style>
</style>
