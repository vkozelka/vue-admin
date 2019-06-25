<template>
  <div class="datagrid-search">
    <v-select :items="allowedOptions" v-model="currentLimitOption" @change="limit($event)"></v-select>
  </div>
</template>

<script>
  export default {
    name: 'Search',
    props: ['current-limit','options'],
    mounted () {
      this.currentLimitOption = this.currentLimit
       if(this.options){
        this.allowedOptions=this.options
        this.currentLimitOption=this.options[0].value
        this.limit(this.options[0].value)
        }
    },
    methods: {
      limit (event) {
        this.$parent.$emit('change-limit', {
          limit: event
        })
      }
    },
    data () {
      return {
        currentLimitOption: 25,
        allowedOptions: [
          { text: '1', value: 1 },
          { text: '5', value: 5 },
          { text: '10', value: 10 },
          { text: '25', value: 25 },
          { text: '50', value: 50 },
          { text: this.t('All'), value: 99999 }
        ]
      }
    }
  }
</script>