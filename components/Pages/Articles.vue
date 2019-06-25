<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Articles')}}</span>

    <ui-grid ref="articleGrid" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/article/index">
      <template slot="grid-items" slot-scope="props">
          <td>{{props.item.name}}</td>
          <td class="text-xs-center"><v-icon color="green" v-if="props.item.is_active == 1">done</v-icon><v-icon color="red" v-else>do_not_disturb</v-icon></td>
          <td class="text-xs-center">{{datetimeFormat(props.item.active_from, '-')}}</td>
          <td class="text-xs-center">{{datetimeFormat(props.item.active_to, '-')}}</td>
          <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
          <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, 'Never')}}</td>
          <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="addArticle()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Articles',
    mounted () {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'articles-edit', params: {id: action.item.id_article}})
            break
          case 'delete':
            this.deleteArticle(action.item.id_article)
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
      addArticle () {
        this.$router.push('/articles/new')
      },
      deleteArticle(id_article){
        if (confirm(this.t('Are you sure to delete article ?'))) {
          this.apiPost('backend/article/delete', {id_article: id_article})
            .then(r => {
              if (r.body.status === true) {
                this.$root.$emit('show-alert', {
                  type: 'success',
                  message: this.t('Article deleted')
                })
                this.$refs.articleGrid.$emit('reload')
              } else {
                this.$root.$emit('show-alert', {
                  type: 'error',
                  message: r.body.message
                })
              }
            })
        }
      }
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
