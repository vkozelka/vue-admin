<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Edit')}}: <span v-if="item">{{item.name}}</span></span>

        <v-toolbar>
          <v-btn flat @click="$router.go(-1)">
            <v-icon>keyboard_arrow_left</v-icon> {{t('Back')}}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click="saveItem()" :loading="save_loader">
            <v-icon>save</v-icon> {{t('Save')}}
          </v-btn>
          <v-btn color="orange" flat @click="resetItem()" :loading="reset_loader">
            <v-icon>cancel</v-icon> {{t('Reset')}}
          </v-btn>
        </v-toolbar>

        <v-form v-if="item">
          <v-tabs>
            <v-tabs-bar light color="grey lighten-2">
              <v-tabs-slider color="blue"></v-tabs-slider>
              <v-tabs-item href="tab-basic">{{t('Basic info')}}</v-tabs-item>
              <v-tabs-item href="tab-content">{{t('Localized Content')}}</v-tabs-item>
              <v-tabs-item href="tab-contact-list">{{t('Contact List')}}</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Internal name')" v-model="item.title" required></v-text-field>
                  <v-text-field :label="t('Code')" v-model="item.code" required></v-text-field>
                </v-container>
              </v-tabs-content>
              <v-tabs-content id="tab-content">
                <v-tabs grow>
                  <v-tabs-bar light color="grey lighten-1">
                    <v-tabs-slider color="blue"></v-tabs-slider>
                    <v-tabs-item v-for="(l, index) in languages" :key="index" :href="'tab-content-' + l.id_language">{{t(l.title)}}</v-tabs-item>
                  </v-tabs-bar>
                  <v-tabs-items>
                    <v-tabs-content v-for="(l, index) in languages" :key="index" :id="'tab-content-' + l.id_language">
                      <v-container>
                        <v-text-field :label="t('Subject')" v-model="contents[l.id_language].subject" required :counter="250" :rules="[(v) => v && v.length <= 250 || 'Max 250 characters', (v) => v && v.length > 0 || t('Required field')]"></v-text-field>

                        <div class="title">{{t('Content')}}</div>
                        <ui-wysiwyg :init="getEditorConfig()" v-model="contents[l.id_language].body"></ui-wysiwyg>
                      </v-container>
                    </v-tabs-content>
                  </v-tabs-items>
                </v-tabs>
              </v-tabs-content>
              <v-tabs-content id="tab-contact-list">
                <v-container>
                  <v-card>
                    <v-card-title>{{ editContactList.id_list_contact ? 'Edit contact' : 'Add contact' }}</v-card-title>
                    <v-card-text>
                      <v-text-field :label="t('E-mail')" v-model="editContactList.email" required></v-text-field>
                      <v-text-field :label="t('Code')" v-model="editContactList.code" required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn :color="editContactList.id_list_contact ? 'green' : 'blue'" dark @click="saveContactList()">{{ editContactList.id_list_contact ? 'Update' : 'Save' }}</v-btn>
                      <v-btn color="red" dark @click="resetContactList()" v-if="editContactList.id_list_contact">Reset</v-btn>
                    </v-card-actions>
                  </v-card>

                  <ui-grid ref="contactListGrid" v-if="item" :component="this" :columns="contactListColumns" :pager="false" :limiter="false" :search="false" :resource_url="'backend/email/contactlist/' + item.id_email">
                    <template slot="grid-items" slot-scope="props">
                      <td>{{props.item.email}}</td>
                      <td>{{props.item.code}}</td>
                      <td class="text-xs-center">{{datetimeFormat(props.item.created_at)}}</td>
                      <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
                    </template>
                  </ui-grid>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'EmailsEdit',
    mounted () {
      this.loadItem()
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.editContactList = {
              id_list_contact: action.item.id_list_contact,
              id_email: this.item.id_email,
              email: action.item.email,
              code: action.item.code
            }
            break
          case 'delete':
            this.apiPost('backend/email/removecontactlist/' + action.item.id_list_contact, {}).then((response) => {
              if (response.body.error) {
                this.$root.$emit("show-alert",{
                  type: 'error',
                  title: 'error',
                  message: 'Cannot save contact list'
                })
              } else {
                this.$refs.contactListGrid.$emit("reload")
                this.resetContactList()
              }
            })
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
      slugify (text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
      },
      loadItem () {
        this.apiGet('backend/email/edit/' + this.$route.params.id).then((response) => {
          this.reset_loader = false
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.editContactList.id_email = this.item.id_email
            this.contents = response.body.contents
            this.languages = response.body.languages
            this.save_loader = false
            this.reset_loader = false
            this.delete_loader = false
          }
        })
      },
      saveItem () {
        this.save_loader = true

        let item = this.item
        this.apiPost('backend/email/saveemail/' + this.item.id_email, item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            let promises = []
            this.languages.forEach((l) => {
              let p = new Promise((resolve, reject) => {
                this.apiPost('backend/email/saveemailcontent/' + this.item.id_email, this.contents[l.id_language]).then((response) => {
                  if (response.body.error) {
                    reject(response.body.error)
                  }
                  resolve(response.body)
                })
              })
              promises.push(p)
            })

            Promise.all(promises).then((r) => {
              this.save_loader = false
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Email saved'
              })
              this.resetItem()
            }).catch((e) => {
              this.save_loader = false
              this.$root.$emit('show-alert', {
                type: 'error',
                message: e
              })
            })
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.loadItem()
      },
      saveContactList () {
        this.apiPost('backend/email/savecontactlist/' + this.item.id_email, this.editContactList).then((response) => {
          if (response.body.error) {
            this.$root.$emit("show-alert",{
              type: 'error',
              title: 'error',
              message: 'Cannot save contact list'
            })
          } else {
            this.$refs.contactListGrid.$emit("reload")
            this.resetContactList()
          }
        })
      },
      resetContactList () {
        this.editContactList = {
          id_list_contact: null,
          id_email: null,
          email: null,
          code: null
        }
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
      }
    },
    data () {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: null,
        contents: [],
        languages: [],
        contactListColumns: [
          { text: 'Email', align: 'left', sortable: true, index: 'email' },
          { text: 'Code', align: 'left', sortable: true, index: 'code' },
          { text: 'Created', align: 'center', sortable: true, index: 'created_at' },
          { text: 'Actions', align: 'center', sortable: false, index: null }
        ],
        editContactList: {
          id_list_contact: null,
          id_email: null,
          email: null,
          code: null
        }
      }
    }
  }
</script>

<style scoped>
.title {
  display: inline-block;
  padding: 16px 0;
  width: auto
}
.mce-container {
  margin-bottom: 16px;
}
</style>
