<template>
    <a-form>
        <a-form-item label="Sản phẩm gốc">
            <GenericBrowser
                mode="default"
                model="product"
                :value="product"
                @input="p => form.product = p"/>
        </a-form-item>
        <a-row :gutter="16">
            <a-col :md="12">
                <a-form-item label="Giá nhập">
                    <a-input-number
                        class="fullwidth"
                        v-model="form.price_in"
                        :defaultValue="1000"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="12">
                <a-form-item label="Giá bán">
                    <a-input-number
                        class="fullwidth"
                        v-model="form.price_out"
                        :defaultValue="1000"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item label="Thẻ">
            <GenericBrowser
                model="taxonomy"
                @input="l => form.taxonomies = l"/>
        </a-form-item>
        <a-form-item label="Hình ảnh">
            <MediaBrowser @select="l => form.photos = l.map(x => x.id)"/>
        </a-form-item>
        <div>
            <a-button type="primary" @click="doSave">Lưu</a-button>
        </div>
    </a-form>
</template>

<script>
    import GenericBrowser from '../Generic/Browser'
    import MediaBrowser from '../Media/Browser'

    export default {
        name: "ProductForm",
        components: {
            GenericBrowser,
            MediaBrowser
        },
        props: {
            product: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: {
                    product: this.product.id,
                    photos: [],
                    price_in: 0,
                    price_out: 0,
                    taxonomies: [],
                    data: null
                }
            }
        },
        methods: {
            async doSave() {
                let res = await this.$axios.$post(`/warehouse/product-instances/`, this.form)
                this.$emit('done', res)
            },
        }
    }
</script>

<style scoped>
    .fullwidth {
        width: 100%;
    }
</style>
