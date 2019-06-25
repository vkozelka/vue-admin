<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('New Article')}}</span>

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

        <v-form>
          <v-tabs>
            <v-tabs-bar light color="grey lighten-2">
              <v-tabs-slider color="blue"></v-tabs-slider>
              <v-tabs-item href="tab-basic">{{t('Basic info')}}</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Internal name')" v-model="item.name" required></v-text-field>
                  <v-checkbox :label="t('Is active?')" v-model="item.is_active" required></v-checkbox>
                  <!--v-checkbox :label="t('Is published?')" v-model="item.is_published" required></v-checkbox-->
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'ArticlesAdd',
    mounted () {
      this.resetItem()
    },
    methods: {
      getComponent () {
        return this
      },
      slugify (text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
      },
      saveItem () {
        this.save_loader = true

        let item = this.item
        item.is_active = item.is_active === true ? '1' : '0'
        item.is_published = item.is_published === true ? '1' : '0'
        item.article_config = JSON.stringify({is_premium: 0, is_abo: 0})
        item.article_config_json = JSON.stringify({is_premium: 0, is_abo: 0})
        this.apiPost('backend/article/savearticle', item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.save_loader = false
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Article saved'
            })
            this.$router.replace('/articles/' + response.body.item.id_article)
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.item = {
          name: '',
          is_active: false,
          is_published: false
        }
        this.reset_loader = false
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
