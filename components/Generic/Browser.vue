<template>
    <a-select
        :mode="mode"
        labelInValue
        :value="selected"
        placeholder="Chọn danh mục"
        style="width: 100%"
        :filterOption="false"
        @search="fetch"
        @change="handleChange"
        :notFoundContent="fetching ? undefined : null">
        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
        <a-select-option v-for="c in categories" :key="c.id">{{c.name}}</a-select-option>
    </a-select>
</template>
<script>
    import debounce from 'lodash/debounce';

    export default {
        name: "CategoryBrowser",
        props: {
            mode: {
                default: 'multiple',
                type: String
            }
        },
        data() {
            this.fetch = debounce(this.fetch, 500);
            return {
                categories: [],
                selected: [],
                fetching: false,
            }
        },
        methods: {
            async fetch(value) {
                this.fetching = true
                this.categories = []
                let res = await this.$axios.$get('/warehouse/categories/?search=' + value)
                this.categories = res.results
                this.fetching = false
            },
            handleChange(selected) {
                this.selected = selected
            }
        }
    }
</script>
