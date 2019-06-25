<template>
    <admin-layout>
        <span slot="admin-page-title">{{t('Edit')}}: <span v-if="item">{{item.name}}</span></span>
        <v-toolbar>
            <v-btn flat @click="$router.go(-1)">
                <v-icon>keyboard_arrow_left</v-icon>
                {{t('Back')}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="green" flat @click="saveItem()" :loading="save_loader">
                <v-icon>save</v-icon>
                {{t('Save')}}
            </v-btn>
            <v-btn color="orange" flat @click="resetItem()" :loading="reset_loader">
                <v-icon>cancel</v-icon>
                {{t('Reset')}}
            </v-btn>
            <v-btn color="red" flat @click="deleteAddon(item.id_addon)" :loading="delete_loader">
                <v-icon>delete</v-icon>
                {{t('Delete')}}
            </v-btn>
        </v-toolbar>

        <v-form v-if="item">
            <v-tabs>
                <v-tabs-bar light color="grey lighten-2">
                    <v-tabs-slider color="blue"></v-tabs-slider>
                    <v-tabs-item href="tab-basic">{{t('Basic info')}}</v-tabs-item>
                    <v-tabs-item href="tab-content">{{t('Localized Content')}}</v-tabs-item>
                </v-tabs-bar>
                <v-tabs-items>
                    <v-tabs-content id="tab-basic">
                        <v-container>
                            <v-text-field :label="t('Internal name')" v-model="item.name" required></v-text-field>
                            <v-text-field type="number" :label="t('Price')" v-model="item.price" required></v-text-field>
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
                                        <v-text-field :label="t('Title')" v-model="contents[l.id_language].title" required :counter="250" :rules="[(v) => v && v.length <= 250 || 'Max 250 characters', (v) => v && v.length > 0 || t('Required field')]"></v-text-field>
                                    </v-container>
                                </v-tabs-content>
                            </v-tabs-items>
                        </v-tabs>
                    </v-tabs-content>
                </v-tabs-items>
            </v-tabs>
        </v-form>
    </admin-layout>
</template>

<script>
  export default {
    name: 'edit',
    mounted () {
      this.loadItem()
    },
    methods: {
      loadItem () {
        this.apiGet('backend/addon/edit/' + this.$route.params.id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.contents = response.body.contents
            this.languages = response.body.languages
            this.save_loader = false
            this.reset_loader = false
            this.delete_loader = false
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.loadItem()
      },
      saveItem () {
        this.save_loader = true
        let item = this.item
        this.apiPost('backend/addon/save/' + this.item.id_addon, item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            let promises = []
            this.languages.forEach((l) => {
              let p = new Promise((resolve, reject) => {
                this.apiPost('backend/addon/savecontent/' + this.item.id_addon, this.contents[l.id_language]).then((response) => {
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
                message: 'Addon saved'
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
      deleteAddon (id) {
        var data = {'id':id}
        this.apiPost('backend/addon/delete', data).then(r => {
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Addon deleted'
            })
            this.$router.push({name: 'addons'})
          }
        })
      }

    },

    data () {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: null,
        contents: [],
        languages: []
      }
    }
  }
</script>

<style scoped>

</style>