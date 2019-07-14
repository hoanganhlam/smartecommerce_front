<template>
    <a-select
        showSearch
        :size="size"
        :mode="mode"
        v-model="selected"
        :placeholder="placeholder"
        style="width: 100%"
        :filterOption="false"
        @search="fetch"
        @change="handleChange"
        @deselect="handleDeselect"
        :notFoundContent="fetching ? undefined : null">
        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
        <a-select-option v-for="c in categories" :key="c.id" @click.native="handleClick(c)">
            {{c.name || c.phone || c.product.name}}
        </a-select-option>
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
            },
            model: {
                default: 'category',
                type: String
            },
            nameSpace: {
                default: 'warehouse',
                type: String
            },
            value: [Object, Array],
            placeholder: {
                default: 'Chọn',
                type: String
            },
            size: {
                default: 'default',
                type: String
            },
            out: {
                default: 'id',
                type: String
            }
        },
        data() {
            this.fetch = debounce(this.fetch, 500);
            let modelApi = null
            switch (this.model) {
                case 'category':
                    modelApi = 'categories'
                    break
                case 'taxonomy':
                    modelApi = 'taxonomies'
                    break
                default:
                    modelApi = this.model + 's'
            }
            return {
                categories: this.value ? [this.value] : [],
                selected: this.value ? this.value.name : undefined,
                fetching: false,
                modelApi,
                selectObjects: []
            }
        },
        methods: {
            async fetch(value) {
                this.fetching = true
                this.categories = []
                let res = await this.$axios.$get(`/${this.nameSpace}/${this.modelApi}/?search=` + value)
                this.categories = res.results
                this.fetching = false
                this.$emit('typed', value)
                this.selected = value
            },
            handleChange(selected) {
                this.$emit('input', selected)
                let filtered = null
                if (typeof selected === 'number') {
                    this.categories.forEach(item => {
                        if (selected === item.id) {
                            filtered = item
                        }
                    })
                } else {

                }
                this.$emit('inputs', filtered)
            },
            handleClick(c) {
                let check = this.selectObjects.map(x => x.id).indexOf(c.id)
                if (check === -1) {
                    this.selectObjects.push(c)
                } else {
                    this.selectObjects.splice(check, 1)
                }
                this.$emit('out-object', this.selectObjects)
            },
            handleDeselect(key) {
                let check = this.selectObjects.map(x => x.id).indexOf(key)
                if (check !== -1) {
                    this.selectObjects.splice(check, 1)
                }
                this.$emit('out-object', this.selectObjects)
            }
        }
    }
</script>
