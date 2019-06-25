<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Images')}}</span>

    <ui-grid ref="imageGrid" :component="getComponent()" :columns="columns" :pager="true" :limiter="true" :search="true" :checkbox="true" id-field="id_image" resource_url="backend/image/index">
      <template slot="grid-items" slot-scope="props">
          <td class="text-xs-center"><ui-image :lightbox="false" :image_id="props.item.id_image" resource_url="backend/image/show" :mode="'resize'" :width="100" :height="100"></ui-image></td>
          <td>{{props.item.filename}}<br /><small>{{api_endpoint + "upload" + props.item.path + "/" + props.item.filename }}</small><br /><small>{{props.item.width}} x {{props.item.height}}, {{props.item.filesize|readableSize }}</small></td>
          <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
          <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, t('Never'))}}</td>
          <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <ui-dropzone ref="imageDropzone" target_path="images" resource_url="backend/image/upload"></ui-dropzone>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Images',
    mounted () {
      this.$refs.imageDropzone.$on('upload-complete', () => {
        this.$refs.imageGrid.$emit('reload')
      })
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'images-edit', params: {id: action.item.id_image}})
            break
          case 'delete':
            if (confirm('Really delete image ' + action.item.filename + ' and all thumbnails?')) {
              this.apiPost('backend/image/delete', {
                id_image: action.item.id_image
              }).then((s) => {
                /* this.$root.$emit('show-alert', {
                  type: 'success',
                  message: 'Image deleted'
                }) */
                this.$refs.imageGrid.$emit('reload')
              }).catch((e) => {
                this.$refs.imageGrid.$emit('reload')
              })
            }
            break
          default:
            this.$root.$emit('show-alert', {
              type: 'error',
              message: 'Unknown action: ' + action.title
            })
            break
        }
      })
      this.$on('bulk-action-clicked', (action) => {
        switch (action.type) {
          case 'delete':
            if (confirm('Really delete selected items and all thumbnails?')) {
              this.apiPost('backend/image/deleteselected', {
                images: this.$refs.imageGrid.selected
              }).then((s) => {
                this.$refs.imageGrid.selected = []
                /* this.$root.$emit('show-alert', {
                  type: 'success',
                  message: 'Image deleted'
                }) */
                this.$refs.imageGrid.$emit('reload')
              }).catch((e) => {
                this.$refs.imageGrid.$emit('reload')
              })
            }
            break
          default:
            this.$root.$emit('show-alert', {
              type: 'error',
              message: 'Unknown action: ' + action.title
            })
            break
        }
      })
    },
    methods: {
      getComponent () {
        return this
      },
      getSize (item) {
        return this.humanReadableSize(item.silesize, false)
      },
      getActions (item) {
        return [{
          type: 'edit',
          title: 'Edit',
          icon: 'mode_edit',
          item: item
        }, {
          type: 'delete',
          title: 'Delete',
          icon: 'delete',
          item: item
        }]
      },
      getBulkActions () {
        return [{
          type: 'delete',
          title: 'Delete',
          icon: 'delete'
        }]
      }
    },
    data () {
      return {
        seleted: [],
        columns: [
          { text: 'Preview', align: 'center', sortable: false, index: null },
          { text: 'Filename', align: 'left', sortable: true, index: 'filename' },
          { text: 'Created', align: 'center', sortable: true, index: 'created_at' },
          { text: 'Last Update', align: 'center', sortable: true, index: 'updated_at' },
          { text: 'Actions', align: 'center', sortable: false, index: null }
        ]
      }
    }
  }
</script>
