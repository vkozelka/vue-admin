<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Edit')}}: <span v-if="item">{{item.email}}</span></span>

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
      <v-btn color="red" flat @click="deleteItem(item.id_admin_user)" :loading="delete_loader">
        <v-icon>delete</v-icon>
        {{t('Delete')}}
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
              <v-text-field :label="t('Email')" v-model="item.email" required></v-text-field>
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
    name: 'AdminUserEdit',
    mounted() {
      this.loadItem()
    },
    methods: {
      getComponent() {
        return this
      },
      loadItem() {
        this.apiGet('backend/adminuser/edit/' + this.$route.params.id).then((response) => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: response.body.error
            })
          } else {
            this.item = response.body.item
            this.save_loader = false
            this.reset_loader = false
            this.delete_loader = false
          }
        })
      },
      saveItem() {
        this.save_loader = true
        let item = this.item
        this.apiPost('backend/adminuser/edit/' + this.$route.params.id, item).then((r) => {
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.$root.$emit('show-alert', {
              type: 'success',
              message: 'User edited'
            })
          }
          this.save_loader = false
          this.resetItem()
        })
      },
      resetItem() {
        this.reset_loader = true
        this.loadItem()
      },
      deleteItem(id) {
        if (confirm(this.t('Are you sure to delete admin user ?'))) {
          var data = {'id': id}
          this.apiPost('backend/adminuser/delete', data).then(r => {
            if (r.body.error) {
              this.$root.$emit('show-alert', {
                type: 'error',
                message: r.body.error
              })
            } else {
              this.$root.$emit('show-alert', {
                type: 'success',
                message: 'Admin user  deleted'
              })
              this.$router.push({name: 'admin-user'})

            }
          })
        }
      }
    },
    data() {
      return {
        save_loader: false,
        reset_loader: false,
        delete_loader: false,
        item: null,
        contents: [],
        languages: [],
        userRoles: [
          {text: 'Role: Admin', value: "1"},
          {text: 'Role: Team', value: "2"}
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
