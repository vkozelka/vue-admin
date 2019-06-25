<template>
  <admin-layout>
    <v-toolbar v-if="item">
      <v-btn flat @click="$router.go(-1)">
        <v-icon>keyboard_arrow_left</v-icon>
        {{t('Back')}}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="item.success.is_paid == 0"
             color="green" flat @click="togglePaidItem(item.success.id_user_order)" :loading="save_loader">
        <v-icon>done</v-icon>
        {{t('Paid')}}
      </v-btn>
      <v-btn v-if="item.success.is_paid == 1"
             color="orange" flat @click="togglePaidItem(item.success.id_user_order)" :loading="reset_loader">
        <v-icon>do_not_disturb</v-icon>
        {{t('Unpaid')}}
      </v-btn>

      <v-btn color="red" flat @click="deleteItem(item.success.id_user_order)" :loading="delete_loader">
        <v-icon>delete</v-icon>
        {{t('Delete')}}
      </v-btn>
    </v-toolbar>
    <v-card-title v-if="item.detail" class="title">{{t('User')}}: {{ item.detail.first_name}} {{ item.detail.first_name}}</v-card-title>

    <v-card-title class="title">{{t('Items')}}:</v-card-title>
    <ui-grid v-if="item.success" :component="getComponent()" :columns="Columns"
             :resource_url="'backend/transaction/getitems/' + item.success.id_user_order">
      <template slot="grid-items" slot-scope="props">
        <td class="text-xs-center">{{props.item.id_user_order_item}}</td>
        <td class="text-xs-center">{{props.item.item_type}}</td>
        <td class="text-xs-center">{{props.item.price}}</td>
        <td class="text-xs-center">{{props.item.created_at}}</td>
      </template>
    </ui-grid>
  </admin-layout>
</template>

<script>
  export default {
    name: 'TransactionEdit',
    mounted () {
      this.loadItem()
    },
    methods: {
      getComponent () {
        return this
      },
      loadItem () {
        this.apiGet('backend/transaction/edit/' + this.$route.params.id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body
            this.reset_loader = false
          }
        })
      },
      deleteItem (id) {
        this.apiGet('backend/transaction/delete/' + id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.$router.go(-1)
            this.$root.$emit('show-alert', {
              type: 'success',
              message: response.body.success
            })
          }
        })
      },
      togglePaidItem (id) {
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
            this.reset_loader = true
            this.loadItem()
          }
        })
      }
    },
    data () {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: false,
        Columns: [
          {text: 'Id item', align: 'center', sortable: false, index: 'is_user_order'},
          {text: 'Type', align: 'center', sortable: true, index: 'item_type'},
          {text: 'Price', align: 'center', sortable: true, index: 'price'},
          {text: 'Created_at', align: 'center', sortable: true, index: 'created_at'}
        ]
      }
    }
  }
</script>

<style scoped>

</style>