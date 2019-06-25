<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Settings')}}</span>

    <v-container>
      <v-card>
        <v-card-title><h2>Banner on Home Page</h2></v-card-title>
        <v-card-text>

          <div v-if="actual_banner">
            <img class="banner-preview" :src="actual_banner" />
          </div>

          <ui-dropzone ref="bannerDropzone" target_path="images/home_page_banner" resource_url="backend/settings/bannerupload"></ui-dropzone>
        </v-card-text>
      </v-card>
    </v-container>

  </admin-layout>
</template>

<script>
  export default {
    name: 'Settings',
    mounted () {
      this.loadBanner()
      this.$refs.bannerDropzone.$on('upload-complete',() => {
        this.loadBanner()
      })
    },
    data () {
      return {
        actual_banner: null
      }
    },
    methods: {
      loadBanner () {
        this.apiGet('backend/settings/getbanner').then(r => {
          if (r && r.body && r.body.banner) {
            this.actual_banner = this.api_endpoint + r.body.banner.replace(/^\//,"")
          } else {
            this.actual_banner = this.api_endpoint + 'skins/jobrybnik/images/home.jpg'
          }
        }).catch(e => {
          this.actual_banner = this.api_endpoint + 'skins/jobrybnik/images/home.jpg'
        })
      }
    }
  }
</script>

<style>
  .banner-preview {
    max-width: 100%;
  }
</style>