<template>
    <v-menu offset-y>
      <v-btn small icon flat slot="activator"><v-icon>more_vert</v-icon></v-btn>
      <v-list :dense="true">
        <v-list-tile v-for="item in actions" :key="item.type" @click="clickAction(item)">
          <v-list-tile-title><v-icon v-if="item.icon">{{item.icon}}</v-icon> {{ t(item.title) }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
</template>

<script>
  export default {
    name: 'ActionBulk',
    props: ['actions', 'component'],
    methods: {
      clickAction (action) {
        this.component.$emit('bulk-action-clicked', action)
      }
    }
  }
</script>