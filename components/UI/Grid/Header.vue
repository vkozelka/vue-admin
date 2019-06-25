<template>
  <th class="datagrid-header" :class="getClass()" @click="sort()" :style="getStyle()">
    <v-icon v-if="column.index === sortColumn && sortDir === 'asc'">keyboard_arrow_up</v-icon>
    <v-icon v-if="column.index === sortColumn && sortDir === 'desc'">keyboard_arrow_down</v-icon>
    <v-tooltip v-if="column.tooltip" top>
      <div slot="activator" v-html="t(column.text) + '<sup>?</sup>'"></div>
      <span v-html="column.tooltip"></span>
    </v-tooltip>
    <span v-else v-html="t(column.text)"></span>
  </th>
</template>

<script>
  export default {
    name: 'Header',
    props: ['column', 'sortColumn', 'sortDir','totalItems','customStyle'],
    methods: {
      getClass () {
        return 'text-xs-' + this.column.align
      },
      sort () {
        if (this.column.sortable === true) {
          this.$parent.$emit('change-sort', {
            column: this.column.index,
            dir: this.column.index === this.sortColumn && this.sortDir === 'asc' ? 'desc' : 'asc'
          })
        }
      },
      getStyle(){
        if(this.customStyle){
        //  return this.style
        }else{
        }
        return ''

      }
    }
  }
</script>