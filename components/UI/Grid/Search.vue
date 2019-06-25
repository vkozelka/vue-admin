<template>
  <div class="datagrid-search">
    <v-text-field name="search" type="search" :clearable="true" :value="currentQuery" append-icon="search" :placeholder="t('Search something...')" @input="search($event)"></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'Search',
    props: ['currentQuery'],
    data () {
      return {
        typeTimeout: null
      }
    },
    methods: {
      search (event) {
        if (this.typeTimeout) {
          clearTimeout(this.typeTimeout)
        }
        this.typeTimeout = setTimeout(() => {
          this.$parent.$emit('change-search', {
            query: event
          })
        }, 500)
      }
    }
  }
</script>