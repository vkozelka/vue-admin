<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('Job Access Logs') }}</span>

    <ui-grid ref="blacklistGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/joblog/blacklist">
      <template slot="grid-items" slot-scope="props">
        <td>
          <v-tooltip top>
            <div slot="activator" class="d-inline-block"><v-btn @click="unblacklistIp(props.item.ip)" icon small><v-icon>cancel</v-icon></v-btn></div>
            <span v-text="'Remove IP from Blacklist'"></span>
          </v-tooltip> {{ props.item.ip}}
        </td>
      </template>
    </ui-grid>
  </admin-layout>
</template>

<script>
  export default {
    name: 'JobLogBlacklist',
    mounted () {
      this.columns = [
        { text: 'IP', align: 'left', sortable: false, index: false, filter: 'text', filterColumn: 'jl.ip_source', filterOptions: {} }
      ]
    },
    methods: {
      unblacklistIp (ip) {
        this.apiPost('backend/joblog/unblacklistip', {
          ip: ip
        }).then(r => {
          this.$refs.blacklistGrid.$emit('reload');
        }).catch(e => {
          this.$root.$emit('show-alert',{
            type: 'error',
            title: 'Error',
            message: e
          })
        })
      }
    },
    data () {
      return {
        columns: []
      }
    }
  }
</script>

<style scoped>

</style>
