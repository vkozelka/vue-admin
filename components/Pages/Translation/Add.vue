<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Add translation')}}</span>

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
                  <v-text-field :label="t('Module')" v-model="item.module" required></v-text-field>
                  <v-text-field :label="t('Code')" v-model="item.code" required></v-text-field>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'TranslationAdd',
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
        this.apiPost('backend/translation/add', item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.save_loader = false
            this.$router.push('/translations')
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Translation added'
            })
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.item = {
          code: null,
          module: null
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
