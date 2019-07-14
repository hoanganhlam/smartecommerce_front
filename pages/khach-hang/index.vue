<template>
    <a-table :columns="columns"
             :rowKey="record => record.id"
             :dataSource="data"
             :loading="loading">
        <template slot="fullname" slot-scope="fullname">
            {{fullname}}
        </template>
        <template slot="social_profiles" slot-scope="social_profiles">
            {{social_profiles ? social_profiles.facebook : ''}}
        </template>
    </a-table>
</template>
<script>
    const columns = [
        {
            title: 'Tên đầy đủ',
            dataIndex: 'fullname',
            sorter: true,
            width: '20%',
            scopedSlots: {customRender: 'fullname'},
        }, {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: '20%',
        }, {
            title: 'Facebook',
            dataIndex: 'social_profiles',
            scopedSlots: {customRender: 'social_profiles'},
        }
    ];


    export default {
        name: 'Customer',
        mounted() {
            this.fetch();
        },
        data() {
            return {
                data: [],
                pagination: {},
                loading: false,
                columns,
            }
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            fetch() {
                this.loading = true
                this.$axios.$get('/warehouse/customers/').then((data) => {
                    this.loading = false;
                    this.data = data.results;
                });
            }
        },
    }
</script>

<style>
</style>
