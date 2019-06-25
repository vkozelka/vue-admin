<template>
  <div class="data-grid" v-if="columns && columns.length > 0">
    <v-container fluid>
      <v-layout>
        <v-flex row>
          <ui-grid-search class="data-grid__search" v-if="displaySearch" :current-query="currentSearchQuery"></ui-grid-search>
        </v-flex>
      </v-layout>
    </v-container>
    <div v-if='displayButtons' class="text-xs-left mb-3">
        <v-btn v-for="b in buttons_options" :key="b.action" class="btn" @click="emitaction(b.action)">{{b.text}}</v-btn>
    </div>
    <table>
      <thead>
      <tr>
        <th class="datagrid-header" v-if="displayCheckboxes === true">
          <ui-grid-actions-bulk v-if="selected.length > 0" :component="component" :actions="component.getBulkActions(selected)"></ui-grid-actions-bulk>
        </th>
        <ui-grid-header v-for="(ch, chi) in columns" :key="chi" :column="ch" :sort-column="currentOrderBy" :customStyle="ch.style" :sort-dir="currentOrderDir"></ui-grid-header>
      </tr>
      <tr v-if="filter === true">
        <ui-grid-filter  v-for="(ch, chi) in columns" :key="chi" :column="ch"></ui-grid-filter>
      </tr>
      <tr>
        <th :colspan="displayCheckboxes === true ? columns.length + 1 : columns.length">
          <v-progress-linear v-bind:indeterminate="loading ? true : false"></v-progress-linear>
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-if="items && items.length > 0">
        <tr v-for="(i,index) in items" :key="index">
          <td v-if="displayCheckboxes === true" class="text-xs-center">
            <v-checkbox v-model="selected" :value="i[idField]"></v-checkbox>
          </td>
          <slot :item="i" name="grid-items"></slot>
        </tr>
      </template>
      <tr v-else>
        <td :colspan="displayCheckboxes === true ? columns.length + 1 : columns.length">
          <v-alert color="info" icon="info" value="true">{{t('No items')}}</v-alert>
        </td>
      </tr>
      </tbody>
    </table>
    <v-container fluid>
      <v-layout>
        <v-flex xs9>
          <ui-grid-pager v-if="displayPager && totalPages > 1" :total-pages="totalPages" :current-page="currentPage"></ui-grid-pager>
        </v-flex>
        <v-flex xs3>
          <ui-grid-limiter v-if="displayLimiter" :current-limit="currentLimit" :options="limit_options"></ui-grid-limiter>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid v-if="displayExport">
      <v-layout>
        <v-flex xs12>
          <v-btn @click="exportData()" :loading="loading">Export visible items to XLSX</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Header from './Grid/Header'
  import Search from './Grid/Search'
  import Limiter from './Grid/Limiter'
  import Pager from './Grid/Pager'
  import GridFilter from './Grid/Filter'

  export default {
    name: 'Grid',
    props: ['search', 'limiter', 'pager', 'filter', 'resource_url', 'columns', 'checkbox', 'idField', 'component', 'export', 'limit_options', 'buttons','buttons_options','defaultOrderDir','load'],
    components: {
      'ui-grid-header': Header,
      'ui-grid-search': Search,
      'ui-grid-limiter': Limiter,
      'ui-grid-pager': Pager,
      'ui-grid-filter': GridFilter
    },
    data() {
      return {
        loading: false,
        items: [],
        selected: [],
        selectedAll: false,
        displaySearch: false,
        displayLimiter: false,
        displayPager: false,
        displayFilter: false,
        displayCheckboxes: false,
        displayExport: false,
        displayButtons: false,
        currentSearchQuery: '',
        currentFilter: {},
        currentPage: 1,
        currentLimit: this.limit_options ? this.limit_options[0].value : 25,
        currentOrderBy: 'created_at',
        currentOrderDir: this.defaultOrderDir ? this.defaultOrderDir : 'asc',
        totalPages: 1,
        totalItems: 0
      }
    },
    mounted() {
      this.displaySearch = this.search && this.search === true
      this.displayLimiter = this.limiter && this.limiter === true
      this.displayPager = this.pager && this.pager === true
      this.displayCheckboxes = this.checkbox && this.checkbox === true
      this.displayFilter = this.filter && this.filter === true
      this.displayExport = this.export && this.export === true
      this.displayButtons = this.buttons && this.buttons === true

      if(this.load!==false){
        this.loadData()
      }

      // Detect sorting
      this.$on('reload', () => {
        this.loadData()
      })
      this.$on('change-sort', (data) => {
        this.currentOrderBy = data.column
        this.currentOrderDir = data.dir
        this.loadData()
      })
      this.$on('change-limit', (data) => {
        this.currentLimit = data.limit
        this.loadData()
      })
      this.$on('change-page', (data) => {
        this.currentPage = data.page
        this.loadData()
      })
      this.$on('change-search', (data) => {
        this.currentSearchQuery = data.query
        this.currentPage = 1
        this.loadData()
      })
      this.$on('change-filter', (data) => {
        this.currentFilter[data.column] = {
          type: data.type,
          value: data.value
        }
        if (data.value === null || data.value === '') {
          delete this.currentFilter[data.column]
        }
        console.log(this.currentFilter)
        this.currentPage = 1
        this.loadData()
      })
      this.$on('export', () => {
        this.exportData()
      })
      this.$on('bulk-action-emit', () => {

      })
    },
    methods: {
      exportData() {
        this.loading = true
        this.apiGet(this.resource_url, {
          export: true,
          page: this.currentPage,
          limit: this.currentLimit,
          search: this.currentSearchQuery,
          orderBy: this.currentOrderBy,
          orderDir: this.currentOrderDir,
          filter: this.currentFilter
        }).then(response => {
          if (response.body.error) {
            this.loading = false
            this.$root.$emit('show-alert', {
              type: 'error',
              title: 'Error',
              message: "Grid [165]: " + response.body.error
            })
          } else {
            this.loading = false
            this.$emit('export-complete', response.body)
          }
        }).catch(error => {
          this.loading = false
          this.$root.$emit('show-alert', {
            title: 'Error',
            type: 'error',
            message: "Grid [176]: " + error
          })
        })
      },
      emitaction(action){
        this.$root.$emit(action,this)
      },
      loadData() {
        this.loading = true
        this.apiGet(this.resource_url, {
          page: this.currentPage,
          limit: this.currentLimit,
          search: this.currentSearchQuery,
          orderBy: this.currentOrderBy,
          orderDir: this.currentOrderDir,
          filter: this.currentFilter
        }).then(response => {
          if (response.body.error) {
            this.loading = false
            this.$root.$emit('show-alert', {
              type: 'error',
              title: 'Error',
              message: "Grid [195]: " + response.body.error
            })
          } else {
            this.items = response.body.items
            this.currentPage = response.body.pager ? response.body.pager.currentPage : 0
            this.currentLimit = response.body.pager ? response.body.pager.currentLimit : 0
            this.totalPages = response.body.pager ? response.body.pager.totalPages : 0
            this.totalItems = response.body.pager ? response.body.pager.totalItems : 0
            this.loading = false
            this.$emit('loading-complete', {
              items: response.body.items,
              currentPage: response.body.pager ? response.body.pager.currentPage : 0,
              currentLimit: response.body.pager ? response.body.pager.currentLimit : 0,
              totalPages: response.body.pager ? response.body.pager.totalPages : 0,
              totalItems: response.body.pager ? response.body.pager.totalItems : 0
            })
          }
        }).catch(error => {
          this.loading = false
          this.$root.$emit('show-alert', {
            title: 'Error',
            type: 'error',
            message: "Grid [217]: " + error
          })
        })
      }
    }
  }
</script>

<style scoped>
  .data-grid,
  table {
    width: 100%;
  }

  .data-grid tr:nth-child(2n) td {
    background-color: #e8e9e8 !important;
  }
</style>