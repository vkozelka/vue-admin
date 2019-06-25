<template>
  <div class="datagrid-filter__text" style="width: 100%!important;overflow-x: hidden;">
    <v-text-field style="width: 100px" :value="selected" @input="change"></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'Ct',
    props: ['column', 'current'],
    data () {
      return {
        selected: null,
        typeTimeout: null
      }
    },
    methods: {
      change (e) {
        if (this.typeTimeout) {
          clearTimeout(this.typeTimeout)
        }
        this.typeTimeout = setTimeout(() => {
          this.selected = e
          this.$emit('change', {
            value: e
          })
        }, 500)
      }
    },
    mounted () {
      if (this.current) {
        this.selected = this.current
      }
    }
  }
</script>