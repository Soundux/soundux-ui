<template>
  <v-navigation-drawer
    v-model="searchDrawer"
    app
    absolute
    right
    temporary
    @transitionend="drawerTransitioned"
  >
    <v-list-item class="px-2">
      <v-text-field
        ref="searchField"
        v-model="searchInput"
        label="Search..."
        hide-details
        prepend-icon="mdi-magnify"
      ></v-text-field>
    </v-list-item>
    <v-list v-if="searchInput && searchResults.length > 0" nav dense>
      <v-list-item-group>
        <v-list-item v-for="result in searchResults" :key="result.id">
          <v-list-item-title>{{ result.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-img
      v-else-if="!searchInput && searchResults.length === 0"
      max-width="200"
      class="mx-auto mt-5"
      src="undraw_searching_p5ux.svg"
    ></v-img>
    <v-img v-else max-width="200" class="mx-auto mt-5" src="undraw_void_3ggu.svg"></v-img>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SearchDrawer',
  data() {
    return {
      searchInput: '',
      keyDownHandler: (null as unknown) as (event: KeyboardEvent) => void | null,
    };
  },
  computed: {
    searchDrawer: {
      get() {
        return this.$store.getters.searchDrawer;
      },
      set(newValue: boolean) {
        this.$store.commit('setSearchDrawer', newValue);
      },
    },
    searchResults() {
      if (!this.searchInput) {
        return [];
      }
      return this.$store.getters.allSounds.filter(x =>
        x.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
  },
  mounted() {
    this.keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'KeyF') {
        event.preventDefault();
        this.$store.commit('toggleSearchDrawer');
      }
    };
    document.addEventListener('keydown', this.keyDownHandler);
  },
  destroyed() {
    if (this.keyDownHandler) {
      document.removeEventListener('keydown', this.keyDownHandler);
    }
  },
  methods: {
    drawerTransitioned() {
      const searchField = this.$refs.searchField as HTMLElement;
      if (this.$store.getters.searchDrawer) {
        searchField.focus();
      } else {
        this.searchInput = '';
        searchField.blur();
      }
    },
  },
});
</script>

<style scoped></style>
