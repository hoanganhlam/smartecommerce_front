<template>
    <div>
        <div class="topics" style="margin-bottom: 16px">
            <a-row :gutter="10">
                <a-col
                    style="cursor: pointer" :md="6" v-for="photo in body.results"
                    :key="photo.id"
                    @click="handleSelect(photo)">
                    <div class="image" v-bind:class="{'selected' : isSelected(photo) !== -1}">
                        <img style="width: 100%" :alt="photo.title"
                             :src="api_domain + photo.thumbnails.thumb_200_250">
                        <a-icon v-if="isSelected(photo) !== -1" class="checked" type="check"/>
                    </div>
                </a-col>
            </a-row>
            <div v-if="lastPage" class="previous" @click="previous()">
                <a-icon type="double-left"/>
            </div>
            <div v-if="lastPage" class="next" @click="next()">
                <a-icon type="double-right"/>
            </div>
        </div>
        <Uploader @uploaded="fetch()"/>
    </div>
</template>

<script>
    import Uploader from './Uploader'

    export default {
        name: "MediaBrowser",
        components: {
            Uploader,
        },
        props: {
            multipleSelect: {
                type: Boolean,
                default: true
            },
            importedPhotos: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                page: 1,
                body: {
                    results: [],
                    count: 0
                },
                selected: []
            }
        },
        methods: {
            async next() {
                if (this.page === this.lastPage) {
                    this.page = 1
                } else {
                    this.page = this.page + 1
                }
                await this.fetch()
            },
            async previous() {
                if (this.page === 1) {
                    this.page = this.lastPage
                } else {
                    this.page = this.page - 1
                }
                await this.fetch()
            },
            async fetch() {
                let params = '?page_size=t4&page=' + this.page
                this.body = await this.$axios.$get(`/media/medias/${params}`)
            },
            isSelected(photo) {
                for (let i = 0; i < this.selected.length; i++) {
                    if (photo.id === this.selected[i].id) {
                        return i
                    }
                }
                return -1
            },
            handleSelect(photo) {
                if (this.isSelected(photo) !== -1) {
                    this.selected.splice(this.isSelected(photo), 1)
                } else {
                    if (this.multipleSelect) {
                        this.selected.push(photo)
                    } else {
                        this.selected = [photo]
                    }
                }
                this.$emit('select', this.selected)
            }
        }, created() {
            this.fetch()
        },
        computed: {
            lastPage() {
                return Math.floor(this.body.total / 4)
            }
        }
    }
</script>

<style scoped>
    .topics {
        position: relative;
    }

    .topics .next, .topics .previous {
        position: absolute;
        top: calc(50% - 10px);
        cursor: pointer;
    }

    .topics .next {
        right: -30px;
    }

    .topics .previous {
        left: -30px;
    }

    .image {
        position: relative;
        padding: 10px;
    }

    .image.selected:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #356b793b;
        z-index: 1;
    }

    .image .checked {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
</style>
