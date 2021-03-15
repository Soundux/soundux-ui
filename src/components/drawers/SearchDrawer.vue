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
    <template v-else-if="!searchInput && searchResults.length === 0">
      <v-row class="mx-5 mt-6" justify="center">
        <v-img src="../../assets/undraw_searching_p5ux.svg" width="232"></v-img>
      </v-row>
      <v-row class="mt-5" justify="center">
        <span>{{ $t('search.typeToSearch') }}</span>
      </v-row>
    </template>
    <template v-else>
      <v-row class="mx-5 mt-6" justify="center">
        <v-img src="../../assets/undraw_void_3ggu.svg" width="232"></v-img>
      </v-row>
      <v-row class="mt-5" justify="center">
        <span>{{ $t('search.noResultsFound') }}</span>
      </v-row>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Fuse from 'fuse.js';
import { Sound } from '@/types';

export default Vue.extend({
  name: 'SearchDrawer',
  data() {
    return {
      searchInput: '',
    };
  },
  computed: {
    searchDrawer: {
      get(): boolean {
        return this.$store.getters.searchDrawer;
      },
      set(newValue: boolean) {
        this.$store.commit('setSearchDrawer', newValue);
      },
    },
    searchResults(): Sound[] {
      if (!this.searchInput) {
        return [];
      }

      const fuse = new Fuse<Sound>(this.$store.getters.allSounds, {
        keys: ['name'],
      });
      const result = fuse.search(this.searchInput);
      return result.map(({ item }) => item);
    },
  },
  mounted() {
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  methods: {
    drawerTransitioned(): void {
      const searchField = this.$refs.searchField as HTMLElement;
      if (this.$store.getters.searchDrawer) {
        searchField.focus();
      } else {
        this.searchInput = '';
        searchField.blur();
      }
    },
    keyDownHandler(event: KeyboardEvent): void {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyF') {
        event.preventDefault();
        this.searchDrawer = !this.searchDrawer;
      }
    },
    jumpToSound(result: Sound): void {
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
