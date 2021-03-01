<template>
  <v-navigation-drawer v-model="searchDrawer" fixed right temporary @transitionend="drawerTransitioned">
    <v-list-item class="px-2">
      <v-text-field
        ref="searchField"
        v-model="searchInput"
        :label="`${$t('actions.search')}...`"
        hide-details
        prepend-icon="mdi-magnify"
      ></v-text-field>
    </v-list-item>
    <v-list v-if="searchInput && searchResults.length > 0" nav dense>
      <v-list-item-group>
        <v-list-item v-for="result in searchResults" :key="result.id" @click="jumpToSound(result)">
          <v-list-item-title class="text-wrap">{{ result.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-img
      v-else-if="!searchInput && searchResults.length === 0"
      max-width="200"
      class="mx-auto mt-5"
      src="../../assets/undraw_searching_p5ux.svg"
    ></v-img>
    <v-img v-else max-width="200" class="mx-auto mt-5" src="../../assets/undraw_void_3ggu.svg"></v-img>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { Sound } from '@/types';

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
      return this.$store.getters.allSounds.filter(({ name }: Sound) =>
        name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
  },
  mounted() {
    this.keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyF') {
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
    jumpToSound(result: Sound) {
      const { tabs } = this.$store.getters;
      for (const tab of tabs) {
        const { sounds } = tab;
        if (sounds.includes(result)) {
          const tabIndex = tabs.indexOf(tab);
          // only set when not already set
          if (this.$store.getters.activeTabIndex !== tabIndex) {
            this.$store.dispatch('setActiveTabIndex', tabIndex);
          }

          const soundIndex = sounds.indexOf(result);
          // only set when not already set
          if (tab.selectedSoundIndex !== soundIndex) {
            this.$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: soundIndex });
          }

          this.searchDrawer = false;
          const soundElement = document.getElementById(`sound-${result.id}`);
          if (soundElement) {
            window.setTimeout(() => {
              if (this.$store.getters.settings.gridView) {
                // grid view
                this.$vuetify.goTo(soundElement, {
                  container: document.getElementById('grid-view') as HTMLElement,
                });
              } else {
                // list view
                this.$vuetify.goTo(soundElement, {
                  container: document.getElementById('list-view') as HTMLElement,
                });
              }
            }, 20);
          }
          break;
        }
      }
    },
  },
});
</script>
