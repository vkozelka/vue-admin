<template>
  <!-- v-layout>
    <div class="left"><img src="../../assets/logo.png" width="80"></div>
    <div class="right">&copy; {{year}} <a href="https://www.creox.cz/" target="_blank">Creox s.r.o.</a></div>
  </v-layout-->
</template>

<script>
  export default {
    name: 'Footer',
    data () {
      return {
        year: this.getYear()
      }
    },
    methods: {
      getYear: function () {
        const d = new Date()
        return d.getUTCFullYear()
      }
    }
  }
</script>

<style scoped>
  .card-footer {
    float: right;
  }

  .card-footer {
    text-align: right;
    line-height: 14px;
    padding: 14px;
  }

  .logo {
    float: left;
    padding: 14px;
  }

  .clr {
    clear: both;
  }

  a {
    color: #ff5252 !important;
    text-decoration: none;
  }
</style>
