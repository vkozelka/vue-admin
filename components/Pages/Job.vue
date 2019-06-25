<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Jobs (Admin)')}}</span>
    <ui-grid ref="jobGrid" :component="this" :filter="true"  :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/job/index" :export="true" :limit_options="limitOpt" :defaultOrderDir="'desc'">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.j.id_job}}</td>
        <td><a target="_blank" :href="'/cs/addetail/' + props.item.jc.slug + '?adminPreview=1'">{{ props.item.jc.title}}</a> </td>
        <td class="break"><a target="_blank" :href="'/cs/company/' + (parseInt(props.item.u.id_user) + 100)">{{ props.item.ud.company_name }}</a></td>
        <td>{{getCC(props.item.CC)}}</td>
        <td>{{ props.item.j.AC ? props.item.j.AC : 0 }}</td>
        <td>{{props.item.us.id_job_sector? addHundred(props.item.us.id_job_sector):'' }}</td>
        <td>{{getAD(props.item.jhc.id_job_contract) }}</td>
        <td>{{addHundred(props.item.jhs.id_job_sector) }}</td>
        <td>{{t('ryb')}}</td>
        <td class="text-xs-center">{{props.item.j.views}}</td>
        <td class="text-xs-center">{{props.item.click_applications}}</td>
        <td class="text-xs-center">{{props.item.applications}}</td>
        <td class="text-xs-center">
          <span v-if="props.item.j.deleted_at">DEL</span>
          <span v-else-if="props.item.j.is_active == 1">ON</span>
          <span v-else>OFF</span>
        </td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.j.sort_time, "DD.MM.YYYY")}}</td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.j.created_at, "DD.MM.YYYY")}}</td>
        <td class="text-xs-center"><span :class="{'red--text':checkExpire(props.item.j.active_to)}">{{datetimeFormatCustom(props.item.j.active_to, "DD.MM.YYYY")}}</span></td>
        <td>{{getPackage(props.item.package_name)}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>
    <hr />
    <h3>Exports</h3>
    <ui-grid ref="exportjobGrid" :component="this" :filter="false"  :columns="exportColumns" :pager="false" :limiter="false" :search="false" resource_url="backend/job/export" :export="false">
      <template slot="grid-items" slot-scope="props">
        <td><a target="_blank" :href="props.item.url">{{ props.item.filename}}</a> <small>(Size: {{props.item.filesize|readableSize}})</small></td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.created_at, "DD.MM.YYYY")}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getExportActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>
    <v-dialog v-if="acEdit" v-model="acEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ t('Edit AC') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field type="number" v-model="acValue.value" :label="'AC for: ' + acValue.title "></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="cancelAC()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click.stop="saveAC()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </admin-layout>
</template>

<script>
  import moment from "moment"
  export default {
    name: 'Articles',
    mounted () {
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'delete':
            this.deleteJob(action.item)
            break
          case 'recover':
            this.recoverJob(action.item)
            break
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
      }),
        this.$refs.jobGrid.$on('loading-complete', () => {
          this.getCount()
        }),
        this.$refs.jobGrid.$on('export-complete', () => {
          this.$refs.exportjobGrid.$emit('reload');
        })
    },
    methods: {
      getComponent () {
        return this
      },
      getActions (item) {
        return [{
          type: 'recover',
          title: 'Recover',
          icon: 'restore_from_trash',
          item: item
        },{
          type: 'delete',
          title: 'Delete',
          icon: 'delete',
          item: item
        }]
      },
      getCount(){
        let url='backend/job/count'
        if(this.$route.params.id!=undefined){
          url='backend/job/count/'+this.$route.params.id
        }
        this.columns.forEach((c) => {
          if (c.showCount && c.showCount == true) {
            this.apiGet(url, {
              page: this.$refs.jobGrid.currentPage,
              search: this.$refs.jobGrid.currentSearchQuery,
              filter: this.$refs.jobGrid.currentFilter,
              index: c.countIndex
            }).then(r => {
              if (r.body) {
                c.text = c.defaultText + ' (' + r.body.count + ')'
              }
            })
          }
        });
      },
      getExportActions(item){
        return [{
          type: 'delete-export',
          title: this.t('Delete'),
          icon: 'delete',
          item: item
        }]
      },
      checkExpire(time){
        return (moment(time).unix() < moment().unix());
      },
      deleteJob (job) {
        this.apiPost('backend/job/delete', {
          id: job.j.id_job
        }).then(r => {
          if (r && r.body && r.body.status && r.body.status === true) {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Job deleted'
            })
            this.$refs.jobGrid.$emit('reload')
          }
        }).catch(e => {
          this.$root.$emit('show-alert', {
            message: e,
            type: 'error'
          })
        })
      },
      addHundred(number){
        return parseInt(number)+100;
      },
      deleteExport(name){
        this.apiPost('backend/job/deleteExport', {filename: name})
          .then(r => {
            if (r.body.status === true) {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: this.t('Export deleted')
              })
              this.$refs.exportjobGrid.$emit('reload')
            } else {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: r.body.message
              })
            }
          })
      },
      getCC(total){
        var count = total
        var data={
          "9":1,
          "59":2,
          "149":3,
          "599":4,
          "1499":5,
          "1000":6,
          "9999":7
        }
        return data[count]
      },
      getAD(id_contract){
        var code;
        switch(parseInt(id_contract)) {
          case 7:
            code = 1;
            break;
          case 6:
            code =2;
            break;
          case 5:
            code = 3;
            break;
          case 4:
            code = 4;
            break;
          case 3:
            code = 5;
            break;
          case 2:
            code = 6;
            break;
          case 1:
            code = 7;
            break;
          default:
            code =''
        }

        return code
      },
      getPackage(name){
        return name.toUpperCase().substr(0,2)
      },
      editAC(job,title){
        this.acEdit=true
        this.acValue.value= job.AC ? job.AC : ""
        this.acValue.title= title
        this.acValue.job=job.id_job
      },
      cancelAC(){
        this.acEdit=false
        this.acValue.value=null
        this.acValue.title=null
      },
      saveAC(){
          this.apiPost('backend/job/update', {
            ac: this.acValue.value,
            id_job: this.acValue.job
          }).then(r => {
            if (r && r.body && r.body.status && r.body.status === true) {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'AC updated'
              })
              this.$refs.jobGrid.$emit('reload')
            }
          }).catch(e => {
            this.$root.$emit('show-alert', {
              message: e,
              type: 'error'
            })
          })
        this.cancelAC()
      },
      recoverJob (job) {
        this.apiPost('backend/job/recover', {
          id: job.j.id_job
        }).then(r => {
          if (r && r.body && r.body.status && r.body.status === true) {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Job recovered'
            })
            this.$refs.jobGrid.$emit('reload')
          }
        }).catch(e => {
          this.$root.$emit('show-alert', {
            message: e,
            type: 'error'
          })
        })
      }
    },
    data () {
      return {
        totalItems: 0,
        columns: [
          { text: 'Id', defaultText:'Id', align: 'left', sortable: true, index: "j.id_job",countIndex:'j.id_job', filter: 'select',showCount:true,filterColumn:'j.id_site',filterOptions:{items: [{id:1,text:"Single"},{id:2,text:'Multiple'}]} },
          { text: 'Title', defaultText:'Title', align: 'left', sortable: true, countIndex:'j.id_job', index: "jc.title", filter: false,showCount:true },
          { text: 'Company', defaultText:'Company', align: 'left', sortable: true, countIndex:'j.id_company',index: "ud.company_name", filter: false,showCount:true},
          { text: 'CC', align: 'left', sortable: true, index: "CC", filter: false, },
          { text: 'AC', align: 'left', sortable: true, index: "j.ac", filter: false, },
          { text: 'CS', align: 'left', sortable: true, index: "us.id_job_sector", filter: false, },
          { text: 'AD', align: 'left', sortable: true, index: "jhc.id_job_contract", filter: false, },
          { text: 'AS', align: 'left', sortable: true, index: "jhs.id_job_sector", filter: false, },
          { text: 'Portal', align: 'left', sortable: false, index: "index", filter:'select',filterColumn:"",filterOptions:{items:[{id:1,text:'ryb'}]} },
          { text: 'V', align: 'center', sortable: true, index: "j.views", tooltip: 'Views', filter: false },
          { text: 'CA', align: 'center', sortable: true, index: "click_applications", tooltip: 'Click Applications', filter: false },
          { text: 'A', align: 'center', sortable: true, index: "applications", tooltip: 'Applications', filter: false },
          { text: 'Active?', align: 'center', sortable: false, index: "j.is_active", filter: 'select', filterColumn: "j.is_active", filterOptions: {items:[{id:0,text:"OFF"},{id:1,text:"ON"}, {id:-1,text:"DEL"}]} },
          { text: 'Now', align: 'center', sortable: true, index: 'j.sort_time', filter: false },
          { text: 'Created', align: 'center', sortable: true, index: "j.created_at", filter: false },
          { text: 'Active to', align: 'center', sortable: true, index: "j.active_to", filter: false },
          { text: 'Pack', align: 'center', sortable: false, index: null, filter: 'select', filterColumn: 'up.id_package', filterOptions: {items: 'backend/package/index', id: 'id_package', text: 'name'}},
          { text: 'Actions', align: 'center', sortable: false, index: null, filter: false }
        ],
        exportColumns: [
          { text: 'Filename', align: 'left', sortable: false, index: null, filter: false },
          { text: 'Created', align: 'center', sortable: false, index: false, filter: false },
          { text: 'Actions', align: 'center', sortable: false, index: null, filter: false }
        ],
        limitOpt:[
          { text: '10', value: 10 },
          { text: '50', value: 50 },
          { text: '100', value: 100 },
          { text: '250', value: 250 },
          { text: '500', value: 500 },
          { text: this.t('All'), value: 10000 }
        ],
        filterActive:false,
        acEdit:null,
        acValue:{}
      }
    }
  }
</script>

<style scoped>
  .break {
    max-width: 160px;
  }
</style>
