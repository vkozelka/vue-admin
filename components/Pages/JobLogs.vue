<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('Job Access Logs (Admin)') }}</span>
    <ui-grid ref="joblogsGrid" :component="this" :columns="columns" :filter="true" :pager="true" :limiter="true" :search="false" resource_url="backend/joblog/index" :export="true" :limit_options="limitOpt" :buttons="true" :buttons_options="buttons" :defaultOrderDir="'desc'">
      <template slot="grid-items" slot-scope="props">
        <td>{{ datetimeFormatCustom(props.item.jl.created_at,'DD.M.YYYY') }}</td>
        <td>{{ datetimeFormatCustom(props.item.jl.created_at,'HH:mm:ss') }}</td>
        <td>
          <v-tooltip top>
            <div slot="activator" class="d-inline-block">
              <v-btn @click="blacklistIp(props.item.jl.ip_source)" icon small>
                <v-icon>cancel</v-icon>
              </v-btn>
            </div>
            <span v-text="'Add IP to Blacklist'"></span>
          </v-tooltip>
          <a target="_blank" :href="'http://en.utrace.de/?query='+ props.item.jl.ip_source">{{ props.item.jl.ip_source}}</a>
        </td>
          <td class="break"><abbr :title="props.item.jl.browser">{{ parseUserAgent(props.item.jl.browser) }}</abbr></td>
          <td class="break">{{ props.item.jl.http_referer != "0" ? props.item.jl.http_referer : 'Direct' }}</td>
          <td class="break"><a target="_blank" :href="props.item.jl.full_url">{{ props.item.jc.title}}</a></td>
          <td class="break"><a target="_blank" :href="'/cs/company/'+ (parseInt(props.item.u.id_user) + 100)">{{ props.item.ud.company_name }}</a></td>
        <td>ryb</td>
        <td>{{props.item.jl.origin}}</td>
      </template>
    </ui-grid>
    <hr/>
    <h3>Exports</h3>
    <ui-grid ref="exportjoblogGrid" :component="this" :filter="false" :columns="exportColumns" :pager="false" :limiter="false" :search="false" resource_url="backend/joblog/export" :export="false">
      <template slot="grid-items" slot-scope="props">
        <td><a target="_blank" :href="props.item.url">{{ props.item.filename}}</a>
          <small>(Size: {{props.item.filesize|readableSize}})</small>
        </td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.created_at, "DD.MM.YYYY")}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getExportActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <v-dialog v-model="showChart">
      <v-card>
        <ui-chart v-if="showChart " ref="jobChart" :count="chart"></ui-chart>
      </v-card>
    </v-dialog>
  </admin-layout>
</template>

<script>
  export default {
    name: 'JobLogs',
    mounted() {
      this.columns = [
        {text: 'Date', align: 'left', sortable: true, index: 'DATE(jl.created_at)', filter: 'date-picker-range', filterColumn: 'jl.created_at', filterOptions: {}},
        {text: 'Time', align: 'left', sortable: true, index: 'TIME(jl.created_at)', filter: 'full-text', filterColumn: 'TIME(jl.created_at)', filterOptions: {}},
        {text: 'IP', align: 'left', sortable: true, index: 'jl.ip_source', filter: 'full-text', filterColumn: 'jl.ip_source', filterOptions: {}},
        {text: 'Browser', align: 'left', sortable: true, index: 'jl.browser', filter: 'full-text', filterColumn: 'jl.browser', filterOptions: {}},
        {text: 'Referer', align: 'left', sortable: true, index: 'jl.http_referer', filter: 'full-text', filterColumn: 'jl.http_referer', filterOptions: {}},
        {text: 'Job Title', align: 'left', sortable: true, index: 'jc.title', filter: 'full-text', filterColumn: 'jc.title', filterOptions: {}},
        {text: 'Company', align: 'left', sortable: true, index: 'ud.company_name', filter: 'full-text', filterColumn: 'ud.company_name', filterOptions: {items: 'backend/user/company', id: 'id_user', text: 'company_name'}},
        {text: 'Portal', align: 'left', sortable: true, index: 'jl.id_log', filter: 'full-text', filterColumn: 'jl.portal', filterOptions: {}},
        {text: 'Code', align: 'left', sortable: true, index: 'jl.origin', filter: 'full-text', filterColumn: 'jl.origin', filterOptions: {}}
      ];
      this.exportColumns = [
        {text: 'Filename', align: 'left', sortable: false, index: null, filter: false},
        {text: 'Created', align: 'center', sortable: false, index: false, filter: false},
        {text: 'Actions', align: 'center', sortable: false, index: null, filter: false}
      ];
      this.$root.$on('joblogsGrid-chart', (grid) => {
        this.apiGet('backend/joblog/charts', {
          page: grid.currentPage,
          search: grid.currentSearchQuery,
          orderBy: grid.currentOrderBy,
          orderDir: grid.currentOrderDir,
          filter: grid.currentFilter
        }).then(r => {
          if (r.body.status === true) {
            this.chart.data = r.body.data
            this.chart.dates = r.body.dates
            this.chart.total = r.body.total
            this.chart.today = r.body.today
            this.chart.yesterday = r.body.yesterday
          }
          this.showChart = true

        })
      }),
        this.$refs.joblogsGrid.$on('export-complete', () => {
          this.$refs.exportjoblogGrid.$emit('reload');
        }),
        this.$on('action-clicked', (action) => {
          switch (action.type) {
            case 'delete-export':
              this.deleteExport(action.item.filename)
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
      parseUserAgent(agent) {
        var useragent = require('useragent')
        return useragent.parse(agent).toString()
      },
      getExportActions(item) {
        return [{
          type: 'delete-export',
          title: this.t('Delete'),
          icon: 'delete',
          item: item
        }]
      },
      blacklistIp(ip) {
        this.apiPost('backend/joblog/blacklistip', {
          ip: ip
        }).then(r => {
          this.$refs.joblogsGrid.$emit('reload');
        }).catch(e => {
          this.$root.$emit('show-alert', {
            type: 'error',
            title: 'Error',
            message: e
          })
        })
      },
      deleteExport(name) {
        this.apiPost('backend/joblog/deleteExport', {filename: name})
          .then(r => {
            if (r.body.status === true) {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: this.t('Export deleted')
              })
              this.$refs.exportjoblogGrid.$emit('reload')
            } else {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: r.body.message
              })
            }
          })
      },
    },
    data() {
      return {
        columns: [],
        exportColumns: [],
        limitOpt: [
          {text: '100', value: 100},
          {text: '500', value: 500},
          {text: '1000', value: 1000},
          {text: '2500', value: 2500},
          {text: '5000', value: 5000},
          {text: this.t('All'), value: 10000}
        ],
        buttons: [
          {text: this.t('Charts'), action: "joblogsGrid-chart"},
        ],
        showChart: false,
        chart: {
          data: [],
          dates: [],
          total: 0,
          today: 0,
          yesterday: 0
        }
      }

    }
  }
</script>

<style scoped>
  .break {
    word-wrap: break-word!important;
    max-width: 18px!important;
  }

  abbr {
    cursor: help;
  }
</style>
