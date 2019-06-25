<template>
    <v-app>
        <v-navigation-drawer
                fixed
                clipped
                app
                v-model="drawer"
        >
            <v-list dense v-if="items && items.length>0">
                <template v-for="(item, i) in items">
                    <v-layout row v-if="item.heading" align-center :key="i">
                        <v-flex xs12>
                            <v-subheader v-if="item.heading">
                                {{ t(item.heading) }}
                            </v-subheader>
                        </v-flex>
                    </v-layout>
                    <v-divider v-else-if="item.divider"></v-divider>
                    <v-spacer v-else-if="item.spacer"></v-spacer>
                    <v-list-tile v-else @click="click(item)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ t(item.text) }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar :color=layoutColor dark app clipped-left fixed>
            <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-xs-only" v-translate>Administration</span>
            </v-toolbar-title>
            <div class="d-flex align-left">
                <v-toolbar-title class="ml-0 pl-3">
                    <span class="hidden-xs-only"><slot name="admin-page-title"></slot></span>
                </v-toolbar-title>
            </div>
            <div class="d-flex align-center" style="margin-left: auto">
                <v-menu>
                    <v-btn icon slot="activator">
                        <v-icon>language</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="(translations,locale) in locales" :key="locale" @click="setLang(locale)">
                            <v-list-tile-content>
                                <v-list-tile-title dark color="blue">{{ translations["Language Title"] }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action v-if="locale == currentLocale">
                                <v-icon>check</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn icon>
                    <v-icon>chat_bubble</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>help</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <v-layout>
                    <v-flex column>
                        <slot/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer app fixed>
            <ui-footer></ui-footer>
        </v-footer>
    </v-app>
</template>

<script>
  import Auth from "../Lib/Auth";

  export default {
    name: 'AdminLayout',
    data: () => ({
      dialog: false,
      drawer: null,
      locales: [],
      currentLocale: null,
      items:[],
      itemsAdmin: [
        {icon: 'launch', text: 'Show site', target: '/'},
        {divider: true},
        {heading: 'Content'},
        {icon: 'dashboard', text: 'Dashboard', component: '/dashboard'},
        {icon: 'content_copy', text: 'Pages', component: '/pages'},
        {icon: 'import_contacts', text: 'Articles', component: '/articles'},
        {icon: 'view_comfy', text: 'Article Categories', component: '/article-categories'},
        {divider: true},
        {heading: 'Community'},
        {icon: 'people', text: 'Recruiters (Admin)', component: '/companies'},
        {icon: 'people', text: 'Recruiters (Team)', component: '/companies-team'},
        {icon: 'people', text: 'Candidates', component: '/users'},
        {icon: 'face', text: 'Admin users', component: '/admin-user'},
        {divider: true},
        {heading: 'Jobs'},
        {icon: 'people', text: 'Jobs (Admin)', component: '/jobs'},
        {icon: 'note', text: 'Job Logs (Admin)', component: '/job-logs'},
        {icon: 'note', text: 'Apply Logs (Admin)', component: '/app-logs'},
        {icon: 'error', text: 'Job Log Blacklist', component: '/job-log-blacklist'},
        {divider: true},
        {icon: 'people', text: 'Jobs (Team)', component: '/jobs-team'},
        {icon: 'note', text: 'Job Logs (Team)', component: '/job-logs-team'},
        {icon: 'note', text: 'Apply Logs (Team)', component: '/app-logs-team'},
        {divider: true},
        {heading: 'Media'},
        {icon: 'image', text: 'Images', component: '/images'},
        {icon: 'image', text: 'Share Images', component: '/share-images'},
        {divider: true},
        {heading: 'Options'},
        {icon: 'assessments', text: 'Job languages', component: '/job-languages'},
        {icon: 'language', text: 'Translations', component: '/translations'},
        {icon: 'add_shopping_cart', text: 'Addons', component: '/addons'},
        {icon: 'extension', text: 'Benefits', component: '/benefits'},
        {icon: 'email', text: 'Email templates', component: '/emails'},
        {icon: 'attach_money', text: 'Transactions', component: '/transactions'},
        {icon: 'settings', text: 'Settings', component: '/settings'},
        {divider: true},
        {icon: 'exit_to_app', text: 'Logout', handler: 'logout'},
      ],
      itemsTeam: [
        {icon: 'launch', text: 'Show site', target: '/'},
        {divider: true},
        {heading: 'Community'},
        {icon: 'people', text: 'Recruiters (Team)', component: '/companies-team'},
        {divider: true},
        {heading: 'Jobs'},
        {icon: 'people', text: 'Jobs (Team)', component: '/jobs-team'},
        {icon: 'note', text: 'Job Logs (Team)', component: '/job-logs-team'},
        {icon: 'note', text: 'App Logs (Team)', component: '/app-logs-team'},
        {divider: true},
        {heading: 'Media'},
        {icon: 'image', text: 'Images', component: '/images'},
        {icon: 'image', text: 'Share Images', component: '/share-images'},
        {divider: true},
        {heading: 'Options'},
        {icon: 'assessment', text: 'Job languages', component: '/job-languages'},
        {icon: 'language', text: 'Translations', component: '/translations'},
        {icon: 'add_shopping_cart', text: 'Addons', component: '/addons'},
        {icon: 'extension', text: 'Benefits', component: '/benefits'},
        {divider: true},
        {icon: 'exit_to_app', text: 'Logout', handler: 'logout'}
      ],
      layoutColor:'dark-black'
    }),
    mounted () {
      if(window.location.hostname.substr(0, 4)=='beta'){
       this.layoutColor='dark-grey';
      }else{
        this.layoutColor='blue';
      }
      this.currentLocale = localStorage.getItem('x-admin-language') || this.$translate.lang
      this.locales = this.$root.$options.locales
      Auth.isLogged().then(r=>{
        if(r.body.adminUser.id_admin_user_role=="1"){
          this.items=this.itemsAdmin
        }else{
          this.items=this.itemsTeam
        }
      })
    },
    methods: {
      logout () {
        localStorage.removeItem('x-auth-admin-token')
        this.$router.replace('/')
      },
      setLang (locale) {
        localStorage.setItem('x-admin-language', locale)
        this.$translate.setLang(locale)
        this.currentLocale = this.$translate.current
      },
      click (menu) {
        if (menu.target) {
          window.open(menu.target, '_blank')
        } else if (menu.component) {
          this.$router.push(menu.component)
        } else if (menu.handler) {
          this[menu.handler]()
        }
      },
      getAdmin() {
        var token = localStorage.getItem('x-auth-admin-token')
      }
    },
    props: {
      source: String
    }
  }
</script>