<template>
  <v-dialog v-model="dialog" persistent :max-width="type === 'error' ? 300 : 600">
    <v-card class=" text-xs-center">
      <v-card-title v-if="type" class="headline">
        <v-flex align-center>
          <v-icon x-large color="green" v-if="type === 'success'">done</v-icon>
          <v-icon x-large color="red" v-else-if="type === 'error'">error_outline</v-icon>
        </v-flex>
      </v-card-title>
      <v-card-text v-if="message">
        {{t(message)}}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-2" flat="flat" @click.native="close()">{{t('OK')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'Alert',
    mounted () {
      this.$root.$on('show-alert', (data) => {
        this.title = data.title
        this.type = data.type
        this.message = data.message
        this.dialog = true
      })
    },
    methods: {
      close () {
        this.dialog = false
      }
    },
    data () {
      return {
        dialog: false,
        title: null,
        message: null,
        type: null
      }
    }
  }
</script>