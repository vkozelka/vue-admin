<template>
  <div>
    <v-menu lazy :close-on-content-click="false" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="130px">
      <v-text-field style="width: 130px;" slot="activator" label="From" v-model="date.from"  prepend-icon="event" ></v-text-field>
      <v-date-picker no-title scrollable actions  v-model="date.from">
        <template slot-scope="{ save, cancel }">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">OK</v-btn>
          </v-card-actions>
        </template>
      </v-date-picker>
    </v-menu>

    <v-menu lazy :close-on-content-click="false" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="130px">
      <v-text-field style="width: 130px;" slot="activator" label="To"  v-model="date.to" prepend-icon="event"></v-text-field>
      <v-date-picker no-title scrollable actions  v-model="date.to">
        <template slot-scope="{ save, cancel }">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">OK</v-btn>
          </v-card-actions>
        </template>
      </v-date-picker>
    </v-menu>

  </div>
</template>

<script>
  export default {
    name: "DatePickerRange",
    data() {
      return {
        date: {
          from: null,
          to: null
        }
      }
    },
    watch:{
      'date.from'() {
        this.callChange()
      },
      'date.to'() {
        this.callChange()
      }
    },
    methods:{
      callChange(){
        this.$emit('change', {
          value: this.date
        })
      }
    }
  }
</script>

<style scoped>

</style>