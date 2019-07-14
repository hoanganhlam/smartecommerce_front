<template>
    <a-row :gutter="32">
        <a-col :md="12">
            <h4>Thông tin khách hàng</h4>
            <a-row :gutter="16">
                <a-col :md="12">
                    <a-form-item>
                        <GenericBrowser
                            size="large"
                            placeholder="Số điện thoại"
                            name-space="warehouse"
                            mode="default"
                            model="customer"
                            @typed="item => customer.phone = item"
                            @out-object="cbPhone"/>
                    </a-form-item>
                    <a-form-item>
                        <a-input v-model="customer.fullname" size="large" placeholder="Tên Khách"/>
                    </a-form-item>
                    <a-form-item>
                        <a-input v-model="customer.social_profiles.facebook" size="large" placeholder="Facebook"/>
                    </a-form-item>
                </a-col>
                <a-col :md="12">
                    <a-form-item>
                        <a-input v-model="form.address" size="large" placeholder="Địa chỉ"/>
                    </a-form-item>
                    <a-form-item>
                        <GenericBrowser
                            size="large"
                            placeholder="Chọn địa danh"
                            name-space="geography"
                            mode="default"
                            model="destination"
                            @input="item => form.destination = item"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :md="12">
                    <a-form-item label="Ghi chú">
                        <a-input v-model="form.note" size="large" type="textarea" placeholder="Ghi chú" rows="4"/>
                    </a-form-item>
                </a-col>
                <a-col :md="12">
                    <a-form-item label="Ghi chú nhãn vận đơn">
                        <a-input v-model="form.note_delivery" size="large" type="textarea" placeholder="Nhãn vận đơn"
                                 rows="4"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <h4>Thanh toán</h4>
            <a-row :gutter="16">
                <a-col :md="12">
                    <a-form-item>
                        <a-input
                            v-model="form.delivery_cost" size="large"
                            addonBefore="phí vận chuyển"
                            addonAfter="đ"/>
                    </a-form-item>
                </a-col>
                <a-col :md="12">
                    <a-form-item>
                        <a-checkbox
                            :checked="form.pay_for_delivery"
                            @change="form.pay_for_delivery = $event.target.checked"
                            size="large">Shop trả phí vận chuyển
                        </a-checkbox>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :md="12">
                    <a-form-item>
                        <a-input
                            v-model="form.discount" size="large" addonBefore="Đã giảm giá"
                            addonAfter="đ"/>
                    </a-form-item>
                </a-col>
                <a-col :md="12">
                    <a-form-item>
                        <a-checkbox
                            :checked="form.urban_delivery"
                            @change="form.urban_delivery = $event.target.checked"
                            size="large">Gửi hàng nội thành
                        </a-checkbox>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :md="12">
                    <a-form-item>
                        <a-input v-model="form.prepaid" size="large" addonBefore="Đã trả trước" addonAfter="đ"/>
                    </a-form-item>
                </a-col>
                <a-col :md="12">
                    <div>Tổng số tiền: <b>{{total.toLocaleString()}} đ</b></div>
                    <div>Còn thiếu <b>{{(total - this.form.prepaid).toLocaleString()}} đ</b></div>
                </a-col>
            </a-row>
            <a-button type="primary" size="large" @click="onSave()">Lưu</a-button>
        </a-col>
        <a-col :md="12">
            <a-row :gutter="16">
                <a-col :md="12">
                    <h4>Sản phẩm</h4>
                </a-col>
                <a-col :md="12">
                    <a-form-item>
                        <GenericBrowser
                            size="large"
                            placeholder="Chọn kho"
                            name-space="warehouse"
                            mode="default"
                            model="warehouse"
                            @input="item => warehouse = item"/>
                    </a-form-item>
                </a-col>
                <a-col :md="24">
                    <a-form-item>
                        <GenericBrowser
                            size="large"
                            out="object"
                            placeholder="Chọn sản phẩm"
                            name-space="warehouse"
                            model="product-instance"
                            @out-object="item => products = item"/>
                    </a-form-item>
                    <a-table style="margin-bottom: 16px" :columns="columns"
                             :rowKey="record => record.id"
                             :dataSource="products" bordered>
                        <template slot="photos" slot-scope="text, record">
                            <a-carousel style="max-width: 50px;">
                                <div v-for="photo in record.photos" :key="photo.id">
                                    <img style="width: 100%" :src="api_domain + photo.thumbnails.thumb_150_150" alt="">
                                </div>
                            </a-carousel>
                        </template>
                        <template slot="code" slot-scope="text, record">
                            {{record.code}}
                        </template>
                        <template slot="price_out" slot-scope="text, record">
                            {{text.toLocaleString()}} đ
                        </template>
                        <template slot="amount" slot-scope="text, record">
                            <a-input-number v-model="record.amount_out"></a-input-number>
                        </template>
                        <template slot="total" slot-scope="text, record">
                            {{(record.amount_out * record.price_out).toLocaleString()}} đ
                        </template>
                        <template slot="opr" slot-scope="text, record">
                            <a-icon type="delete"></a-icon>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
    import GenericBrowser from '../Generic/Browser'

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
            title: 'Giá bán',
            dataIndex: 'price_out',
            scopedSlots: {customRender: 'price_out'},
        }, {
            title: 'Số lượng',
            dataIndex: 'amount',
            width: '80px',
            scopedSlots: {customRender: 'amount'},
        }, {
            title: 'Thành tiền',
            dataIndex: 'total',
            scopedSlots: {customRender: 'total'},
        }, {
            title: '',
            scopedSlots: {customRender: 'opr'},
        }
    ];
    export default {
        name: "OrderForm",
        props: ['order'],
        components: {
            GenericBrowser,
        },
        data() {
            return {
                products: [],
                warehouse: null,
                form: {
                    customer: null,
                    note: null,
                    note_delivery: null,
                    destination: null,
                    address: null,
                    discount: 0,
                    prepaid: 0,
                    delivery_cost: 0,
                    pay_for_delivery: false,
                    urban_delivery: false
                },
                ordering: [],
                customer: {
                    id: null,
                    phone: null,
                    fullname: null,
                    social_profiles: {
                        facebook: null
                    }
                },
                columns
            }
        },
        methods: {
            async onSave() {
                if (this.order) {

                } else {
                    if (this.customer.id === null) {
                        let data = this.customer
                        delete data.id
                        this.customer = await this.$axios.$post('/warehouse/customers/', data)
                        if (this.customer.social_profiles === null) {
                            this.customer.social_profiles = {facebook: null}
                        }
                    }
                    this.form.customer = this.customer.id
                    let order = await this.$axios.$post('/warehouse/orders/', this.form)
                    for (let i = 0; i < this.products.length; i++) {
                        let data = {
                            order: order.id,
                            product_instance: this.products[i].id,
                            amount: this.products[i].amount_out
                        }
                        await this.$axios.$post('/warehouse/ordering/', data)
                    }
                }
            },
            cbPhone(c) {
                if (c.length) {
                    let customer = c[c.length - 1]
                    this.customer.id = customer.id
                    this.customer.phone = customer.phone
                    this.customer.fullname = customer.fullname
                    this.customer.social_profiles = customer.social_profiles ? customer.social_profiles : {facebook: null}
                } else {
                    this.customer = {
                        id: null,
                        phone: null,
                        fullname: null,
                        social_profiles: {
                            facebook: null
                        }
                    }
                }
            }
        },
        computed: {
            total() {
                let total = 0
                this.products.forEach(product => {
                    total = total + product.amount_out * product.price_out
                })
                return total + this.form.delivery_cost - this.form.discount
            }
        },
        created() {
            if (this.order) {
                for (let field in this.order) {
                    if (field === 'customer') {
                        this.customer = this.order[field]
                        if (this.customer.social_profiles === null) {
                            this.customer.social_profiles = {
                                facebook: null
                            }
                        }
                        this.form[field] = this.order[field].id
                    } else if (field === 'destination') {
                        this.form[field] = this.order[field].id
                    } else if (field === 'ordering') {
                        this.products = this.order[field].map(ordering => {
                            this.$set(ordering.product_instance, 'amount_out', ordering.amount)
                            return ordering.product_instance
                        })
                    } else {
                        this.form[field] = this.order[field]
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
