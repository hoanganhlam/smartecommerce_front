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
            <template slot="photos" slot-scope="text, record">
                <a-carousel style="max-width: 100px;">
                    <div v-for="photo in record.photos" :key="photo.id">
                        <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                    </div>
                </a-carousel>
            </template>
            <template slot="name" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'name', $event)"/>
            </template>
            <template slot="label" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'label', $event)"/>
            </template>
            <template slot="category" slot-scope="text, record">
                <GenericBrowser
                    mode="default"
                    model="category"
                    :value="record.category ? record.category : undefined"
                    @input="onCellChange(record.id, 'category', $event)"/>
            </template>
            <template slot="count" slot-scope="text, record">
                <span>{{record.instances.length}}</span>
            </template>
            <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                    v-if="res.results.length"
                    title="Chắc xóa không?"
                    @confirm="() => onDelete(record.id)">
                    <a class="ant-btn" href="javascript:;">
                        <a-icon type="delete"/>
                    </a>
                </a-popconfirm>
                <a-button @click="handleClick(record)">
                    <a-icon type="plus"/>
                </a-button>
            </template>
            <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <a-table :columns="columnsSub" :dataSource="record.instances" bordered rowKey="id">
                    <template slot="photos" slot-scope="text, record">
                        <a-carousel style="max-width: 100px;">
                            <div v-for="photo in record.photos" :key="photo.id">
                                <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                            </div>
                        </a-carousel>
                    </template>
                </a-table>
            </div>
        </a-table>
        <a-modal title="Thêm sản phẩm mới" v-model="visible">
            <ProductForm @done="item => res.results.push(item)"/>
        </a-modal>
        <a-modal title="Thêm mã mới" v-model="visible2">
            <InstanceForm :product="selectingProduct" @done="item => selectingProduct.instances.push(item)"/>
        </a-modal>
    </div>
</template>

<script>
    import ProductForm from '../../components/Product/Form'
    import InstanceForm from '../../components/Product/InstanceForm'
    import EditableCell from '../../components/Generic/CellEditable'
    import GenericBrowser from '../../components/Generic/Browser'

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            scopedSlots: {customRender: 'code'},
            width: 250
        },
        {
            title: 'Ảnh',
            dataIndex: 'photos',
            scopedSlots: {customRender: 'photos'},
            width: 120
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
            width: 650
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            scopedSlots: {customRender: 'category'},
            width: 250
        },
        {
            title: 'Số mẫu',
            dataIndex: 'count',
            scopedSlots: {customRender: 'count'},
            width: 250
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
            width: 150
        }
    ];
    const columnsSub = [
        {
            title: 'Mã',
            dataIndex: 'code',
            scopedSlots: {customRender: 'code'},
            width: 200
        },
        {
            title: 'Ảnh',
            dataIndex: 'photos',
            scopedSlots: {customRender: 'photos'},
            width: 120
        },
        {
            title: 'Thuộc tính',
            dataIndex: 'data',
            scopedSlots: {customRender: 'data'},
            width: 250
        },
        {
            title: 'Giá nhập',
            dataIndex: 'price_in',
            scopedSlots: {customRender: 'price_in'},
            width: 170
        },
        {
            title: 'Giá bán',
            dataIndex: 'price_out',
            scopedSlots: {customRender: 'price_out'},
            width: 170
        },
        {
            title: 'Số lượng',
            dataIndex: 'total',
            scopedSlots: {customRender: 'total'},
            width: 170
        },
        ,
        {
            title: 'Tồn kho',
            dataIndex: 'inventory',
            scopedSlots: {customRender: 'inventory'},
            width: 170
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
            width: 150
        }
    ];
    export default {
        name: "Product",
        components: {
            ProductForm,
            EditableCell,
            GenericBrowser,
            InstanceForm
        },
        async asyncData({query}) {
            return {
                query
            }
        },
        data() {
            return {
                visible: false,
                visible2: false,
                res: {
                    results: [],
                    count: []
                },
                columns,
                columnsSub,
                selectingProduct: null
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
                this.res = await this.$axios.$get(`/warehouse/products/${params}`)
            },
            async onDelete(key) {
                await this.$axios.delete(`/warehouse/products/${key}/`)
                await this.fetch()
            },
            async onCellChange(key, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                await this.$axios.put(`/warehouse/products/${key}/`, data)
            },
            handleClick(record) {
                this.selectingProduct = record
                this.visible2 = true
            }
        },
        created() {
            this.fetch()
        }
    }
</script>

<style>
</style>
