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
            <template slot="label" slot-scope="text, record">
                <editable-cell :text="text" @change="onCellChange(record.id, 'label', $event)"/>
            </template>
            <template slot="parent" slot-scope="text, record">
                <GenericBrowser
                    mode="default"
                    name-space="geography"
                    model="destination"
                    :value="record.parent ? record.parent : undefined"
                    @input="onCellChange(record.id, 'parent', $event)"/>
            </template>
            <template slot="taxonomy" slot-scope="text, record">
                <GenericBrowser
                    mode="default"
                    name-space="geography"
                    model="taxonomy"
                    :value="record.taxonomy ? record.taxonomy : undefined"
                    @input="onCellChange(record.id, 'taxonomy', $event)"/>
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
        <a-modal title="Thêm địa danh mới" v-model="visible">
            <DestinationForm @done="item => res.results.push(item)"/>
        </a-modal>
    </div>
</template>

<script>
    import DestinationForm from '../../../components/Destination/Form'
    import EditableCell from '../../../components/Generic/CellEditable'
    import GenericBrowser from '../../../components/Generic/Browser'

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '20%',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: 'Nhãn',
            dataIndex: 'label',
            width: '20%',
            scopedSlots: {customRender: 'label'},
        },
        {
            title: 'Kiểu',
            dataIndex: 'taxonomy',
            width: '20%',
            scopedSlots: {customRender: 'taxonomy'},
        },
        {
            title: 'Địa danh cha',
            dataIndex: 'parent',
            width: '20%',
            scopedSlots: {customRender: 'parent'},
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
            width: '20%',
        }
    ];
    export default {
        name: "Destination",
        components: {
            DestinationForm,
            EditableCell,
            GenericBrowser
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
                this.res = await this.$axios.$get(`/geography/destinations/${params}`)
            },
            async onDelete(key) {
                await this.$axios.delete(`/geography/destinations/${key}/`)
                await this.fetch()
            },
            async onCellChange(key, dataIndex, value) {
                let data = {}
                if (typeof value === 'object') {
                    data[dataIndex] = value.key
                } else {
                    data[dataIndex] = value
                }
                await this.$axios.put(`/geography/destinations/${key}/`, data)
            },
        },
        created() {
            this.fetch()
        }
    }
</script>

<style>
</style>
