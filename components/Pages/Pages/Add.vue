<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Add page')}}</span>

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
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Internal name')" v-model="item.name" required></v-text-field>
                  <v-checkbox :label="t('Is active?')" v-model="item.is_active" required></v-checkbox>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'PageAdd',
    mounted () {
      this.resetItem()
    },
    methods: {
      getComponent () {
        return this
      },
      saveItem () {
        this.save_loader = true

        let item = this.item
        item.is_active = item.is_active === true ? '1' : '0'
        item.is_published = item.is_published === true ? '1' : '0'
        item.module_config_json = JSON.stringify(item.module_config_json)
        this.apiPost('backend/page/savepage', item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.save_loader = false
            this.$router.push('/pages/' + response.body.item.id_page)
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Article saved'
            })
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.item = {
          id_parent: 0,
          code: null,
          name: null,
          module: 'content',
          controller: 'page',
          action: 'index',
          params: null,
          module_config_json: {},
          ordering: 1,
          is_active: 0,
          active_from: null,
          active_to: null
        }
        this.reset_loader = false
      }
    },
    data () {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: null
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
