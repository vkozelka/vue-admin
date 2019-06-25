<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('New Job language')}}</span>
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
            </v-container>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'add',
    mounted() {
      this.resetItem();
    },
    methods: {
      saveItem () {
        this.save_loader = true
        let item = this.item
        this.apiPost('backend/joblanguage/save', item).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.save_loader = false
            this.$root.$emit('show-alert', {
              type: 'success',
              message: this.t('Saved')
            })
            this.$router.replace('/job-language/' + response.body.item.id_job_language)
          }
        })
      },
      resetItem() {
        this.reset_loader = true
        this.item = {
          name: ''
        }
        this.reset_loader = false
      },
      getComponent() {
        return this
      },
    },
    data() {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: {name:''},
        contents: [],
        languages: []
      }
    }
  }
</script>

<style scoped>

</style>