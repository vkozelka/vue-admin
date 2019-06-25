<template>
  <th  class="datagrid-filter">
    <div v-if="column.filter">
      <component :is="'filter-' + column.filter" :column="column" @change="change"></component>
    </div>
  </th>
</template>

<script>
  import FilterDate from './Filter/Date'
  import FilterDateRange from './Filter/DateRange'
  import FilterDatePickerRange from './Filter/DatePickerRange'
  import FilterSelect from './Filter/Select'
  import FilterFullText from './Filter/FullText'

  export default {
    name: 'GridFilter',
    components: {
      'filter-date': FilterDate,
      'filter-date-range': FilterDateRange,
      'filter-date-picker-range': FilterDatePickerRange,
      'filter-select': FilterSelect,
      'filter-full-text': FilterFullText
    },
    props: ['column'],
    methods: {
      change (e) {
        this.$parent.$emit('change-filter', {
          column: this.column.filterColumn,
          type: this.column.filter,
          value: e.value
        })
      }
    }
  }
</script>