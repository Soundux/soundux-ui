<template>
  <v-dialog
    v-model="searchModal"
    hide-overlay
    transition="scroll-y-transition"
    max-width="75vw"
    scrollable
    @keydown="dialogKeyDown"
  >
    <v-card flat height="500">
      <v-card-title>
        <v-text-field
          v-model="searchInput"
          id="searchField"
          :label="`${$t('actions.search')}...`"
          hide-details
          tabindex="-1"
          clearable
          prepend-icon="mdi-magnify"
          @input="resetSelectedIndex"
        ></v-text-field>
      </v-card-title>
      <v-card-text id="cardBody">
        <v-list v-if="searchInput && searchResults.length > 0" nav dense class="fill-height">
          <v-list-item-group :value="selectedResultIndex" id="searchResults">
            <v-list-item
              v-for="(result, index) in searchResults"
              tabindex="-1"
              :key="result.id"
              :value="index"
              @click="jumpToSound(result)"
            >
              <v-list-item-title class="text-wrap">{{ result.name }}</v-list-item-title>
              <v-spacer></v-spacer>
              <v-icon @click.stop="$store.dispatch('playSound', result)">mdi-play</v-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <template v-else-if="!searchInput && searchResults.length === 0">
          <v-row class="mx-5 mt-6" justify="center">
            <v-img src="../../assets/undraw_searching_p5ux.svg" height="220" contain></v-img>
          </v-row>
          <v-row class="mt-7" justify="center">
            <span>{{ $t('search.typeToSearch') }}</span>
          </v-row>
          <v-row class="mt-6" justify="center">
            <v-alert text dense class="text-subtitle-2">
              <i18n path="search.changeSelection" tag="div">
                <code slot="arrowKeys">{{ $t('input.arrowKeys') }}</code>
              </i18n>
              <i18n path="search.jumpToSelected" tag="div">
                <code slot="enter">{{ $t('input.enter') }}</code>
              </i18n>
              <i18n path="search.playSelected" tag="div">
                <code slot="shift">{{ $t('input.shift') }}</code>
                <code slot="enter">{{ $t('input.enter') }}</code>
              </i18n>
            </v-alert>
          </v-row>
          <v-row class="mt-3" justify="center"> </v-row>
          <v-row class="mt-3" justify="center"> </v-row>
        </template>
        <template v-else>
          <v-row class="mx-5 mt-6" justify="center">
            <v-img src="../../assets/undraw_void_3ggu.svg" height="220" contain></v-img>
          </v-row>
          <v-row class="mt-7" justify="center">
            <span>{{ $t('search.noResultsFound') }}</span>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Fuse from 'fuse.js';
import { Sound } from '@/types';

export default Vue.extend({
  name: 'SearchModal',
  data() {
    return {
      searchInput: '',
      selectedResultIndex: 0,
      fuse: null as Fuse<Sound> | null,
      unsubscribe: null as (() => void) | null,
    };
  },
  computed: {
    searchModal: {
      get(): boolean {
        return this.$store.getters.searchModal;
      },
      set(newValue: boolean) {
        this.$store.commit('setSearchModal', newValue);
      },
    },
    searchResults(): Sound[] {
      if (!this.searchInput || !this.fuse) {
        return [];
      }

      const result = this.fuse.search(this.searchInput);
      return result.map(({ item }) => item).slice(0, Math.min(result.length, 20));
    },
  },
  mounted() {
    document.addEventListener('keydown', this.keyDownHandler);
    this.fuse = new Fuse<Sound>(this.$store.getters.allSounds, {
      keys: ['name'],
    });
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === 'setTabs' || mutation.type === 'addTab') {
        this.resetSelectedIndex();
        this.fuse = new Fuse<Sound>(this.$store.getters.allSounds, {
          keys: ['name'],
        });
      }
    });
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  watch: {
    searchModal() {
      if (this.searchModal) {
        requestAnimationFrame(() => {
          const searchField = document.getElementById('searchField') as HTMLInputElement;
          searchField.focus();
          if (this.searchInput) {
            searchField.select();
          }
        });
      }
    },
    selectedResultIndex() {
      this.scrollSelectedIntoView();
    },
  },
  methods: {
    keyDownHandler(event: KeyboardEvent): void {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyF') {
        event.preventDefault();
        this.searchModal = !this.searchModal;
      }
    },
    resetSelectedIndex(): void {
      // we have to reset this once because Vuetify has a bug where the selected class is not set when the v-list-items get updated
      this.selectedResultIndex = -1;
      requestAnimationFrame(() => {
        this.selectedResultIndex = 0;
      });
    },
    scrollSelectedIntoView() {
      const searchResults = document.getElementById('searchResults') as HTMLElement;
      if (searchResults) {
        const resultItem = searchResults.childNodes[this.selectedResultIndex] as HTMLElement;
        const container = document.getElementById('cardBody') as HTMLElement;
        if (resultItem && container) {
          this.$vuetify.goTo(resultItem, {
            container,
            duration: 100,
            offset: 176,
          });
        }
      }
    },
    dialogKeyDown(event: KeyboardEvent): void {
      if (!this.searchModal) {
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.selectedResultIndex < this.searchResults.length - 1) {
          this.selectedResultIndex++;
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.selectedResultIndex > 0) {
          this.selectedResultIndex--;
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const sound = this.searchResults[this.selectedResultIndex];
        if (event.shiftKey) {
          this.$store.dispatch('playSound', sound);
        } else {
          this.jumpToSound(sound);
        }
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

          this.searchModal = false;
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