<template>
  <div class="datagrid-pager">
    <v-pagination :length="totalPages" v-model="currentPageOption" @input="setPage($event)" :total-visible="13"></v-pagination>
  </div>
</template>

<script>
  export default {
    name: 'Pager',
    props: ['totalPages', 'currentPage'],
    mounted () {
      this.currentPageOption = this.currentPage
    },
    data () {
      return {
        currentPageOption: 1
      }
    },
    methods: {
      setPage (event) {
        this.$parent.$emit('change-page', {
          page: event
        })
      }
    }
  }
</script>