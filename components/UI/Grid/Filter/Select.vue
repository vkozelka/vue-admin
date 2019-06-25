<template>
  <div class="datagrid-filter__select">
    <v-select :items="selectOptions" :value="selected" @change="change"></v-select>
  </div>
</template>

<script>
  export default {
    name: 'Select',
    props: ['column', 'current'],
    data () {
      return {
        selectOptions: [],
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
      if (typeof this.column.filterOptions.items === 'string') {
        // remote
        this.selectOptions = [{
          value: null, text: 'All'
        }]
        this.apiGet(this.column.filterOptions.items, {
          limit: 99999
        }).then(r => {
          if (r && r.body && r.body.items && r.body.items.length > 0) {
            r.body.items.forEach(i => {
              this.selectOptions.push({
                value: i[this.column.filterOptions.id], text: i[this.column.filterOptions.text]
              })
            })
            if (this.current) {
              this.selected = this.current
            }
          }
        })
      } else {
        // local
        this.selectOptions = [{
          value: null, text: 'All'
        }]
        this.column.filterOptions.items.forEach(i => {
          this.selectOptions.push(i)
        })
        if (this.current) {
          this.selected = this.current
        }
      }
    }
  }
</script>