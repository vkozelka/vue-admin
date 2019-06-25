<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Article Categories')}}</span>

    <ui-grid :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/article-category/index">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td class="text-xs-center"><v-icon v-if="props.item.is_active">done</v-icon><v-icon v-else>do_not_disturb</v-icon></td>
        <td class="text-xs-center">{{datetimeFormat(props.item.active_from, '-')}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.active_to, '-')}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, t('Never'))}}</td>
      </template>
    </ui-grid>
  </admin-layout>
</template>

<script>
  export default {
    name: 'ArticleCategory',
    mounted () {
    },
    data () {
      return {
        columns: [
          { text: 'Name', align: 'left', sortable: true, index: 'name' },
          { text: 'Active?', align: 'center', sortable: false, index: 'is_active' },
          { text: 'Active From', align: 'center', sortable: true, index: 'active_from' },
          { text: 'Active To', align: 'center', sortable: true, index: 'active_to' },
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
