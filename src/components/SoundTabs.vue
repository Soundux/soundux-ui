<template>
  <div>
    <v-tabs v-model="mutableActiveTabIndex" show-arrows>
      <draggable
        v-model="mutableTabs"
        class="v-slide-group__wrapper"
        v-bind="{
          animation: 200,
          ghostClass: 'ghost',
        }"
        @start="startDrag"
        @end="stopDrag"
      >
        <v-tab v-for="(tab, index) in $store.getters.tabs" :key="index" :disabled="showFavorites">
          {{ tab.name }}
          <v-icon
            right
            small
            color="grey"
            style="cursor: pointer"
            @click.stop="$store.commit('setTabToRemove', tab)"
          >
            mdi-close-circle
          </v-icon>
        </v-tab>
      </draggable>
    </v-tabs>

    <div
      v-if="showFavorites"
      :class="['v-tabs-items', $vuetify.theme.dark ? 'theme--dark' : 'theme--light']"
    >
      <NoFavoritesCard v-if="favorites.sounds.length === 0"></NoFavoritesCard>
      <LaunchpadView v-else-if="$store.getters.settings.viewMode === 2" :tab="favorites"></LaunchpadView>
      <GridView v-else-if="$store.getters.settings.viewMode === 1" :tab="favorites"></GridView>
      <ListView v-else :tab="favorites"></ListView>
    </div>

    <div v-else>
      <v-tabs-items :value="$store.getters.activeTabIndex">
        <v-tab-item v-for="(tab, index) in $store.getters.tabs" :key="index">
          <NoSoundsCard v-if="tab.sounds.length === 0"></NoSoundsCard>
          <LaunchpadView v-else-if="$store.getters.settings.viewMode === 2" :tab="tab"></LaunchpadView>
          <GridView v-else-if="$store.getters.settings.viewMode === 1" :tab="tab"></GridView>
          <ListView v-else :tab="tab"></ListView>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tab } from '@/types';
import draggable from 'vuedraggable';
import GridView from '@/components/views/GridView.vue';
import ListView from '@/components/views/ListView.vue';
import LaunchpadView from '@/components/views/LaunchpadView.vue';
import { mapGetters } from 'vuex';
import NoSoundsCard from '@/components/NoSoundsCard.vue';
import NoFavoritesCard from '@/components/NoFavoritesCard.vue';

export default Vue.extend({
  name: 'SoundTabs',
  data() {
    return {
      beforeDragActive: null as Tab | null,
    };
  },
  mounted() {
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  components: {
    NoFavoritesCard,
    NoSoundsCard,
    LaunchpadView,
    ListView,
    GridView,
    draggable,
  },
  computed: {
    mutableTabs: {
      get(): Tab[] {
        return this.$store.getters.tabs;
      },
      set(tabs: Tab[]) {
        this.$store.commit('setTabs', tabs);
      },
    },
    mutableActiveTabIndex: {
      get(): number {
        return this.$store.getters.activeTabIndex;
      },
      set(newIndex: number) {
        this.$store.dispatch('setActiveTabIndex', newIndex);
      },
    },
    ...mapGetters({
      favorites: 'favoritesTab',
    }),
    showFavorites: {
      get(): boolean {
        return this.$store.getters.showFavorites;
      },
      set(newValue: boolean) {
        this.$store.dispatch('setShowFavorites', newValue);
      },
    },
  },
  methods: {
    startDrag(): void {
      // save for stopDrag
      this.beforeDragActive = this.$store.getters.currentTab;
    },
    stopDrag(): void {
      // after dragging, the active tab index must be updated, as only the order in the tabs array is changed
      if (this.beforeDragActive) {
        this.$store.dispatch(
          'setActiveTabIndex',
          this.$store.getters.tabs.indexOf(this.beforeDragActive)
        );
      }
      this.$store.dispatch('moveTabs');
    },
    keyDownHandler(event: KeyboardEvent): void {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyR') {
        event.preventDefault();
        this.$store.dispatch('refreshTab');
      }
    },
  },
});
</script>

<style lang="scss">
// ghost class for vue draggable
.ghost {
  opacity: 0;
}

// we want our tabs to use the default cursor
.v-tab {
  cursor: default !important;
}

/*.v-tabs-slider {
  display: none !important;
}*/
</style>
