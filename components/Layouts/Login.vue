<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex xs12 sm6 offset-sm3 md-4 offset-md4 lg4 offset-lg4>
            <slot />

            <ui-footer></ui-footer>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'LoginLayout'
  }
</script>