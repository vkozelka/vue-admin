<template>
  <login-layout>
    <v-card>
      <v-card-title>
        <div class="card-inner">
          <h2 v-translate>Login to Administration</h2>
          <v-form>
            <v-text-field :label="t('E-mail')" v-model="loginData.email" required></v-text-field>
            <v-text-field :type="!passwordVisible ? 'password' : 'text'" :label="t('Password')" v-model="loginData.password" required :append-icon="passwordVisible ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passwordVisible = !passwordVisible)"></v-text-field>
            </v-container>
          </v-form>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="login()" color="green darken-4" :dark="true">{{ t('Login') }}</v-btn>
      </v-card-actions>
    </v-card>
  </login-layout>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        errorMessage: null,
        passwordVisible: false,
        loginData: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      login: function () {
        this.apiPost('backend/login/index', this.loginData).then(response => {
          if (response.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              title: 'Error',
              message: response.body.error
            })
          } else if (response.body.adminUser) {
            localStorage.setItem('x-auth-admin-token', response.body.adminUser.token)
            if (response.body.adminUser.id_admin_user_role == 1) {
              this.$router.push({name: 'dashboard'})
            }else{
              this.$router.push({name: 'companies-team'})


            }
          }
        })
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-inner {
    width: 100%;
    text-align: center;
    padding: 10px;
  }
</style>
