<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Recruiters (Admin)')}}</span>

    <ui-grid :component="this" ref="companyGrid" :columns="columns" :pager="true" :limiter="true" :search="true" :filter="true" :export="true" resource_url="backend/user/company" :limit_options="limitOpt" :defaultOrderDir="'desc'">
      <template slot="grid-items" slot-scope="props">
        <td>{{props.item.u.id_user}}</td>
        <td>
          <a target="_blank" :href="'/cs/company/' + (parseInt(props.item.u.id_user) + 100)">{{props.item.u.company_name}}</a>
          <span v-if="props.item.u.deleted_at" style="color: red"> - {{t('Deleted')}}</span>
        </td>
        <td>
          <v-btn v-if="props.item.total_jobs" @click="openJobs(props.item.u.id_user)">{{t('jobs')}}</v-btn>
        </td>
        <td>
          <span v v-if="props.item.ud.first_name && props.item.ud.last_name">{{props.item.ud.first_name + " " + props.item.ud.last_name}}</span>
          <span v-else>{{props.item.u.email}}</span>
        </td>
        <td>{{t('ryb')}}</td>
        <td>{{ props.item.u.active_package.title }}</td>
        <td class="text-xs-center">
          <v-icon color="green" v-if="props.item.u.is_active == 1">done</v-icon>
          <v-icon color="red" v-else>do_not_disturb</v-icon>
        </td>
        <td class="text-xs-center">{{props.item.total_jobs}}</td>
        <td class="text-xs-center">{{props.item.total_jobs_off}}</td>
        <td class="text-xs-center">{{props.item.total_jobs_del}}</td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.u.created_at, 'D.M.YYYY')}}</td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.u.updated_at, 'D.M.YYYY', 'Never')}}</td>
        <td class="text-xs-center"><span :class="{'red--text':checkExpire(props.item.u.active_package)}">{{datetimeFormatCustom(props.item.u.active_package.package.active_to,'D.M.YYYY')}}</span></td>
        <ui-grid-actions v-if="!props.item.u.deleted_at" :component="getComponent()" :actions="getActions(props.item.u)"></ui-grid-actions>
      </template>
    </ui-grid>
    <hr/>
    <h3>Exports</h3>
    <ui-grid ref="exportusercompanyGrid" :component="this" :filter="false" :columns="exportColumns" :pager="false" :limiter="false" :search="false" resource_url="backend/user/export" :export="false">
      <template slot="grid-items" slot-scope="props">
        <td><a target="_blank" :href="props.item.url">{{ props.item.filename}}</a>
          <small>(Size: {{props.item.filesize|readableSize}})</small>
        </td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.created_at, "DD.MM.YYYY")}}</td>
        <ui-grid-actions :component="getComponent()" :actions="getExportActions(props.item)"></ui-grid-actions>
      </template>
    </ui-grid>

    <v-dialog v-model="jobDialog" v-if="company" :overlay="false" :max-width="600">
      <v-card>
        <v-card-title><h3>Change package for company: {{ company.company_name }}</h3></v-card-title>
        <v-card-text>
          <h4>Actual package: {{ company.active_package.title }} / Expire: {{ company.active_package.title === 'Freemium' ? 'Never' : company.active_package.remaining_days }}</h4>
          <p>
            <strong>Actual Variant</strong>:
            Days: {{ company.active_package.package.period< 0 ? "Unlimited" : company.active_package.package.period + " days"}},
            Jobs: {{ company.active_package.package.job_count < 0 ? "Unlimited" : company.active_package.package.job_count }},
            Job active days: {{ company.active_package.package.job_period < 0 ? "Unlimited" : company.active_package.package.job_period }},
          </p>
          <strong>Tempo: </strong>{{ company.active_tempo.name }}
          <br/><br/>
          <v-select :items="packages" v-model="packageEdit.id_package" :label="'Select package'" @change="loadPackageVariants"></v-select>
          <v-select :items="packageVariants" v-model="packageEdit.id_package_variant" :label="'Select package variant'" @change="selectVariant"></v-select>
          <div v-if="variant">
            <v-text-field type="number" v-model="variant.period" :label="'Custom package period'"></v-text-field>
            <strong>Package expiration</strong>: <span>{{ expirationDate(variant.period) }}</span>
          </div>
          <v-select :items="tempoPackages" v-model="packageEdit.id_tempo" :label="'Select Tempo'"></v-select>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" @click="closeDialog()">Close</v-btn>
          <v-btn dark color="green" v-if="variant" @click="assignPackage()">Assign package</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tempoDialog" v-if="company && tempoEdit.id_tempo" :overlay="false" :max-width="600">
      <v-card>
        <v-card-title><h3>Change Tempo for company: {{ company.company_name }}</h3></v-card-title>
        <v-card-text>
          <v-select :items="tempoPackages" v-model="tempoEdit.id_tempo" :label="'Select Tempo'"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" @click="closeDialog()">Close</v-btn>
          <v-btn dark color="green" @click="assignTempo()">Assign Tempo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </admin-layout>
</template>

<script>
  import moment from "moment"

  export default {
    name: 'Companies',
    mounted() {
      this.loadPackages()
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'users-edit', params: {id: action.item.id_user}})
            break
          case 'package':
            this.company = action.item
            this.resetPackage()
            this.jobDialog = true
            this.loadTempoPackages(0)
            console.log(this.company);
            break;
          case 'login':
            window.open(this.api_endpoint + 'user/ajax/loginfrombackend/' + action.item.id_user, '_blank');
            break;
          case 'delete':
            this.deleteUser(action.item.id_user)
            break;
          case 'delete-export':
            this.deleteExport(action.item.filename)
            break;
          case 'tempo':
            this.company = action.item
            this.tempoEdit.id_tempo = action.item.id_tempo ? action.item.id_tempo : "1"
            this.tempoDialog = true
            this.loadTempoPackages(1)
            break;
          default:
            this.$root.$emit('show-alert', {
              type: 'error',
              message: 'Unknown action: ' + action.title
            })
            break
        }
      }),
        this.$refs.companyGrid.$on('loading-complete', () => {
          this.columns.forEach((c) => {
            if (c.showCount && c.showCount == true) {
              this.apiGet('backend/user/count', {
                page: this.$refs.companyGrid.currentPage,
                search: this.$refs.companyGrid.currentSearchQuery,
                orderBy: this.$refs.companyGrid.currentOrderBy,
                orderDir: this.$refs.companyGrid.currentOrderDir,
                filter: this.$refs.companyGrid.currentFilter,
                limit: this.$refs.companyGrid.currentLimit,
                index: 'u.id_user'

              }).then(r => {
                if (r.body.count) {
                  c.text = c.defaultText + ' (' + r.body.count[0] + ')'
                }
              })
            }
          });
        }),
        this.$refs.companyGrid.$on('export-complete', () => {
          this.$refs.exportusercompanyGrid.$emit('reload');
        })
    },
    methods: {
      resetPackage() {
        this.packageEdit = {
          user_order_item_type: 'package',
          id_user: 0,
          id_package: 0,
          id_package_variant: 0,
          period: 0,
          jobCount: 0,
          jobRemains: 0,
          jobPeriod: 0,
          job_need_approval: false,
          is_active: true,
          active_from: null,
          active_to: null,
          id_tempo: 0
        }
      },
      openJobs(id) {
        let url = this.$router.resolve({
          name: 'jobs-from-company',
          params: {id: id},
        });
        window.open(url.href)
      },
      loadPackages() {
        this.apiGet('backend/package/index').then(r => {
          if (r && r.body && r.body.items && r.body.items.length > 0) {
            this.packages = []
            r.body.items.forEach(i => {
              this.packages.push({
                value: i.id_package,
                text: i.name
              })
            })
          }
        })
      },
      loadPackageVariants(p) {
        this.variant = null
        this.apiGet('backend/package/variant', {
          id_package: p
        }).then(r => {
          if (r && r.body && r.body.items && r.body.items.length > 0) {
            this.packageEdit.id_tempo = r.body.items[0].package.default_tempo
            this.packageVariants = []
            r.body.items.forEach(i => {
              this.packageVariants.push({
                value: i.id_package_variant,
                text: 'Days: ' + (parseInt(i.period) < 0 ? 'Unlimited' : i.period) + ', Jobs: ' + (parseInt(i.job_count) < 0 ? 'Unlimited' : i.job_count) + ', Job active days: ' + (parseInt(i.job_period) < 0 ? 'Unlimited' : i.job_period),
                variant: i
              })
            })
            console.log(this.tempoPackages);
          }
        })
      },
      loadTempoPackages(all) {
        this.tempoPackages = []
        this.apiGet('backend/package/tempo', {'allVariants': all})
          .then(r => {
            if (r && r.body && r.body.items && r.body.items.length > 0) {
              this.tempoPackages = []
              r.body.items.forEach(i => {
                this.tempoPackages.push({
                  value: i.id_package_tempo,
                  text: i.name,
                })
              })
            }
          })
      },
      selectVariant(e) {
        this.variant = null
        this.packageVariants.forEach(i => {
          if (i.variant.id_package_variant === e) {
            this.variant = i.variant
          }
        })
      },
      assignPackage() {
        this.apiPost('backend/user/package', {
          id_user: this.company.id_user,
          id_package_variant: this.variant.id_package_variant,
          period: this.variant.period,
          tempo: this.packageEdit.id_tempo
        }).then(r => {
          this.closeDialog()
          this.$refs.companyGrid.$emit('reload')
        }).catch(e => {
          console.log(e)
        })
      },
      assignTempo() {

        this.apiPost('backend/user/settempo', {
          id_user: this.company.id_user,
          tempo: this.tempoEdit.id_tempo
        }).then(r => {
          if (r && r.status) {
            this.closeDialog()
            this.$root.$emit('show-alert', {
              type: 'success',
              message: this.t("Tempo was updated")
            })
            this.$refs.companyGrid.$emit('reload')
          }
        }).catch(e => {
          this.$root.$emit('show-alert', {
            type: 'error',
            message: r.body.error
          })
        })
      },
      getComponent() {
        return this
      },
      getActions(item) {
        return [{
          type: 'login',
          title: 'Log in',
          icon: 'lock_open',
          item: item
        }, {
          type: 'package',
          title: 'Package',
          icon: 'work',
          item: item
        }, {
          type: 'edit',
          title: 'Edit',
          icon: 'mode_edit',
          item: item
        }, {
          type: 'tempo',
          title: 'Tempo',
          icon: 'autorenew',
          item: item
        }, {
          type: 'delete',
          title: 'Delete',
          icon: 'delete',
          item: item
        }]
      },
      getExportActions(item) {
        return [{
          type: 'delete-export',
          title: this.t('Delete'),
          icon: 'delete',
          item: item
        }]
      },
      closeDialog() {
        this.company = null
        this.jobDialog = false
        this.tempoDialog = false
        this.packageVariants = []
        this.tempoVariants = []
        this.variant = null
        this.tempoEdit.name = '',
          this.tempoEdit.id_tempo = 0

      },
      deleteUser(id_user) {
        if (confirm(this.t('Are you sure to delete user ?'))) {
          this.apiPost('backend/user/delete', {id_user: id_user})
            .then(r => {
              if (r.body.status === true) {
                this.$root.$emit('show-alert', {
                  type: 'success',
                  message: 'User deleted'
                })
                this.$refs.companyGrid.$emit('reload')
              } else {
                this.$root.$emit('show-alert', {
                  type: 'error',
                  message: r.body.error
                })
              }
            })
        }
      },
      checkExpire(time) {
        return (moment(time.package.active_to).unix() < moment().unix());
      },
      deleteExport(name) {
        this.apiPost('backend/user/deleteExport', {filename: name})
          .then(r => {
            console.log(r);

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
      }

    },
    data() {
      return {
        columns: [
          {text: 'Id', defaultText: 'Id', align: 'left', sortable: true, index: 'u.id_user', filter: 'select', filterColumn: '', filterOptions: {items: [{id: 1, text: "Single"}, {id: 1, text: 'Multiple'}]}, showCount: true},
          {text: 'Company name', defaultText: 'Company name', align: 'left', sortable: true, index: 'username', showCount: true},
          {text: 'Jobs', align: 'left', sortable: false, index: ''},
          {text: 'Contact person', align: 'left', sortable: true, index: 'ud.first_name'},
          {text: 'Portal', align: 'left', sortable: false, index: 'email', filter: 'select', filterColumn: "", filterOptions: {items: [{id: 1, text: 'ryb'}]}},
          {text: 'Package', align: 'center', sortable: false, index: null, filter: 'select', filterColumn: 'up.id_package', filterOptions: {items: 'backend/package/index', id: 'id_package', text: 'name'}},
          {text: 'Active?', align: 'center', sortable: true, index: 'u.is_active'},
          {text: 'Jobs ON', align: 'center', sortable: true, index: 'total_jobs'},
          {text: 'Jobs OFF', align: 'center', sortable: true, index: 'total_jobs_off'},
          {text: 'Jobs DEL', align: 'center', sortable: true, index: 'total_jobs_del'},
          {text: 'Created', align: 'center', sortable: true, index: 'u.created_at'},
          {text: 'Last Update', align: 'center', sortable: true, index: 'u.updated_at'},
          {text: 'Expiration', align: 'center', sortable: true, index: 'uhp.active_to'},
          {text: 'Actions', align: 'center', sortable: false, index: null}
        ],
        exportColumns: [
          {text: 'Filename', align: 'left', sortable: false, index: null, filter: false},
          {text: 'Created', align: 'center', sortable: false, index: false, filter: false},
          {text: 'Actions', align: 'center', sortable: false, index: null}

        ],
        actualTempo:null,
        company: null,
        jobDialog: false,
        tempoDialog: false,
        packages: [],
        packageVariants: [],
        variant: null,
        packageEdit: {
          user_order_item_type: 'package',
          id_user: 0,
          id_package: 0,
          id_package_variant: 0,
          period: 0,
          jobCount: 0,
          jobRemains: 0,
          jobPeriod: 0,
          job_need_approval: false,
          is_active: true,
          active_from: null,
          active_to: null,
          id_tempo: 0

        },
        limitOpt: [
          {text: '10', value: 10},
          {text: '50', value: 50},
          {text: '100', value: 100},
          {text: '250', value: 250},
          {text: '500', value: 500},
          {text: this.t('All'), value: 10000}
        ],
        tempoPackages: [],
        tempoEdit: {
          name: '',
          id_tempo: 0
        }
      }
    }
  }
</script>

<style scoped>

</style>
