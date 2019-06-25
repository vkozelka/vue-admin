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
          <v-btn color="red" flat @click="deleteItem()" :loading="delete_loader">
            <v-icon>delete</v-icon> {{t('Delete')}}
          </v-btn>
        </v-toolbar>

        <v-form v-if="item">
          <v-tabs>
            <v-tabs-bar light color="grey lighten-2">
              <v-tabs-slider color="blue"></v-tabs-slider>
              <v-tabs-item href="tab-basic">{{t('Basic info')}}</v-tabs-item>
              <v-tabs-item href="tab-content">{{t('Localized Content')}}</v-tabs-item>
              <v-tabs-item href="tab-config">{{t('Page configuration')}}</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Internal name')" v-model="item.name" required></v-text-field>
                  <v-checkbox :label="t('Is active?')" v-model="item.is_active" required></v-checkbox>
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
                        <v-layout row wrap>
                          <v-flex xs12 sm6 md8>
                            <v-text-field @keyup="contents[l.id_language].slug =  contents[l.id_language].generate_slug ? slugify(contents[l.id_language].title) : contents[l.id_language].slug" :label="t('Title')" v-model="contents[l.id_language].title" required :counter="250" :rules="[(v) => v && v.length <= 250 || 'Max 250 characters', (v) => v && v.length > 0 || t('Required field')]"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <br />
                            <v-checkbox :label="t('Generate slug while typing')" v-model="contents[l.id_language].generate_slug"></v-checkbox>
                          </v-flex>
                        </v-layout>
                        <v-text-field :label="t('Slug')" v-model="contents[l.id_language].slug" required :counter="250" :rules="[(v) => v && v.length <= 250 || 'Max 250 characters', (v) => v && v.length > 0 || t('Required field')]"></v-text-field>

                        <div v-if="item && item.module == 'content' && item.controller == 'page' && item.action == 'index'">
                          <div class="title">{{t('Content')}}</div>
                          <ui-wysiwyg :init="getEditorConfig()" v-model="contents[l.id_language].body"></ui-wysiwyg>
                        </div>

                        <v-card-title class="title">{{t('Search Engine Optimalization')}}</v-card-title>
                        <v-text-field :label="t('Title')" v-model="contents[l.id_language].seo_title" :counter="250" :rules="[(v) => v && v.length <= 250 || t('Max 250 characters')]"></v-text-field>
                        <v-text-field :label="t('Description')" v-model="contents[l.id_language].seo_description" :counter="250" :rules="[(v) => v && v.length <= 250 || t('Max 250 characters')]"></v-text-field>
                        <v-text-field :label="t('Keywords')" v-model="contents[l.id_language].seo_keywords" :counter="250" :rules="[(v) => v && v.length <= 250 || t('Max 250 characters')]"></v-text-field>
                        <v-text-field :label="t('Robots')" v-model="contents[l.id_language].seo_robots" :counter="250" :rules="[(v) => v && v.length <= 250 || t('Max 250 characters')]"></v-text-field>
                      </v-container>
                    </v-tabs-content>
                  </v-tabs-items>
                </v-tabs>
              </v-tabs-content>
            </v-tabs-items>
            <v-tabs-content id="tab-config">
              <v-container>
                <div v-if="item.module == 'article'">
                  <v-select :label="t('Order by')" :items="article.orderByOptions" single-line bottom v-model="item.module_config_json.order_by"></v-select>
                  <v-text-field :label="t('Items per page')" v-model="item.module_config_json.per_page"></v-text-field>
                </div>
                <div v-if="item.module == 'content'">
                  <p>Module Content do not have any configuration options</p>
                </div>
                <div v-if="item.module == 'user'">
                  <p>Module User do not have any configuration options</p>
                </div>
                <div v-if="item.module == 'gallery'">
                  <p>Module Gallery do not have any configuration options</p>
                </div>
              </v-container>
            </v-tabs-content>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'ArticlesEdit',
    mounted () {
      this.loadItem()
    },
    methods: {
      getComponent () {
        return this
      },
      slugify (text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
      },
      loadItem () {
        this.apiGet('backend/page/edit/' + this.$route.params.id).then((response) => {
          this.reset_loader = false
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.item.is_active = Boolean(this.item.is_active === '1')
            this.contents = response.body.contents
            this.languages = response.body.languages
            this.item.module_config = JSON.parse(this.item.module_config)
            this.item.module_config_json = JSON.parse(this.item.module_config_json)
            this.save_loader = false
            this.reset_loader = false
            this.delete_loader = false
          }
        })
      },
      saveItem () {
        this.save_loader = true

        let item = this.item
        item.is_active = item.is_active === true ? '1' : '0'
        item.is_published = item.is_published === true ? '1' : '0'
        item.module_config_json = JSON.stringify(item.module_config_json)
        item.module_config = JSON.stringify(item.module_config)
        this.apiPost('backend/page/savepage/' + this.item.id_page, item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            let promises = []
            this.languages.forEach((l) => {
              let p = new Promise((resolve, reject) => {
                this.apiPost('backend/page/savepagecontent/' + this.item.id_page, this.contents[l.id_language]).then((response) => {
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
                message: 'Article saved'
              })
              this.resetItem()
            }).catch((e) => {
              this.save_loader = false
              this.$root.$emit('show-alert', {
                type: 'error',
                message: e
              })
              this.resetItem()
            })
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.loadItem()
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
        article: {
          orderByOptions: [
            {value: 'created_at ASC', text: 'Creation date - ascending'},
            {value: 'created_at DESC', text: 'Creation date - descending'},
            {value: 'active_from ASC', text: 'Publish date - ascending'},
            {value: 'active_from DESC', text: 'Publish date - descending'}
          ]
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
