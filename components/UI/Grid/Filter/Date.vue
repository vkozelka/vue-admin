<template>
  <div class="datagrid-filter__date">
    <v-text-field type="date" :value="selected" @input="change"></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'Date',
    props: ['column', 'current'],
    data () {
      return {
        selected: null
      }
    },
    methods: {
      change (e) {
        this.selected = e
        this.$emit('change', {
          value: e
        })
      }
    },
    mounted () {
      if (this.current) {
        this.selected = this.current
      }
    }
  }
</script>