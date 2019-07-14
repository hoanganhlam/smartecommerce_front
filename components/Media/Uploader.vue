<template>
    <div>
        <a-upload-dragger
            :multiple="false"
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload">
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
        </a-upload-dragger>
    </div>
</template>
<script>
    export default {
        name: 'Uploader',
        props: {
            isSingle: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                fileList: [],
                singleFile: null,
                photo: this.selected
            }
        },
        methods: {
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList
            },
            async beforeUpload(file) {
                let formData = new FormData()
                formData.append('title', file.name)
                formData.append('file', file)
                let res = await this.$axios.$post('/media/medias/', formData)
                this.photo = res
                this.$emit('uploaded', res)
                return false;
            },
        },
        watch: {
            selected() {
                this.photo = this.selected
            }
        }
    }
</script>
