<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Sharing Images')}}</span>

    <ui-grid ref="imageGrid" :component="getComponent()" :columns="columns" :pager="true" :limiter="true" :search="true" :checkbox="true" id-field="id_image" resource_url="backend/shareimage/index">
      <template slot="grid-items" slot-scope="props" :class="{'active':props.item.is_main == '1'}">
          <td class="text-xs-center"><ui-image :lightbox="false" :image_id="props.item.i.id_image" resource_url="backend/image/show" :mode="'resize'" :width="100" :height="100"></ui-image></td>
          <td id="active" v-if="props.item.is_main == '1'"><strong>{{props.item.i.filename}}</strong><br /><small>{{api_endpoint + "upload" + props.item.i.path + "/" + props.item.i.filename }}</small><br /><small>{{props.item.i.width}} x {{props.item.i.height}}, {{props.item.i.filesize|readableSize }}</small></td>
          <td v-else>{{props.item.i.filename}}<br /><small>{{api_endpoint + "upload" + props.item.i.path + "/" + props.item.i.filename }}</small><br /><small>{{props.item.i.width}} x {{props.item.i.height}}, {{props.item.i.filesize|readableSize }}</small></td>
          <td class="text-xs-center">{{datetimeFormat(props.item.i.created_at)}}</td>
          <td class="text-xs-center">{{datetimeFormat(props.item.i.updated_at, t('Never'))}}</td>
          <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <ui-dropzone ref="imageDropzone" target_path="images/share_images" resource_url="backend/shareimage/upload"></ui-dropzone>
  </admin-layout>
</template>

<script>
  export default {
    name: 'ShareImages',
    mounted () {
      this.$refs.imageDropzone.$on('upload-complete', () => {
        this.$refs.imageGrid.$emit('reload')
      })
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'images-edit', params: {id: action.item.i.id_image}})
            break
          case 'main':
            this.apiPost('backend/shareimage/main/' + action.item.i.id_image, {}).then((s) => {
              this.$refs.imageGrid.$emit('reload')
            }).catch((e) => {
              this.$refs.imageGrid.$emit('reload')
            })
            break
          case 'delete':
            if (confirm('Really delete image ' + action.item.i.filename + ' and all thumbnails?')) {
              this.apiPost('backend/shareimage/delete', {
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
              this.apiPost('backend/shareimage/deleteselected', {
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
          type: 'main',
          title: 'Set As Main',
          icon: 'star',
          item: item
        }, {
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