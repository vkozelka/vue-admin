<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Admin users')}}</span>

    <ui-grid ref="adminUserGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/adminuser/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.id_admin_user}}</td>
        <td>{{props.item.email}}</td>
        <td>{{props.item.id_admin_user_role==1?t('Admin'):t('Team')}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="addUser()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: "AdminUser",
    mounted() {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'admin-user-edit', params: {id: action.item.id_admin_user}})
            break
          case 'delete':
            this.delete(action.item.id_admin_user)
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
      getComponent() {
        return this
      },
      getActions(item) {
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
      addUser() {
        this.$router.push({name: 'admin-user-add'})
      },
      delete(id) {
        if (confirm(this.t('Are you sure to delete admin user ?'))) {
          var data = {'id': id}
          this.apiPost('backend/adminuser/delete', data).then(r => {
            if (r.body.error) {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: r.body.error
              })
            } else {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Admin user deleted'
              })
              this.$refs.adminUserGrid.$emit('reload')
            }
          })
        }
      }
    },
    data() {
      return {
        columns: [
          {text: 'Id', align: 'left', sortable: true, index: 'id_admin_user'},
          {text: 'Email', align: 'left', sortable: true, index: 'email'},
          {text: 'Role', align: 'left', sortable: true, index: 'id_admin_user_role'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ]
      }
    }
  }
</script>

<style scoped>

</style>