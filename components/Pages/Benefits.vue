<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Benefits')}}</span>

    <ui-grid ref="benefitGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/benefit/index">
      <template slot="grid-items" slot-scope="props">
          <td>{{props.item.name}}</td>
          <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="addBenefit()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Benefits',
      mounted () {
        this.$on('action-clicked', (action) => {
          switch (action.type) {
            case 'edit':
              this.$router.push({name: 'benefits-edit', params: {id: action.item.id_benefit}})
              break
            case 'delete':
              this.delete(action.item.id_benefit)
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
      addBenefit () {
        this.$router.push('/benefits/new')
      },
      delete(id){
        var data = {'id':id}
        this.apiPost('backend/benefit/delete', data).then(r => {
          console.log(r)
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Benefit deleted'
            })
            this.$refs.benefitGrid.$emit('reload')
          }
        })
      }
    },
    data () {
      return {
        columns: [
          { text: 'Name', align: 'left', sortable: true, index: 'name' },
          { text: 'Actions', align: 'center', sortable: false, index: null }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
