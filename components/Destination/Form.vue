<template>
    <a-form>
        <a-row :gutter="16">
            <a-col :md="12">
                <a-form-item
                    label="Tên">
                    <a-input v-model="form.name" placeholder="Tên danh mục"/>
                </a-form-item>
            </a-col>
            <a-col :md="12">
                <a-form-item
                    label="Nhãn">
                    <GenericBrowser
                        mode="default"
                        name-space="geography"
                        model="taxonomy"
                        @input="item => form.taxonomy = item"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item label="Địa danh cha">
            <GenericBrowser
                mode="default"
                name-space="geography"
                model="destination"
                @input="item => form.parent = item"/>
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
        name: "DestinationForm",
        components: {
            GenericBrowser,
        },
        props: {},
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    taxonomy: null,
                    parent: null
                }
            }
        },
        methods: {
            async doSave() {
                this.form.address = this.form.name
                let res = await this.$axios.$post(`/geography/destinations/`, this.form)
                this.$emit('done', res)
            }
        }
    }
</script>

<style scoped>

</style>
