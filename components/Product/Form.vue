<template>
    <a-form>
        <a-row :gutter="16">
            <a-col :md="12">
                <a-form-item label="Tên">
                    <a-input v-model="form.name" placeholder="Tên sản phẩm"/>
                </a-form-item>
            </a-col>
            <a-col :md="12">
                <a-form-item label="Danh mục">
                    <GenericBrowser
                        mode="default"
                        model="category"
                        @input="category => form.category = category"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item label="Mô tả">
            <a-input v-model="form.description" placeholder="Mô tả sản phẩm" type="textarea"/>
        </a-form-item>
        <div>
            <a-button type="primary" @click="doSave">Lưu</a-button>
        </div>
    </a-form>
</template>

<script>
    import GenericBrowser from '../Generic/Browser'

    export default {
        name: "ProductForm",
        components: {
            GenericBrowser
        },
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    category: null
                }
            }
        },
        methods: {
            async doSave() {
                let res = await this.$axios.$post(`/warehouse/products/`, this.form)
                this.$emit('done', res)
            }
        }
    }
</script>

<style scoped>

</style>
