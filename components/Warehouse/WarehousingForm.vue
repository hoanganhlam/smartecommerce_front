<template>
    <a-form>
        <a-form-item label="Kho">
            <GenericBrowser
                mode="default"
                model="warehouse"
                @input="item => form.warehouse = item"/>
        </a-form-item>
        <a-form-item label="Ghi chú">
            <a-input v-model="form.note" placeholder="Ghi chú" type="textarea"/>
        </a-form-item>
        <a-table style="margin-bottom: 16px" :columns="columns" :dataSource="data" bordered>
            <template slot="photos" slot-scope="text, record">
                <a-carousel style="max-width: 100px;">
                    <div v-for="photo in record.product_instance.photos" :key="photo.id">
                        <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                    </div>
                </a-carousel>
            </template>
            <template slot="code" slot-scope="text, record">
                {{record.product_instance.code}}
            </template>
            <template slot="price_in" slot-scope="text, record">
                <editable-cell :text="text" @change="record.price_in = $event"/>
            </template>
            <template slot="amount" slot-scope="text, record">
                <editable-cell :text="text" @change="record.amount = $event"/>
            </template>
            <template slot="total" slot-scope="text, record">
                {{record.amount * record.price_in}}
            </template>
        </a-table>
        <a-row style="margin-bottom: 32px" :gutter="16">
            <a-col :md="20">
                <GenericBrowser
                    mode="default"
                    model="product-instance"
                    @inputs="item => newTransaction.product_instance = item"/>
            </a-col>
            <a-col :md="4">
                <div>
                    <a-button @click="handleAdd">Thêm</a-button>
                </div>
            </a-col>
        </a-row>
        <a-button @click="doSave" type="primary">Lưu</a-button>
    </a-form>
</template>

<script>
    import GenericBrowser from '../Generic/Browser'
    import EditableCell from '../../components/Generic/CellEditable'

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'photos',
            scopedSlots: {customRender: 'photos'},
        }, {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            scopedSlots: {customRender: 'code'},
        }, {
            title: 'Giá nhập',
            dataIndex: 'price_in',
            scopedSlots: {customRender: 'price_in'},
        }, {
            title: 'Số lượng',
            dataIndex: 'amount',
            scopedSlots: {customRender: 'amount'},
        }, {
            title: 'Tổng tiền',
            dataIndex: 'total',
            scopedSlots: {customRender: 'total'},
        }
    ];
    export default {
        name: "WarehousingForm",
        components: {
            GenericBrowser,
            EditableCell
        },
        props: {
            isCategory: {
                default: true,
                type: Boolean
            }
        },
        data() {
            return {
                newTransaction: {
                    product_instance: null,
                    price_in: 1000,
                    amount: 1
                },
                form: {
                    warehouse: null,
                    note: null
                },
                columns,
                data: []
            }
        },
        methods: {
            handleAdd() {
                this.data.push(this.newTransaction)
                this.product_instance = {
                    product_instance: null,
                    price_in: 0,
                    amount: 1
                }
            },
            async doSave() {
                let transactions = []
                for (let i = 0; i < this.data.length; i++) {
                    let form = {
                        product_instance: this.data[i].product_instance.id,
                        price_in: this.data[i].price_in,
                        amount: this.data[i].amount
                    }
                    let res = await this.$axios.$post('/warehouse/transactions/', form)
                    transactions.push(res.id)
                }
                this.form.transactions = transactions
                let res = await this.$axios.$post('/warehouse/warehousing/', this.form)
                this.$emit('done', res)
            }
        }
    }
</script>

<style scoped>

</style>
