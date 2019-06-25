<template>
    <admin-layout>
        <span slot="admin-page-title">{{t('Manage Addons')}}</span>

        <ui-grid ref="addonGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/addon/index">
            <template slot="grid-items" slot-scope="props">
                <td>{{props.item.name}}</td>
                <td>{{props.item.price}}</td>
                <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>

            </template>
        </ui-grid>
        <div class="text-xs-right">
            <v-btn fab dark fixed right bottom color="indigo" @click="addAddon()">
                <v-icon dark>add</v-icon>
            </v-btn>
        </div>
    </admin-layout>
</template>

<script>
  export default {
    name: 'addons',
    mounted () {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'addons-edit', params: {id: action.item.id_addon}})
            break
          case 'delete':
              this.deleteAddon(action.item.id_addon)
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
    data () {
      return {
        columns: [
          {text: 'Name', align: 'left', sortable: true, index: 'name'},
          {text: 'Price', align: 'left', sortable: true, index: 'price'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ]
      }
    },
    methods: {
      getComponent () {
        return this
      },
      addAddon () {
        this.$router.push({name: 'addons-add'})
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
      deleteAddon (id) {
        var data = {'id':id}
        this.apiPost('backend/addon/delete', data).then(r => {
          console.log(r);
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Addon deleted'
            })
            this.$refs.addonGrid.$emit('reload')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>