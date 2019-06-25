<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Job languages')}}</span>

    <ui-grid ref="joblanguagesGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/joblanguage/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>
    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="add()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: 'JobLanguages',
    mounted(){
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'job-language-edit', params: {id: action.item.id_job_language}})
            break
          case 'delete':
            this.delete(action.item.id_job_language)
            break
          default:
            this.$root.$emit('show-alert', {
              type: 'error',
              message: this.t('Unknown action:') + action.title
            })
            break
        }
      })
    },
    methods:{
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
      delete(id){
        if (confirm(this.t('Are you sure'))) {

          var data = {'id': id}
          this.apiPost('backend/joblanguage/delete', data).then(r => {
            if (r.body.error) {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: r.body.error
              })
            } else {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: this.t('Deleted')
              })
              this.$refs.joblanguagesGrid.$emit('reload')
            }
          })
        }
      },
      add () {
        this.$router.push({name:'job-language-add'})
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