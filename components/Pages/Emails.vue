<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('Email templates') }}</span>

    <ui-grid :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/email/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.code}}</td>
        <td>{{props.item.title}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, t('Never'))}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="addEmail()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Emails',
    mounted () {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'emails-edit', params: {id: action.item.id_email}})
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
      addEmail () {
        this.$router.push('/emails/new')
      }
    },
    data () {
      return {
        columns: [
          { text: 'Code', align: 'left', sortable: true, index: 'code' },
          { text: 'Name', align: 'left', sortable: true, index: 'name' },
          { text: 'Created', align: 'center', sortable: true, index: 'created_at' },
          { text: 'Last Update', align: 'center', sortable: true, index: 'updated_at' },
          { text: 'Actions', align: 'center', sortable: false, index: null }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
