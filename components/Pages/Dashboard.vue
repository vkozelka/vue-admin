<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Dashboard')}}</span>

    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg4>
          <v-card color="blue darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">{{t('Articles')}}</div>
            </v-card-title>
            <v-card-text>
              <div>{{t('Total count')}}: {{ articles.total }} / {{t('Categories')}}: {{ articles.categories }}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat dark @click="goToArticles()">{{t('Manage articles')}}</v-btn>
              <v-btn flat dark @click="goToArticleCategory()">{{t('Manage categories')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 md4 lg4>
          <v-card color="green darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">{{t('Pages')}}</div>
            </v-card-title>
            <v-card-text>
              <div>{{t('Total count')}}: {{ pages.total }}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat dark @click="goToPages()">{{t('Manage pages')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 md4 lg4>
          <v-card color="orange darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">{{t('Media')}}</div>
            </v-card-title>
            <v-card-text>
              <div>{{t('Total images')}}: {{ media.images}} / {{t('Total files')}}: {{ media.files}}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat dark @click="goToImages()">{{t('Manage images')}}</v-btn>
              <v-btn flat dark @click="goToFiles()">{{t('Manage files')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-card>
        <v-card-title><h2>Companies waiting activation</h2></v-card-title>
        <v-card-text>
          <ui-grid :component="this" :columns="companyColumns" :pager="true" resource_url="backend/user/companynotactivated">
            <template slot="grid-items" slot-scope="props">
              <td>{{props.item.company_name}}</td>
              <td>
                <span v-if="props.item.contact_person">{{props.item.contact_person.name}}<br/><small>{{props.item.contact_person.email}}</small></span>
                <span v-else>{{props.item.email}}</span>
              </td>
              <td>{{ props.item.active_package.title }}<br/>
                <small>Expire: {{props.item.active_package.remaining_days}}</small>
              </td>
              <td class="text-xs-center">
                <v-icon color="green" v-if="props.item.is_active == 1">done</v-icon>
                <v-icon color="red" v-else>do_not_disturb</v-icon>
              </td>
              <td class="text-xs-center">{{props.item.total_jobs}}</td>
              <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
              <td class="text-xs-center">{{datetimeFormat(props.item.updated_at, 'Never')}}</td>
            </template>
          </ui-grid>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title><h2>Jobs waiting for approve</h2></v-card-title>
        <v-card-text>
          <ui-grid ref="jobGrid" :component="this" :columns="jobColumns" :pager="true" resource_url="backend/job/jobnotapproved">
            <template slot="grid-items" slot-scope="props">
              <td><a target="_blank" :href="'/cs/addetail/' + props.item.jc.slug + '?adminPreview=1'">{{ props.item.jc.title}}</a>
                <small>(ID: {{props.item.j.id_job}})</small>
              </td>
              <td>{{ props.item.ud.company_name }}</td>
              <td class="text-xs-center">{{datetimeFormat(props.item.j.created_at)}}</td>
              <td class="text-xs-center">
                <v-btn @click="approveJob(props.item)" icon color="green" dark :small="true" :loading="props.item.loading">
                  <v-icon small>check</v-icon>
                </v-btn>
                <v-btn @click="deleteJob(props.item)" icon color="red" dark :small="true" :loading="props.item.loading">
                  <v-icon small>delete</v-icon>
                </v-btn>
              </td>
            </template>
          </ui-grid>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-card-title><h2>Clicks application & Job applications</h2></v-card-title>
        <v-card-text>
          <ui-grid ref="applicationGrid" :component="this" :columns="applicationColumns" :pager="true" :limiter="true" :limit_options="limitOpt" :buttons="true" :buttons_options="buttons" resource_url="backend/jobapplication/index"
                   :defaultOrderDir="'desc'">
            <template slot="grid-items" slot-scope="props">
              <td><a target="_blank" :href="api_endpoint + 'cs/company/' + (parseInt(props.item.c.id_user) + 100)">{{ props.item.cd.company_name}}</a></td>
              <td v-if="props.item.ud && props.item.ud.id_user"><a target="_blank" :href="api_endpoint + 'cs/public-profile?hash=' + props.item.u.public_hash">{{ props.item.ud.first_name+" "+props.item.ud.last_name }}</a></td>
              <td v-else>{{ props.item.a.application_type == "internal" ? props.item.a.first_name+" "+props.item.a.last_name : "Anonymous" }}</td>
              <td class="text-xs-center">{{ props.item.a.application_type }}</td>
              <td class="text-xs-center">{{datetimeFormat(props.item.a.created_at)}}</td>
              <td class="text-xs-center" :class="{'red--text':checkExpire(props.item.consent_date)}">{{datetimeFormat(props.item.consent_date) }}</td>
              <td class="text-xs-center">
                <v-btn v-if="props.item.a.deleted_at" @click="recoverApplication(props.item)" icon color="green" dark :small="true" :loading="props.item.loading">
                  <v-icon small>check</v-icon>
                </v-btn>
                <v-btn @click="deleteApplication(props.item)" icon color="red" dark :small="true" :loading="props.item.loading">
                  <v-icon small>delete</v-icon>
                </v-btn>
              </td>
            </template>
          </ui-grid>
        </v-card-text>
      </v-card>
    </v-container>

  </admin-layout>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'Dashboard',
    mounted() {
      this.loadCounters()
      this.$root.$on('dashboard-massDelete', (grid) => {
        if (confirm("Really delete application?")) {
          this.apiGet('backend/jobapplication/massdelete')
            .then(r => {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Applications deleted'
              })
              this.$refs.applicationGrid.$emit('reload')
            })
            .catch(error => {
              this.$root.$emit('show-alert', {
                title: 'Error',
                type: 'error',
                message: error
              })
            })
        }
      })

    },
    data() {
      return {
        articles: {
          total: 0,
          categories: 0
        },
        media: {
          images: 0,
          files: 0
        },
        pages: {
          total: 0
        },
        companyColumns: [
          {text: 'Company name', align: 'left', sortable: true, index: 'username'},
          {text: 'Contact person', align: 'left', sortable: true, index: 'email'},
          {text: 'Package', align: 'center', sortable: false, index: null},
          {text: 'Active?', align: 'center', sortable: false, index: 'is_active'},
          {text: 'Jobs', align: 'center', sortable: false, index: 'total_jobs'},
          {text: 'Created', align: 'center', sortable: true, index: 'created_at'},
          {text: 'Last Update', align: 'center', sortable: true, index: 'updated_at'}
        ],
        jobColumns: [
          {text: 'Job title', align: 'left', sortable: true, index: false},
          {text: 'Company name', align: 'left', sortable: true, index: false},
          {text: 'Created at', align: 'center', sortable: true, index: false},
          {text: 'Approve', align: 'center', sortable: true, index: false}
        ],
        applicationColumns: [
          {text: 'Company', align: 'left', sortable: true, index: 'cd.company_name'},
          {text: 'Candidate', align: 'left', sortable: true, index: 'a.first_name'},
          {text: 'Application', align: 'center', sortable: true, index: 'a.application_type'},
          {text: 'Date', align: 'center', sortable: true, index: 'a.created_at'},
          {text: 'Consent date', align: 'center', sortable: true, index: 'consent_date'},
          {text: 'Action', align: 'center', sortable: false, index: false}
        ],
        limitOpt: [
          {text: '10', value: 10},
          {text: '50', value: 50},
          {text: '100', value: 100},
          {text: '250', value: 250},
          {text: '500', value: 500},
          {text: this.t('All'), value: 10000}
        ],
        buttons: [
          {text: this.t('Delete overdated'), action: "dashboard-massDelete"},
        ],
      }
    }
    ,
    methods: {

      getConsentDate(date, consent) {
        return moment(date).add(consent, 'months')
      }
      ,
      loadCounters() {
        this.apiGet('backend/dashboard/index').then(response => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              title: 'Error',
              message: response.body.error
            })
          } else {
            this.articles = response.body.articles
            this.media = response.body.media
            this.pages = response.body.pages
          }
        }).catch(error => {
          this.$root.$emit('show-alert', {
            title: 'Error',
            type: 'error',
            message: error
          })
        })
      }
      ,
      goToArticles() {
        this.$router.push('/articles')
      }
      ,
      goToArticleCategory() {
        this.$router.push('/article-categories')
      }
      ,
      goToPages() {
        this.$router.push('/pages')
      }
      ,
      goToImages() {
        this.$router.push('/images')
      }
      ,
      goToFiles() {
        this.$router.push('/files')
      }
      ,
      checkExpire(time) {
        return (moment(time).unix() < moment().unix());
      }
      ,
      approveJob(job) {
        this.apiPost('backend/job/approve', {
          id: job.j.id_job
        }).then(r => {
          if (r && r.body && r.body.status && r.body.status === true) {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Job approved'
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
      ,
      deleteJob(job) {
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
      }
      ,
      recoverApplication(application) {
        if (confirm("Really recover application?")) {
          this.apiPost('backend/jobapplication/recover', {
            id: application.a.id_job_application
          }).then(r => {
            if (r && r.body && r.body.status && r.body.status === true) {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Job Application recovered'
              })
              this.$refs.applicationGrid.$emit('reload')
            }
          }).catch(e => {
            this.$root.$emit('show-alert', {
              message: e,
              type: 'error'
            })
          })
        }
      }
      ,
      deleteApplication(application) {
        if (confirm("Really delete application?")) {
          this.apiPost('backend/jobapplication/delete', {
            id: application.a.id_job_application
          }).then(r => {
            if (r && r.body && r.body.status && r.body.status === true) {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Job Applciation deleted'
              })
              this.$refs.applicationGrid.$emit('reload')
            }
          }).catch(e => {
            this.$root.$emit('show-alert', {
              message: e,
              type: 'error'
            })
          })
        }
      }
    }
  }
</script>