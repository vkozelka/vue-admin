<template>
  <div class="datagrid-filter__date-range">
    <v-text-field type="date" :value="selected.from" @input="changeFrom"></v-text-field>
    <v-text-field type="date" :value="selected.to" @input="changeTo"></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'Date',
    props: ['column', 'current'],
    data () {
      return {
        selected: {
          from: null,
          to: null
        }
      }
    },
    methods: {
      changeFrom (e) {
        this.selected.from = e
        this.$emit('change', {
          value: {
            from: this.selected.from,
            to: this.selected.to
          }
        })
      },
      changeTo (e) {
        this.selected.to = e
        this.$emit('change', {
          value: {
            from: this.selected.from,
            to: this.selected.to
          }
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