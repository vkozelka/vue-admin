<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('App Access Logs (Team)') }}</span>

    <ui-grid ref="logsGrid" :component="this" :columns="columns" :filter="true" :pager="true" :limiter="true" :search="false" resource_url="backend/applicationlog/index" :limit_options="limitOpt" :export="false" :buttons="true" :buttons_options="buttons" :defaultOrderDir="'desc'">
      <template slot="grid-items" slot-scope="props">
        <td>{{ datetimeFormatCustom(props.item.l.created_at,'D.M.YYYY') }}</td>
        <td>{{ datetimeFormatCustom(props.item.l.created_at,'HH:mm:ss') }}</td>
        <td><a target="_blank" :href="'http://en.utrace.de/?query='+ props.item.l.ip_source">{{ props.item.l.ip_source}}</a></td>
        <td class="break"><abbr :title="props.item.l.browser">{{ parseUserAgent(props.item.l.browser) }}</abbr></td>
        <td class="break">{{ props.item.l.http_referer != "0" ? props.item.l.http_referer : 'Direct' }}</td>
        <td class="break"><a target="_blank" :href="props.item.l.http_referer">{{ props.item.jc.title}}</a></td>
        <td class="break"><a target="_blank" :href="'/cs/company/' +(parseInt(props.item.u.id_user) + 100)">{{ props.item.ud.company_name }}</a></td>
        <td>ryb</td>
        <td>{{props.item.l.origin}}</td>

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
    name: 'AppLogs',
    mounted () {
      this.columns = [
        {text: 'Date', align: 'left', sortable: true, index: 'DATE(l.created_at)', filter: 'date-picker-range', filterColumn: 'l.created_at', filterOptions: {}},
        {text: 'Time', align: 'left', sortable: true, index: 'TIME(l.created_at)', filter: 'full-text', filterColumn: 'TIME(l.created_at)', filterOptions: {}},
        {text: 'IP', align: 'left', sortable: true, index: 'l.ip_source', filter: 'full-text', filterColumn: 'l.ip_source', filterOptions: {} },
        {text: 'Browser', align: 'left', sortable: true, index: 'l.browser', filter: 'full-text', filterColumn: 'l.browser', filterOptions: {}},
        {text: 'Referer', align: 'left', sortable: true, index: 'l.http_referer', filter: 'full-text', filterColumn: 'l.http_referer', filterOptions: {}},
        {text: 'Job Title', align: 'left', sortable: true, index: 'jc.title', filter: 'full-text', filterColumn: 'jc.title', filterOptions: {} },
        {text: 'Company', align: 'left', sortable: true, index: 'ud.company_name', filter: 'full-text', filterColumn: 'ud.company_name', filterOptions: { items: 'backend/applicationlog/company', id: 'id_user', text: 'company_name' } },
        {text: 'Portal', align: 'left', sortable: false, index: null, filter: 'full-text', filterColumn: 'l.portal', filterOptions: {}},
        {text: 'Code', align: 'left', sortable: true, index: 'l.origin', filter: 'full-text', filterColumn: 'l.origin', filterOptions: {}}
      ];
      this.exportColumns= [
        { text: 'Filename', align: 'left', sortable: false, index: null, filter: false },
        { text: 'Created', align: 'center', sortable: false, index: false, filter: false }
      ];
      this.$root.$on('applogsGrid-chart', (grid) => {
        this.apiGet('backend/applicationlog/charts', {
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
        this.$refs.logsGrid.$on('export-complete', () => {
          this.$refs.exportapplogGrid.$emit('reload');
        })
    },
    methods: {
      parseUserAgent (agent) {
        var useragent = require('useragent')
        return useragent.parse(agent).toString()
      },
      blacklistIp (ip) {
        this.apiPost('backend/joblog/blacklistip', {
          ip: ip
        }).then(r => {
          console.log(r);
          this.$refs.logsGrid.$emit('reload')
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
        columns: [],
        exportColumns: [],
        limitOpt:[
          { text: '10', value: 10 },
          { text: '50', value: 50 },
          { text: '100', value: 100 },
          { text: '250', value: 250 },
          { text: '500', value: 500 },
          { text: this.t('All'), value: 10000 }
        ],
        buttons: [
          {text: this.t('Charts'), action: "applogsGrid-chart"},
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
    max-width: 18px;
  }

</style>
