<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Candidates')}}</span>

    <ui-grid ref="userGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/user/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.email}}<span v-if="props.item.deleted_at" style="color: red"> - {{t('Deleted')}}</span></td>
        <td>{{props.item.username}}<span v-if="props.item.display_name"><br/><small>{{t('Display as') + ': ' + props.item.display_name}}</small></span></td>
        <td class="text-xs-center">
          <v-icon color="green" v-if="props.item.is_active == 1">done</v-icon>
          <v-icon color="red" v-else>do_not_disturb</v-icon>
        </td>

        <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, 'Never')}}</td>
        <ui-grid-actions v-if="!props.item.deleted_at" :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Articles',
    mounted() {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'users-edit', params: {id: action.item.id_user}})
            break;
          case 'login':
            window.open(this.api_endpoint + 'user/ajax/loginfrombackend/' + action.item.id_user, '_blank');
            break;
          case 'delete':
            this.deleteUser(action.item.id_user);
            break;
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
          type: 'login',
          title: 'Log in',
          icon: 'lock_open',
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
      addUser() {
        this.$router.push('/users/new')
      },
      deleteUser(id_user) {
        if (confirm(this.t('Are you sure to delete user ?'))) {
          this.apiPost('backend/user/delete', {id_user: id_user})
            .then(r => {
              if (r.body.status === true) {
                this.$root.$emit('show-alert', {
                  type: 'success',
                  message: 'User deleted'
                })
                this.$refs.userGrid.$emit('reload')
              } else {
                this.$root.$emit('show-alert', {
                  type: 'error',
                  message: r.body.error
                })
              }
            })
        }
      }
    },
    data() {
      return {
        columns: [
          {text: 'E-mail', align: 'left', sortable: true, index: 'email'},
          {text: 'Username / Display name', align: 'left', sortable: true, index: 'username'},
          {text: 'Active?', align: 'center', sortable: false, index: 'is_active'},
          {text: 'Created', align: 'center', sortable: true, index: 'created_at'},
          {text: 'Last Update', align: 'center', sortable: true, index: 'updated_at'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
