<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('New Admin User')}}</span>

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
                  <v-text-field :label="t('Email')" v-model="item.email" required></v-text-field>
                  <v-text-field :label="t('Password')" v-model="item.password" required></v-text-field>

                  <v-select :label="t('Admin Role')" :items="userRoles" single-line bottom v-model="item.id_admin_user_role" v-if="item"></v-select>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'AdminUserAdd',
    mounted () {
      this.resetItem()
      this.item.id_admin_user_role=2
    },
    methods: {
      getComponent () {
        return this
      },
      saveItem () {
        this.save_loader = true

        let item = this.item
        this.apiPost('backend/adminuser/create', item).then((response) => {

          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.save_loader = false
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'Admin user created'
            })
            this.save_loader=false
            this.$router.push({name: 'admin-user'})
          }

        })
      },
      resetItem () {
        this.reset_loader = true
        this.item = {
          email: '',
          password: '',
          id_admin_user_role: 2
        }
        this.reset_loader = false,
        this.save_loader= false
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
        userRoles: [
          {text: 'Role: Admin', value: 1},
          {text: 'Role: Team', value: 2}
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
