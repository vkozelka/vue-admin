<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Transaction')}}</span>

    <ui-grid ref="transactionGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true"
             resource_url="backend/transaction/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.t.id_user_order}}</td>
        <td>{{props.item.ud.first_name}} {{props.item.ud.last_name}}</td>
        <td>{{props.item.t.price}}</td>
        <td class="text-xs-center">
          <v-icon color="green" v-if="props.item.t.is_paid == 1">done</v-icon>
          <v-icon color="red" v-else>do_not_disturb</v-icon>
        </td>
        <td class="text-xs-center">{{datetimeFormat(props.item.t.created_at)}}</td>

        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item,props.item.t.is_paid)"></ui-grid-actions>
      </template>
    </ui-grid>
  </admin-layout>

</template>

<script>
  export default {
    name: 'Transactions',
    mounted () {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'transaction-edit', params: {id: action.item.id_user_order}})
            break
          case 'toggle_paid':
            this.toggle_paid(action.item.id_user_order)
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
      getActions (item, paid) {
        return [{
          type: 'toggle_paid',
          title: paid === 1 ? 'Set as unpaid' : 'Set as paid',
          icon: paid === 1 ? 'do_not_disturb' : 'done',
          item: item.t
        }, {
          type: 'edit',
          title: 'Edit',
          icon: 'edit',
          item: item.t
        }]
      },
      toggle_paid (id) {
        this.apiPost('backend/transaction/togglepaid/', {'id': id}).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: response.body.success
            })
            this.$refs.transactionGrid.$emit('reload')
          }
        })
      }
    },
    data () {
      return {
        columns: [
          {text: 'ID', align: 'left', sortable: true, index: 'id_user_order'},
          {text: 'User', align: 'left', sortable: false, index: null},
          {text: 'Price', align: 'left', sortable: false, index: 'price'},
          {text: 'Is paid ?', align: 'center', sortable: true, index: 'is_paid'},
          {text: 'Created at', align: 'center', sortable: true, index: 'created_at'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ]
      }
    }
  }
</script>
<style scoped>

</style>