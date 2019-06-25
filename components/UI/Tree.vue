<template>
  <div class="data-tree">
    <v-progress-linear v-bind:indeterminate="loading ? true : false"></v-progress-linear>
    <v-list v-if="items && items.length > 0">
      <v-list-tile avatar v-for="i in items" :key="i[id_field]">
        <v-list-tile-action v-if="displayCheckboxes == true">
          <v-checkbox v-model="selected" :value="i[id_field]"></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ i[display_field] }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <strong v-else>{{t('There are no items')}}</strong>
  </div>
</template>

<script>
  import Header from './Grid/Header'
  import Search from './Grid/Search'
  import Limiter from './Grid/Limiter'
  import Pager from './Grid/Pager'

  export default {
    name: 'Tree',
    props: ['component', 'checkbox', 'resource_url', 'display_field', 'id_field', 'selected_items'],
    components: {
      'ui-grid-header': Header,
      'ui-grid-search': Search,
      'ui-grid-limiter': Limiter,
      'ui-grid-pager': Pager
    },
    watch: {
      'selected' (newValues) {
        this.parentComponent.$emit('change-selected', newValues)
      }
    },
    data () {
      return {
        loading: false,
        parentComponent: null,
        items: [],
        selected: [],
        displayCheckboxes: false,
        currentOrderBy: 'created_at',
        currentOrderDir: 'asc'
      }
    },
    mounted () {
      this.displayCheckboxes = this.checkbox && this.checkbox === true
      this.selected = this.selected_items
      this.parentComponent = this.component
      this.loadData()
    },
    methods: {
      loadData () {
        this.loading = true
        this.apiGet(this.resource_url, {
          orderBy: this.currentOrderBy,
          orderDir: this.currentOrderDir
        }).then(response => {
          if (response.body.error) {
            this.loading = false
            this.$root.$emit('show-alert', {
              type: 'error',
              title: 'Error',
              message: response.body.error
            })
          } else {
            this.items = response.body.items
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
          this.$root.$emit('show-alert', {
            title: 'Error',
            type: 'error',
            message: error
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
</style>
