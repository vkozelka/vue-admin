<template>
  <div class="dropzone" :class="{'hover':moveOverDropzone === true}" @drop.prevent="drop" @dragover.prevent="moveOverDropzone = true" @dragleave.prevent="moveOverDropzone = false">
    <v-progress-linear v-bind:indeterminate="loading ? true : false"></v-progress-linear>

    {{ t(status) }}
  </div>
</template>

<script>
  export default {
    name: 'Dropzone',
    props: ['target_path', 'resource_url'],
    mounted () {
      this.moveOverDropzone = false
      this.loading = false
      this.status = 'Drop files here to upload'
    },
    methods: {
      drop (event) {
        this.moveOverDropzone = false
        this.loading = true
        this.status = 'Uploading. Please wait...'
        const files = event.dataTransfer.files
        const promises = []

        for (let i = 0; i < files.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            this.apiPost(this.resource_url, {file: files.item(i), target: this.target_path}).then((r) => {
              resolve(r)
            }).catch((e) => {
              reject(e)
            })
          }))
        }

        Promise.all(promises).then((r) => {
          this.moveOverDropzone = false
          this.loading = false
          this.status = 'Drop files here to upload'
          this.$emit('upload-complete')
        }).catch((e) => {
          this.moveOverDropzone = false
          this.loading = false
          this.status = 'Drop files here to upload'
        })
      }
    },
    data () {
      return {
        status: 'Drop files here to upload',
        loading: false,
        moveOverDropzone: false
      }
    }
  }
</script>

<style scoped>
  .dropzone {
    width: 100%;
    min-height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px solid #2196E8;
    border-radius: 4px;
  }
  .dropzone.hover {
    background-color: #2196E8;
    color: #fff;
  }
  .progress-linear {
    margin: 0;
  }
</style>
