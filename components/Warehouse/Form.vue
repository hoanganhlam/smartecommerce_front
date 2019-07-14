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
                    <a-input v-model="form.label" placeholder="Nhãn"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item
            v-if="isCategory"
            label="Danh mục cha">
            <GenericBrowser
                :mode="mode"
                model="category"
                @input="category => form.parent = category"/>
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
                mode: this.isCategory ? 'default' : 'multiple',
                form: {
                    name: null,
                    description: null,
                    label: null,
                    parent: null
                }
            }
        },
        methods: {
            async doSave() {
                let model = this.isCategory ? 'categories' : 'taxonomies'
                let res = await this.$axios.$post(`/warehouse/${model}/`, this.form)
                this.$emit('done', res)
            }
        }
    }
</script>

<style scoped>

</style>
