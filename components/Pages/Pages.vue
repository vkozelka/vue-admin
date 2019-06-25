<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('Pages') }}</span>

    <ui-grid :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" :resource_url="'backend/page/index?id_language='+getLanguage()">
      <template slot="grid-items" slot-scope="props">
        <td v-if="props.item.p.public==1">
          <a :href="getUlr(props.item.pc)" target="_blank">{{props.item.p.name}}</a>
        </td>
        <td v-else>
          {{props.item.p.name}}
        </td>
        <td>{{props.item.p.module}}</td>
        <td>{{props.item.p.controller}}</td>
        <td class="text-xs-center">
          <v-icon v-if="props.item.p.is_active">done</v-icon>
          <v-icon v-else>do_not_disturb</v-icon>
        </td>
        <td class="text-xs-center">{{datetimeFormat(props.item.p.active_from, '-')}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.p.active_to, '-')}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.p.created_at)}}</td>
        <td class="text-xs-center">{{datetimeFormat(props.item.p.updated_at, t('Never'))}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <div class="text-xs-right">
      <v-btn fab dark fixed right bottom color="indigo" @click="addPage()">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Pages',
    mounted() {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'pages-edit', params: {id: action.item.id_page}})
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
      addPage() {
        this.$router.push('/pages/new')
      },
      getUlr(page) {
        return window.location.origin + '/'+this.language.code+'/'+page.slug
      },
      getLanguage() {
        let l = localStorage.getItem('x-admin-language')
        switch (l) {
          case 'de_DE':
            this.language.id=1
            this.language.code='de'
            break;
          case 'en_GB':
            this.language.id=2
            this.language.code='en'
            break;
          case 'cs_CZ':
            this.language.id=3
            this.language.code='cs'
            break;
        }
        return this.language.id;
      }
    },
    data() {
      return {
        columns: [
          {text: 'Name', align: 'left', sortable: true, index: 'name'},
          {text: 'Module', align: 'left', sortable: true, index: 'module'},
          {text: 'Handler', align: 'left', sortable: true, index: 'controller'},
          {text: 'Active?', align: 'center', sortable: false, index: 'is_active'},
          {text: 'Active From', align: 'center', sortable: true, index: 'active_from'},
          {text: 'Active To', align: 'center', sortable: true, index: 'active_to'},
          {text: 'Created', align: 'center', sortable: true, index: 'created_at'},
          {text: 'Last Update', align: 'center', sortable: true, index: 'updated_at'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ],
        language:{id:2,code:'en'}
      }
    }
  }
</script>

<style scoped>

</style>
