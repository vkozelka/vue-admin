<template>
    <admin-layout>
        <span slot="admin-page-title">{{t('Edit')}}: <span v-if="item">{{item.username}}</span></span>

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
            <v-btn color="red" flat @click="deleteItem()" :loading="delete_loader">
                <v-icon>delete</v-icon>
                {{t('Delete')}}
            </v-btn>
        </v-toolbar>

        <v-form v-if="item">
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
                            <v-text-field :label="t('Display name')" v-model="item.display_name"
                                          required></v-text-field>
                            <v-checkbox :label="t('Is active?')" false-value='0' true-value='1' v-model="item.is_active"
                                        required></v-checkbox>
                        </v-container>
                    </v-tabs-content>
                    <v-tabs-content id="tab-password">
                        <v-container>
                            <v-checkbox :label="t('Change password?')" v-model="change_password"
                                        v-if="item && item.id_user"></v-checkbox>
                            <v-text-field :label="t('Password')" v-model="password"
                                          v-if="!item || !item.id_user || change_password === true"
                                          required></v-text-field>
                            <v-text-field :label="t('Password Confirmation')" v-model="password_confirm"
                                          v-if="!item || !item.id_user || change_password === true"
                                          required></v-text-field>
                        </v-container>
                    </v-tabs-content>
                    <v-tabs-content id="tab-config">
                        <v-container>
                            <v-select :label="t('User role')" :items="userRoles" single-line bottom
                                      v-model="item.user_config.role" v-if="item && item.id_user"></v-select>
                        </v-container>
                    </v-tabs-content>
                </v-tabs-items>
            </v-tabs>
        </v-form>

    </admin-layout>
</template>

<script>
  export default {
    name: 'UsersEdit',
    mounted () {
      this.loadItem()
    },
    methods: {
      getComponent () {
        return this
      },
      loadItem () {
        this.apiGet('backend/user/edit/' + this.$route.params.id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.item.is_published = Boolean(this.item.is_published === '1')
            if (this.change_password === true) {
              this.item.password = this.password
            }
            this.save_loader = false
            this.reset_loader = false
            this.delete_loader = false
          }
        })
      },
      saveItem () {
        this.save_loader = true
        let item = this.item
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

        this.apiPost('backend/user/saveuser/' + this.item.id_user, item).then((response) => {
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
        this.loadItem()
      }
    },
    data () {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: null,
        change_password: false,
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
