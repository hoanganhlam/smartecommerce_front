<template>
    <a-form>
        <a-row :gutter="16">
            <a-col :md="12">
                <a-form-item
                    label="Tên">
                    <a-input v-model="form.name" placeholder="Tên Kho"/>
                </a-form-item>
            </a-col>
            <a-col :md="12">
                <a-form-item
                    label="Địa chính">
                    <GenericBrowser
                        name-space="geography"
                        mode="default"
                        model="destination"
                        @input="item => form.destination = item"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item label="Địa chỉ">
            <a-input v-model="form.address" placeholder="Số 1, Hàm nghi..."/>
        </a-form-item>
        <a-form-item label="Số điện thoại">
            <a-input v-model="form.phone" placeholder="088888888"/>
        </a-form-item>
        <a-form-item
            label="Mô tả">
            <a-input v-model="form.description" placeholder="Mô tả" type="textarea"/>
        </a-form-item>
        <div>
            <a-button @click="doSave" type="primary">Lưu</a-button>
        </div>
    </a-form>
</template>

<script>
    import GenericBrowser from '../Generic/Browser'

    export default {
        name: "ProductForm",
        components: {
            GenericBrowser,
        },
        props: {
            isCategory: {
                default: true,
                type: Boolean
            }
        },
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    phone: null,
                    destination: null,
                    address: null
                }
            }
        },
        methods: {
            async doSave() {
                let res = await this.$axios.$post(`/warehouse/warehouses/`, this.form)
                this.$emit('done', res)
            }
        }
    }
</script>

<style scoped>

</style>
