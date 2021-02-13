<template>
  <v-navigation-drawer
    v-model="searchDrawer"
    app
    absolute
    right
    temporary
    @transitionend="focusSearchField"
  >
    <v-list nav dense>
      <v-text-field ref="searchField" label="Search..." prepend-icon="mdi-magnify"></v-text-field>
      <v-list-item-group>
        <v-list-item v-for="x in 10" :key="x">
          <v-list-item-title>Search result {{ x }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SearchDrawer',

  computed: {
    searchDrawer: {
      get() {
        return this.$store.getters.searchDrawer;
      },
      set(newValue: boolean) {
        this.$store.commit('setSearchDrawer', newValue);
      },
    },
  },
  methods: {
    focusSearchField() {
      if (this.$store.getters.searchDrawer) {
        (this.$refs.searchField as HTMLElement).focus();
      }
    },
  },
});
</script>

<style scoped></style>
