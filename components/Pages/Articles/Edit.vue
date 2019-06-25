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
              <v-tabs-item href="tab-images">{{t('Images')}}</v-tabs-item>
              <v-tabs-item href="tab-categories">{{t('Categories')}}</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Internal name')" v-model="item.name" required></v-text-field>
                  <v-checkbox :label="t('Is active?')" v-model="item.is_active" required></v-checkbox>
                  <!--v-checkbox :label="t('Is published?')" v-model="item.is_published" required></v-checkbox-->
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
                        <v-text-field :label="t('Author')" v-model="contents[l.id_language].author" required :counter="250" :rules="[(v) => v && v.length <= 250 || 'Max 250 characters', (v) => v && v.length > 0 || t('Required field')]"></v-text-field>

                        <div class="title">{{t('Introduction')}} <small><small><i>({{t('Show in article list')}})</i></small></small></div>
                        <ui-wysiwyg :init="getEditorConfig()" v-model="contents[l.id_language].introduction"></ui-wysiwyg>

                        <div class="title">{{t('Content')}}</div>
                        <ui-wysiwyg :init="getEditorConfig()" v-model="contents[l.id_language].body"></ui-wysiwyg>

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
              <v-tabs-content id="tab-images">
                <v-container>
                  <ui-grid ref="imageGrid" :component="getComponent()" :columns="imageColumns" :pager="true" :limiter="true" :search="true" :checkbox="true" id-field="id_image" :resource_url="'backend/article/images/' + item.id_article">
                    <template slot="grid-items" slot-scope="props">
                      <td class="text-xs-center"><ui-image :lightbox="false" :image_id="props.item.i.id_image" resource_url="backend/image/show" :mode="'resize'" :width="100" :height="100"></ui-image></td>
                      <td>{{props.item.i.filename}}<span v-if="props.item.is_main == true"> <i>({{t('Main image')}})</i></span><br /><small>{{props.item.i.path}}</small><br /><small>{{props.item.i.width}} x {{props.item.i.height}}, {{props.item.i.filesize|readableSize }}</small></td>
                      <td class="text-xs-center">{{datetimeFormat(props.item.i.created_at)}}</td>
                      <td class="text-xs-center">{{datetimeFormat(props.item.i.updated_at, t('Never'))}}</td>
                      <ui-grid-actions :component="getComponent()" :actions="getActions(props.item)"></ui-grid-actions>
                    </template>
                  </ui-grid>

                  <ui-dropzone ref="imageDropzone" :target_path="'article/' + item.id_article + '/images'" :resource_url="'backend/article/imageupload/' + item.id_article"></ui-dropzone>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
            <v-tabs-content id="tab-categories">
              <v-container>
                <ui-tree :component="getComponent()" :checkbox="true" resource_url="backend/article/categorytree" display_field="name" id_field="id_article_category" :selected_items="item.categories"></ui-tree>
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
      this.$on('change-selected', (categories) => {
        if (this.item && this.item.categories) {
          this.item.categories = categories
        }
      })
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'main':
            this.apiPost('backend/article/mainimage/' + this.item.id_article, {
              id_image: action.item.i.id_image
            }).then(r => {
              this.$refs.imageGrid.$emit('reload')
            }).catch(e => {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: e
              })
            })
            break
          case 'delete':
            if (confirm('Are you sure to delete image from article?')) {
              this.apiPost('backend/article/deleteimage/' + this.item.id_article, {
                id_image: action.item.i.id_image
              }).then(r => {
                this.$refs.imageGrid.$emit('reload')
              }).catch(e => {
                this.$root.$emit('show-alert', {
                  type: 'error',
                  message: e
                })
              })
            }
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
        this.apiGet('backend/article/edit/' + this.$route.params.id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.item.is_active = Boolean(this.item.is_active === '1')
            this.item.is_published = Boolean(this.item.is_published === '1')
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
        item.is_active = item.is_active === true ? '1' : '0'
        item.is_published = item.is_published === true ? '1' : '0'
        this.apiPost('backend/article/savearticle/' + this.item.id_article, item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            let promises = []
            this.languages.forEach((l) => {
              let p = new Promise((resolve, reject) => {
                this.apiPost('backend/article/savearticlecontent/' + this.item.id_article, this.contents[l.id_language]).then((response) => {
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
      },
      deleteItem(id_article){
        if (confirm(this.t('Are you sure to delete article ?'))) {
          this.apiPost('backend/article/delete', {id_article:  this.$route.params.id})
            .then(r => {
              if (r.body.status === true) {
                this.$root.$emit('show-alert', {
                  type: 'success',
                  message: this.t('Article deleted')
                })
                this.$router.push({name: 'articles'})
              } else {
                this.$root.$emit('show-alert', {
                  type: 'error',
                  message: r.body.message
                })
              }
            })
        }
      },
      getActions (item) {
        return [{
          type: 'main',
          title: 'Set as Main',
          icon: 'insert_photo',
          item: item
        }, {
          type: 'delete',
          title: 'Delete',
          icon: 'delete',
          item: item
        }]
      },
      getBulkActions () {
        return [{
          type: 'delete',
          title: 'Delete',
          icon: 'delete'
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
        imageColumns: [
          { text: 'Preview', align: 'center', sortable: false, index: null },
          { text: 'Filename', align: 'left', sortable: true, index: 'filename' },
          { text: 'Created', align: 'center', sortable: true, index: 'created_at' },
          { text: 'Last Update', align: 'center', sortable: true, index: 'updated_at' },
          { text: 'Actions', align: 'center', sortable: false, index: null }
        ]
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
