<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Add User')}}</span>

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
              <v-tabs-item href="tab-password">{{t('Password')}}</v-tabs-item>
              <v-tabs-item href="tab-config">{{t('User Configuration')}}</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="tab-basic">
                <v-container>
                  <v-text-field :label="t('Username')" v-model="item.username" required></v-text-field>
                  <v-text-field :label="t('E-mail')" v-model="item.email" required></v-text-field>
                  <v-text-field :label="t('Display name')" v-model="item.display_name" required></v-text-field>
                  <v-checkbox :label="t('Is active?')" v-model="item.is_active" required></v-checkbox>
                </v-container>
              </v-tabs-content>
              <v-tabs-content id="tab-password">
                <v-container>
                  <v-text-field :label="t('Password')" v-model="password" required></v-text-field>
                  <v-text-field :label="t('Password Confirmation')" v-model="password_confirm" required></v-text-field>
                </v-container>
              </v-tabs-content>
              <v-tabs-content id="tab-config">
                <v-container>
                  <v-select :label="t('User role')" :items="userRoles" single-line bottom v-model="item.user_config.role"></v-select>
                </v-container>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-form>

  </admin-layout>
</template>

<script>
  export default {
    name: 'UsersAdd',
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
        item.change_password = this.change_password === true ? '1' : '0'
        item.user_config = JSON.stringify(item.user_config)

        if (this.change_password === true || !this.item || !this.item.id_user) {
          if (this.password !== this.password_confirm) {
            this.save_loader = false
            this.$root.$emit('show-alert', {
              type: 'error',
              message: this.t('Passwords not match')
            })
            return false
          } else {
            item.password = this.password
          }
        }

        this.apiPost('backend/user/saveuser', item).then((response) => {
          this.save_loader = false
          if (response.body.error) {
            this.resetItem()
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'User saved'
            })
          }
        })
      },
      resetItem () {
        this.reset_loader = true
        this.item = {
          email: '',
          username: '',
          display_name: '',
          user_config: {},
          is_active: 0
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
        change_password: true,
        password: '',
        password_confirm: '',
        userRoles: [
          {text: 'Role: User', value: 'user'},
          {text: 'Role: User with ABO', value: 'abo_user'}
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
